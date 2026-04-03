package com.driveme.service.impl;

import com.driveme.entity.Course;
import com.driveme.entity.Paiement;
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

        // 1. Récupérer la course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course introuvable"));

        // 2. VÉRIFIER si paiement déjà existant
        if (course.getPaiement() != null) {
            throw new RuntimeException("Cette course possède déjà un paiement");
        }

        // 3. Créer paiement
        Paiement paiement = new Paiement();
        paiement.setMontant(montant);
        paiement.setMethode(methode);

        // 4. SYNCHRO BIDIRECTIONNELLE
        paiement.setCourse(course);
        course.setPaiement(paiement);

        // 5. Sauvegarde
        return paiementRepository.save(paiement);
    }
}