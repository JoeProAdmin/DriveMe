package com.driveme.service.impl;

import com.driveme.dto.AvisDTO;
import com.driveme.entity.Avis;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.Course;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.AvisRepository;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.CourseRepository;
import com.driveme.service.AvisService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class AvisServiceImpl implements AvisService {

    private final AvisRepository avisRepository;
    private final CourseRepository courseRepository;
    private final ChauffeurRepository chauffeurRepository;

    public AvisServiceImpl(
            AvisRepository avisRepository,
            CourseRepository courseRepository,
            ChauffeurRepository chauffeurRepository) {

        this.avisRepository = avisRepository;
        this.courseRepository = courseRepository;
        this.chauffeurRepository = chauffeurRepository;
    }

    @Override
    public void soumettreAvis(AvisDTO avisDTO) {

        Course course = courseRepository.findById(avisDTO.getCourseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable"));

        Chauffeur chauffeur = course.getChauffeur();

        Avis avis = new Avis();
        avis.setCourse(course);
        avis.setChauffeur(chauffeur);
        avis.setNote(avisDTO.getNote());
        avis.setCommentaire(avisDTO.getCommentaire());

        avisRepository.save(avis);

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