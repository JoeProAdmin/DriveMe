package com.driveme.service.impl;

import com.driveme.entity.*;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.PaiementRepository;
import com.driveme.service.PaiementService;
import org.springframework.stereotype.Service;

@Service
public class PaiementServiceImpl implements PaiementService {

    private final PaiementRepository paiementRepository;
    private final CourseRepository courseRepository;

    public PaiementServiceImpl(PaiementRepository paiementRepository,
                               CourseRepository courseRepository) {
        this.paiementRepository = paiementRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public Paiement creerPaiement(Long courseId, Double montant, String methode) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course introuvable"));

        // 🔴 RÈGLE MÉTIER CRITIQUE (TFE)
        if (course.getStatut() != CourseStatus.TERMINEE) {
            throw new RuntimeException("Le paiement est autorisé uniquement si la course est terminée");
        }

        if (course.getPaiement() != null) {
            throw new RuntimeException("Cette course possède déjà un paiement");
        }

        Paiement paiement = new Paiement();
        paiement.setMontant(montant);

        // Conversion String → Enum
        paiement.setMethode(PaiementMethode.valueOf(methode.toUpperCase()));

        paiement.setCourse(course);
        course.setPaiement(paiement);

        return paiementRepository.save(paiement);
    }
}