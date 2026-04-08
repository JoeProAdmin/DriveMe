package com.driveme.service.impl;

import com.driveme.service.PaiementService;
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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final PassagerRepository passagerRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final PaiementService paiementService;

    public CourseServiceImpl(CourseRepository courseRepository,
                             PassagerRepository passagerRepository,
                             ChauffeurRepository chauffeurRepository,
                             PaiementService paiementService) {
        this.courseRepository = courseRepository;
        this.passagerRepository = passagerRepository;
        this.chauffeurRepository = chauffeurRepository;
        this.paiementService = paiementService;
    }

    @Override
    public CourseResponseDTO createCourse(CourseCreateDTO dto) {

        Passager passager = passagerRepository.findById(dto.getPassagerId())
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

        Chauffeur chauffeur = chauffeurRepository.findById(dto.getChauffeurId())
                .orElseThrow(() -> new ResourceNotFoundException("Chauffeur introuvable"));

        Course course = new Course();
        course.setPassager(passager);
        course.setChauffeur(chauffeur);
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
    public CourseResponseDTO updateStatus(Long id, String status, String role) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course introuvable"));

        CourseStatus newStatus = CourseStatus.valueOf(status.toUpperCase());

        // CONTROLE ROLE
        if (newStatus == CourseStatus.ACCEPTEE || newStatus == CourseStatus.TERMINEE) {

            if (!role.equalsIgnoreCase("CHAUFFEUR") &&
                    !role.equalsIgnoreCase("ADMIN")) {

                throw new RuntimeException("Accès refusé : seul un chauffeur peut modifier la course");
            }
        }

        // ACCEPTATION
        if (newStatus == CourseStatus.ACCEPTEE) {

            if (course.getStatut() != CourseStatus.EN_ATTENTE) {
                throw new RuntimeException("Seules les courses EN_ATTENTE peuvent être acceptées");
            }

            if (course.getChauffeur() == null ||
                    course.getChauffeur().getStatutValidation() == null ||
                    course.getChauffeur().getStatutValidation() == 0) {

                throw new RuntimeException("Chauffeur non validé");
            }
        }

        // TERMINER
        if (newStatus == CourseStatus.TERMINEE) {

            if (course.getStatut() != CourseStatus.ACCEPTEE) {
                throw new RuntimeException("Seules les courses ACCEPTEES peuvent être terminées");
            }
        }

        // ANNULER
        if (newStatus == CourseStatus.ANNULEE) {

            if (course.getStatut() == CourseStatus.TERMINEE) {
                throw new RuntimeException("Impossible d'annuler une course terminée");
            }
        }

        course.setStatut(newStatus);

        Course updated = courseRepository.save(course);

        // ===== PAIEMENT AUTOMATIQUE =====
        if (newStatus == CourseStatus.TERMINEE) {
            paiementService.creerPaiementAutomatique(updated.getId());
        }

        return mapToDTO(updated);
    }

    private CourseResponseDTO mapToDTO(Course course) {
        return new CourseResponseDTO(
                course.getId(),
                course.getPassager().getUtilisateur().getNom(),
                course.getChauffeur().getUtilisateur().getNom(),
                course.getAdresseDepart(),
                course.getAdresseArrivee(),
                course.getPrix(),
                course.getStatut().name(),
                course.getDateCreation()
        );
    }
}