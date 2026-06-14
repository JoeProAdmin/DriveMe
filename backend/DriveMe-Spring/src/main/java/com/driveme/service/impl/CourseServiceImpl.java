package com.driveme.service.impl;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.Course;
import com.driveme.entity.CourseStatus;
import com.driveme.entity.Passager;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.PassagerRepository;
import com.driveme.service.CourseService;
import com.driveme.service.PaiementService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final PassagerRepository passagerRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final PaiementService paiementService;

    public CourseServiceImpl(
            CourseRepository courseRepository,
            PassagerRepository passagerRepository,
            ChauffeurRepository chauffeurRepository,
            PaiementService paiementService
    ) {
        this.courseRepository = courseRepository;
        this.passagerRepository = passagerRepository;
        this.chauffeurRepository = chauffeurRepository;
        this.paiementService = paiementService;
    }

    @Override
    public long count() {
        return courseRepository.count();
    }

    @Override
    public CourseResponseDTO createCourse(CourseCreateDTO dto) {

        Passager passager = passagerRepository.findById(dto.getPassagerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Passager introuvable"));

        Course course = new Course();

        course.setPassager(passager);

        if (dto.getChauffeurId() != null) {

            Chauffeur chauffeur = chauffeurRepository
                    .findById(dto.getChauffeurId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Chauffeur introuvable"));

            course.setChauffeur(chauffeur);
        }

        course.setAdresseDepart(dto.getAdresseDepart());
        course.setAdresseArrivee(dto.getAdresseArrivee());
        course.setPrix(dto.getPrix());

        course.setStatut(CourseStatus.EN_ATTENTE);

        Course saved = courseRepository.save(course);

        return mapToDTO(saved);
    }

    @Override
    public List<CourseResponseDTO> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponseDTO> getCoursesByChauffeur(Long chauffeurId) {

        return courseRepository.findByChauffeurId(chauffeurId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponseDTO> getCoursesByPassager(Long passagerId) {

        return courseRepository.findByPassagerId(passagerId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponseDTO updateStatus(Long id, String status) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable"));

        CourseStatus newStatus =
                CourseStatus.valueOf(status.toUpperCase());

        course.setStatut(newStatus);

        Course updated = courseRepository.save(course);

        if (newStatus == CourseStatus.TERMINEE) {
            paiementService.creerPaiementAutomatique(updated.getId());
        }

        return mapToDTO(updated);
    }

    private CourseResponseDTO mapToDTO(Course course) {

        String chauffeurNom = null;

        if (course.getChauffeur() != null) {

            chauffeurNom =
                    course.getChauffeur()
                            .getUtilisateur()
                            .getNom();
        }

        return new CourseResponseDTO(
                course.getId(),
                course.getPassager().getUtilisateur().getNom(),
                chauffeurNom,
                course.getAdresseDepart(),
                course.getAdresseArrivee(),
                course.getPrix(),
                course.getStatut().name(),
                course.getDateCreation()
        );
    }
}