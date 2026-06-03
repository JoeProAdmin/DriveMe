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

    public PaiementServiceImpl(PaiementRepository paiementRepository, CourseRepository courseRepository) {
        this.paiementRepository = paiementRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public long count() {
        return paiementRepository.count();
    }

    @Override
    public Paiement creerPaiement(Long courseId, Double montant, String methode) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course introuvable"));
        Paiement paiement = new Paiement();
        paiement.setMontant(montant);
        paiement.setMethode(PaiementMethode.valueOf(methode.toUpperCase()));
        paiement.setStatut(PaiementStatut.EN_ATTENTE);
        paiement.setCourse(course);
        return paiementRepository.save(paiement);
    }

    @Override
    public Paiement creerPaiementAutomatique(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course introuvable"));
        Paiement paiement = new Paiement();
        paiement.setMontant(course.getPrix());
        paiement.setMethode(PaiementMethode.ONLINE);
        paiement.setStatut(PaiementStatut.EN_ATTENTE);
        paiement.setCourse(course);
        return paiementRepository.save(paiement);
    }
}