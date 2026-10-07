package com.driveme.service.impl;
import com.driveme.entity.Course;
import com.driveme.entity.CourseStatus;
import com.driveme.entity.PaiementStatut;

import com.driveme.dto.PassagerCreateDTO;
import com.driveme.dto.PassagerResponseDTO;
import com.driveme.entity.Language;
import com.driveme.entity.Passager;
import com.driveme.entity.Role;
import com.driveme.entity.Utilisateur;
import com.driveme.exception.BusinessRuleException;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.PassagerRepository;
import com.driveme.repository.SosIncidentRepository;
import com.driveme.repository.UtilisateurRepository;
import com.driveme.service.PassagerService;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PassagerServiceImpl implements PassagerService {

    private final PassagerRepository passagerRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final CourseRepository courseRepository;
    private final SosIncidentRepository sosIncidentRepository;
    private final PasswordEncoder passwordEncoder;

    public PassagerServiceImpl(PassagerRepository passagerRepository,
                               UtilisateurRepository utilisateurRepository,
                               CourseRepository courseRepository,
                               SosIncidentRepository sosIncidentRepository,
                               PasswordEncoder passwordEncoder) {
        this.passagerRepository = passagerRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.courseRepository = courseRepository;
        this.sosIncidentRepository = sosIncidentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public PassagerResponseDTO createPassager(PassagerCreateDTO dto) {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setTelephone(dto.getTelephone());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setMotDePasse("test123");
        utilisateur.setRole(Role.PASSAGER);
        utilisateur.setLanguage(Language.FR);

        utilisateur = utilisateurRepository.save(utilisateur);

        Passager passager = new Passager();
        passager.setUtilisateur(utilisateur);
        passager.setPhotoUrl(dto.getPhotoUrl());

        return mapToDTO(passagerRepository.save(passager));
    }

    @Override
    public List<PassagerResponseDTO> getAllPassagers() {
        return passagerRepository.findAllByOrderByDateCreationDescIdDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PassagerResponseDTO getPassagerById(Long id) {
        Passager passager = passagerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

        return mapToDTO(passager);
    }

    @Override
    public PassagerResponseDTO getPassagerByEmail(String email) {
        Passager passager = passagerRepository.findByUtilisateur_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

        return mapToDTO(passager);
    }

    @Override
    public PassagerResponseDTO updatePassager(Long id, PassagerCreateDTO dto) {
        Passager passager = passagerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

        Utilisateur utilisateur = passager.getUtilisateur();
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setTelephone(dto.getTelephone());
        utilisateur.setEmail(dto.getEmail());

        utilisateurRepository.save(utilisateur);

        passager.setPhotoUrl(dto.getPhotoUrl());

        return mapToDTO(passagerRepository.save(passager));
    }

    @Override
    @Transactional
    public void deletePassager(Long id) {
        Passager passager = passagerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

        Utilisateur utilisateur = passager.getUtilisateur();
        Long utilisateurId = utilisateur.getId();

        if (courseRepository.existsByPassagerId(id)) {
            throw new BusinessRuleException(
                    "Suppression impossible : ce passager possède un historique de courses. " +
                    "Son compte doit être conservé pour garantir la traçabilité."
            );
        }

        if (sosIncidentRepository.existsByUtilisateurId(utilisateurId)) {
            throw new BusinessRuleException(
                    "Suppression impossible : ce passager possède un historique d'incidents SOS. " +
                    "Son compte doit être conservé pour garantir la traçabilité."
            );
        }

        passagerRepository.delete(passager);
        passagerRepository.flush();
        utilisateurRepository.delete(utilisateur);
    }

    @Override
    @Transactional
    public void deleteCurrentPassager(String email) {
        Passager passager = passagerRepository.findByUtilisateur_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

        Utilisateur utilisateur = passager.getUtilisateur();
        Long utilisateurId = utilisateur.getId();

        List<Course> courses = courseRepository.findByPassagerId(passager.getId());

        boolean courseActive = courses.stream().anyMatch(course ->
                course.getStatut() != CourseStatus.TERMINEE
                        && course.getStatut() != CourseStatus.ANNULEE);
        if (courseActive) {
            throw new BusinessRuleException(
                    "Une course est encore active. Terminez-la ou annulez-la avant de fermer votre compte. "
                            + "Pour une demande d'effacement, écrivez à privacy@driveme.cloud.");
        }

        boolean paiementNonResolue = courses.stream().anyMatch(course ->
                course.getStatut() == CourseStatus.TERMINEE
                        && (course.getPaiement() == null
                        || course.getPaiement().getStatut() != PaiementStatut.PAYE));
        if (paiementNonResolue) {
            throw new BusinessRuleException(
                    "Un paiement reste à résoudre. Écrivez à support@driveme.cloud pour le paiement "
                            + "ou à privacy@driveme.cloud pour demander la fermeture ou l'effacement de vos données.");
        }

        boolean historiqueCourse = courseRepository.existsByPassagerId(passager.getId());
        boolean historiqueSos = sosIncidentRepository.existsByUtilisateurId(utilisateurId);

        if (historiqueSos) {
            throw new BusinessRuleException(
                    "Votre compte est associe a un incident SOS. "
                            + "Écrivez à privacy@driveme.cloud pour demander sa fermeture et l'effacement "
                            + "de vos donnees, avec examen des informations necessaires au suivi.");
        }

        if (!historiqueCourse && !historiqueSos) {
            passagerRepository.delete(passager);
            passagerRepository.flush();
            utilisateurRepository.delete(utilisateur);
            return;
        }

        passager.setPhotoUrl(null);

        utilisateur.setNom("Utilisateur");
        utilisateur.setPrenom("Supprimé");
        utilisateur.setEmail("deleted-" + UUID.randomUUID() + "@deleted.invalid");
        utilisateur.setTelephone(String.format("+999%015d", utilisateurId));
        utilisateur.setMotDePasse(passwordEncoder.encode(UUID.randomUUID().toString()));
        utilisateur.setConditionsAccepteesAt(null);
        utilisateur.setVersionConditions(null);

        utilisateurRepository.save(utilisateur);
        passagerRepository.save(passager);
    }
    @Override
    public long count() {
        return passagerRepository.count();
    }

    private PassagerResponseDTO mapToDTO(Passager passager) {
        return new PassagerResponseDTO(
                passager.getId(),
                passager.getUtilisateur().getNom(),
                passager.getUtilisateur().getPrenom(),
                passager.getUtilisateur().getTelephone(),
                passager.getUtilisateur().getEmail(),
                passager.getPhotoUrl(),
                passager.getDateCreation()
        );
    }
}
