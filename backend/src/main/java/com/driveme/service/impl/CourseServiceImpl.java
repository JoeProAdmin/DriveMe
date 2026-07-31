package com.driveme.service.impl;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;
import com.driveme.entity.Course;
import com.driveme.entity.CourseStatus;
import com.driveme.entity.Passager;
import com.driveme.exception.ResourceNotFoundException;
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

    public CourseServiceImpl(
            CourseRepository courseRepository,
            PassagerRepository passagerRepository
    ) {
        this.courseRepository = courseRepository;
        this.passagerRepository = passagerRepository;
    }

    @Override
    public long count() {
        return courseRepository.count();
    }

    @Override
    public CourseResponseDTO createCourse(CourseCreateDTO dto, String authenticatedIdentifier) {

        Passager passager = passagerRepository
                .findByUtilisateur_EmailOrUtilisateur_Telephone(authenticatedIdentifier, authenticatedIdentifier)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Aucun profil passager n'est associé au compte authentifié"));

        Course course = new Course();

        course.setPassager(passager);

        course.setAdresseDepart(dto.getAdresseDepart().trim());
        course.setAdresseArrivee(dto.getAdresseArrivee().trim());
        course.setPrix(dto.getPrix());
        course.setLatitudeDepart(dto.getLatitudeDepart());
        course.setLongitudeDepart(dto.getLongitudeDepart());
        course.setLatitudeArrivee(dto.getLatitudeArrivee());
        course.setLongitudeArrivee(dto.getLongitudeArrivee());
        course.setDistanceKm(dto.getDistanceKm());
        course.setDureeEstimeeMinutes(dto.getDureeEstimeeMinutes());
        course.setPrixEstime(dto.getPrixEstime());

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
    public List<CourseResponseDTO> getCoursesEnAttente() {

        return courseRepository.findByStatut(CourseStatus.EN_ATTENTE)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponseDTO updateStatus(Long id, String status) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable"));

        final CourseStatus newStatus;

        try {
            newStatus = CourseStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException exception) {
            throw new IllegalArgumentException("Statut de course invalide.");
        }

        if (newStatus == CourseStatus.ACCEPTEE && course.getChauffeur() == null) {
            throw new IllegalStateException(
                    "Une course ne peut pas être acceptée sans chauffeur. " +
                    "Le passager doit sélectionner une proposition de chauffeur."
            );
        }

        if (newStatus == CourseStatus.TERMINEE) {
            if (course.getChauffeur() == null) {
                throw new IllegalStateException(
                        "Une course sans chauffeur ne peut pas être terminée."
                );
            }

            if (course.getStatut() != CourseStatus.ACCEPTEE) {
                throw new IllegalStateException(
                        "Seule une course acceptée peut être terminée."
                );
            }
        }

        course.setStatut(newStatus);

        Course updated = courseRepository.save(course);

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
                course.getDateCreation(),
                course.getLatitudeDepart(),
                course.getLongitudeDepart(),
                course.getLatitudeArrivee(),
                course.getLongitudeArrivee(),
                course.getDistanceKm(),
                course.getDureeEstimeeMinutes(),
                course.getPrixEstime()
        );
    }
}
