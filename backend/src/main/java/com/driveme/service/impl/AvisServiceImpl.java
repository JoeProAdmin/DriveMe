package com.driveme.service.impl;

import com.driveme.dto.AvisDTO;
import com.driveme.entity.Avis;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.Course;
import com.driveme.entity.CourseStatus;
import com.driveme.entity.Paiement;
import com.driveme.entity.PaiementStatut;
import com.driveme.entity.Passager;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.AvisRepository;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.PaiementRepository;
import com.driveme.repository.PassagerRepository;
import com.driveme.service.AvisService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class AvisServiceImpl implements AvisService {

    private final AvisRepository avisRepository;
    private final CourseRepository courseRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final PassagerRepository passagerRepository;
    private final PaiementRepository paiementRepository;

    public AvisServiceImpl(
            AvisRepository avisRepository,
            CourseRepository courseRepository,
            ChauffeurRepository chauffeurRepository,
            PassagerRepository passagerRepository,
            PaiementRepository paiementRepository) {

        this.avisRepository = avisRepository;
        this.courseRepository = courseRepository;
        this.chauffeurRepository = chauffeurRepository;
        this.passagerRepository = passagerRepository;
        this.paiementRepository = paiementRepository;
    }

    @Override
    @Transactional
    public void soumettreAvis(
            AvisDTO avisDTO,
            String identifiantUtilisateur) {

        Passager passagerConnecte = passagerRepository
                .findByUtilisateur_EmailOrUtilisateur_Telephone(
                        identifiantUtilisateur,
                        identifiantUtilisateur
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Passager connecté introuvable"
                        )
                );

        Course course = courseRepository
                .findByIdForUpdate(avisDTO.getCourseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable")
                );

        if (course.getPassager() == null
                || course.getPassager().getId() == null
                || !course.getPassager().getId().equals(passagerConnecte.getId())) {

            throw new SecurityException(
                    "Cette course n'appartient pas au passager connecté"
            );
        }

        if (course.getStatut() != CourseStatus.TERMINEE) {
            throw new IllegalStateException(
                    "Un avis peut uniquement être déposé pour une course terminée"
            );
        }

        Chauffeur chauffeur = course.getChauffeur();

        if (chauffeur == null) {
            throw new IllegalStateException(
                    "Aucun chauffeur n'est associé à cette course"
            );
        }

        Paiement paiement = paiementRepository
                .findByCourseId(course.getId())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "La course doit être payée avant le dépôt d'un avis"
                        )
                );

        if (paiement.getStatut() != PaiementStatut.PAYE) {
            throw new IllegalStateException(
                    "Le paiement de cette course n'est pas validé"
            );
        }

        if (avisRepository.existsByCourseId(course.getId())) {
            throw new IllegalStateException(
                    "Un avis a déjà été déposé pour cette course"
            );
        }

        Avis avis = new Avis();
        avis.setCourse(course);
        avis.setChauffeur(chauffeur);
        avis.setNote(avisDTO.getNote());
        avis.setCommentaire(nettoyerCommentaire(avisDTO.getCommentaire()));

        try {
            avisRepository.saveAndFlush(avis);
        } catch (DataIntegrityViolationException exception) {
            throw new IllegalStateException(
                    "Un avis a déjà été déposé pour cette course"
            );
        }

        recalculerNoteMoyenne(chauffeur);
    }

    private String nettoyerCommentaire(String commentaire) {
        if (commentaire == null) {
            return null;
        }

        String commentaireNettoye = commentaire.trim();

        return commentaireNettoye.isEmpty()
                ? null
                : commentaireNettoye;
    }

    private void recalculerNoteMoyenne(Chauffeur chauffeur) {
        List<Avis> avisChauffeur =
                avisRepository.findByChauffeur(chauffeur);

        double moyenne = avisChauffeur.stream()
                .mapToInt(Avis::getNote)
                .average()
                .orElse(0.0);

        chauffeur.setNoteMoyenne(
                BigDecimal.valueOf(moyenne)
                        .setScale(2, RoundingMode.HALF_UP)
        );

        chauffeurRepository.save(chauffeur);
    }
}