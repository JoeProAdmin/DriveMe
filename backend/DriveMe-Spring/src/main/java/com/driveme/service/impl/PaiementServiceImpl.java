package com.driveme.service.impl;

import com.driveme.entity.Course;
import com.driveme.entity.CourseStatus;
import com.driveme.entity.Paiement;
import com.driveme.entity.PaiementMethode;
import com.driveme.entity.PaiementStatut;
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

        if (course.getStatut() != CourseStatus.TERMINEE) {
            throw new RuntimeException("Paiement autorisé uniquement si la course est TERMINÉE");
        }

        if (paiementRepository.existsByCourseId(courseId)) {
            throw new RuntimeException("Un paiement existe déjà pour cette course");
        }

        Paiement paiement = new Paiement();
        paiement.setMontant(montant);
        paiement.setMethode(PaiementMethode.valueOf(methode.toUpperCase()));
        paiement.setStatut(PaiementStatut.EN_ATTENTE);

        paiement.setCourse(course);
        course.setPaiement(paiement);

        return paiementRepository.save(paiement);
    }

    @Override
    public Paiement creerPaiementAutomatique(Long courseId) {

        if (paiementRepository.existsByCourseId(courseId)) {
            return paiementRepository.findByCourseId(courseId).get();
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course introuvable"));

        if (course.getStatut() != CourseStatus.TERMINEE) {
            throw new RuntimeException("Paiement impossible : course non terminée");
        }

        Paiement paiement = new Paiement();
        paiement.setMontant(course.getPrix());
        paiement.setMethode(PaiementMethode.ONLINE);
        paiement.setStatut(PaiementStatut.EN_ATTENTE);

        paiement.setCourse(course);
        course.setPaiement(paiement);

        return paiementRepository.save(paiement);
    }
}