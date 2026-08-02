package com.driveme.service.impl;

import com.driveme.dto.PaiementCreateDTO;
import com.driveme.dto.PaiementResponseDTO;
import com.driveme.entity.Course;
import com.driveme.entity.CourseStatus;
import com.driveme.entity.Paiement;
import com.driveme.entity.PaiementMethode;
import com.driveme.entity.PaiementStatut;
import com.driveme.entity.Passager;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.PaiementRepository;
import com.driveme.repository.PassagerRepository;
import com.driveme.service.PaiementService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaiementServiceImpl implements PaiementService {

    private final PaiementRepository paiementRepository;
    private final CourseRepository courseRepository;
    private final PassagerRepository passagerRepository;

    public PaiementServiceImpl(
            PaiementRepository paiementRepository,
            CourseRepository courseRepository,
            PassagerRepository passagerRepository
    ) {
        this.paiementRepository = paiementRepository;
        this.courseRepository = courseRepository;
        this.passagerRepository = passagerRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return paiementRepository.count();
    }

    @Override
    public PaiementResponseDTO validerPaiement(
            PaiementCreateDTO dto,
            String identifiant
    ) {
        if (dto == null) {
            throw new IllegalArgumentException(
                    "Les données du paiement sont obligatoires"
            );
        }

        if (dto.getCourseId() == null) {
            throw new IllegalArgumentException(
                    "L'identifiant de la course est obligatoire"
            );
        }

        if (dto.getMethode() == null || dto.getMethode().isBlank()) {
            throw new IllegalArgumentException(
                    "La méthode de paiement est obligatoire"
            );
        }

        Passager passager = rechercherPassagerConnecte(identifiant);

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable")
                );

        verifierProprietaire(course, passager);
        verifierCoursePayable(course);

        if (paiementRepository.existsByCourseId(course.getId())) {
            throw new IllegalStateException(
                    "Un paiement existe déjà pour cette course"
            );
        }

        PaiementMethode methode = convertirMethode(dto.getMethode());
        BigDecimal montant = determinerMontant(course);

        Paiement paiement = new Paiement();
        paiement.setCourse(course);
        paiement.setMontant(montant);
        paiement.setMethode(methode);
        paiement.setStatut(PaiementStatut.PAYE);
        paiement.setDatePaiement(LocalDateTime.now());

        Paiement saved = paiementRepository.save(paiement);
        course.setPaiement(saved);

        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PaiementResponseDTO getPaiementByCourse(
            Long courseId,
            String identifiant
    ) {
        if (courseId == null) {
            throw new IllegalArgumentException(
                    "L'identifiant de la course est obligatoire"
            );
        }

        Passager passager = rechercherPassagerConnecte(identifiant);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable")
                );

        verifierProprietaire(course, passager);

        Paiement paiement = paiementRepository.findByCourseId(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Aucun paiement trouvé pour cette course"
                        )
                );

        return mapToDTO(paiement);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaiementResponseDTO> getAllPaiements() {
        return paiementRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PaiementResponseDTO refuserPaiement(Long paiementId) {
        if (paiementId == null) {
            throw new IllegalArgumentException(
                    "L'identifiant du paiement est obligatoire"
            );
        }

        Paiement paiement = paiementRepository.findById(paiementId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Paiement introuvable")
                );

        if (paiement.getStatut() == PaiementStatut.PAYE) {
            throw new IllegalStateException(
                    "Un paiement déjà payé ne peut pas être refusé"
            );
        }

        if (paiement.getStatut() == PaiementStatut.REFUSE) {
            throw new IllegalStateException(
                    "Ce paiement est déjà refusé"
            );
        }

        paiement.setStatut(PaiementStatut.REFUSE);
        paiement.setDatePaiement(LocalDateTime.now());

        return mapToDTO(
                paiementRepository.save(paiement)
        );
    }

    private Passager rechercherPassagerConnecte(String identifiant) {
        if (identifiant == null || identifiant.isBlank()) {
            throw new AccessDeniedException(
                    "Utilisateur authentifié introuvable"
            );
        }

        String valeur = identifiant.trim();

        return passagerRepository
                .findByUtilisateur_EmailOrUtilisateur_Telephone(
                        valeur,
                        valeur
                )
                .orElseThrow(() ->
                        new AccessDeniedException(
                                "Aucun profil passager ne correspond à l'utilisateur connecté"
                        )
                );
    }

    private void verifierProprietaire(
            Course course,
            Passager passager
    ) {
        if (course.getPassager() == null
                || course.getPassager().getId() == null
                || passager.getId() == null
                || !course.getPassager().getId().equals(passager.getId())) {
            throw new AccessDeniedException(
                    "Vous ne pouvez pas accéder au paiement de cette course"
            );
        }
    }

    private void verifierCoursePayable(Course course) {
        if (course.getChauffeur() == null) {
            throw new IllegalStateException(
                    "Le paiement est impossible tant qu'aucun chauffeur n'est affecté"
            );
        }

        if (course.getStatut() != CourseStatus.TERMINEE) {
            throw new IllegalStateException(
                    "Seule une course terminée peut être payée"
            );
        }
    }

    private BigDecimal determinerMontant(Course course) {
        BigDecimal montant = course.getPrixFinal();

        if (montant == null) {
            montant = course.getPrix();
        }

        if (montant == null || montant.signum() <= 0) {
            throw new IllegalStateException(
                    "Le montant de la course est invalide"
            );
        }

        return montant;
    }

    private PaiementMethode convertirMethode(String methode) {
        try {
            return PaiementMethode.valueOf(
                    methode.trim().toUpperCase(Locale.ROOT)
            );
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "Méthode de paiement invalide. "
                            + "Valeurs autorisées : CASH, CARTE, ONLINE"
            );
        }
    }

    private PaiementResponseDTO mapToDTO(Paiement paiement) {
        Long courseId = paiement.getCourse() != null
                ? paiement.getCourse().getId()
                : null;

        return new PaiementResponseDTO(
                paiement.getId(),
                courseId,
                paiement.getMontant(),
                paiement.getMethode().name(),
                paiement.getStatut().name(),
                paiement.getDatePaiement()
        );
    }
}