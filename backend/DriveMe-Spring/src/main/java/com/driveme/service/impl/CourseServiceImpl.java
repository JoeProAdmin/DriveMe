package com.driveme.service.impl;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.Course;
import com.driveme.entity.Passager;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.PassagerRepository;
import com.driveme.service.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final PassagerRepository passagerRepository;

    public CourseServiceImpl(CourseRepository courseRepository,
                             ChauffeurRepository chauffeurRepository,
                             PassagerRepository passagerRepository) {
        this.courseRepository = courseRepository;
        this.chauffeurRepository = chauffeurRepository;
        this.passagerRepository = passagerRepository;
    }

    // ===============================
    // GET ALL
    // ===============================
    @Override
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ===============================
    // GET BY ID
    // ===============================
    @Override
    public CourseResponseDTO getCourseById(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course introuvable"));

        return mapToDTO(course);
    }

    // ===============================
    // CREATE
    // ===============================
    @Override
    public CourseResponseDTO createCourse(CourseCreateDTO dto) {

        Chauffeur chauffeur = chauffeurRepository.findById(dto.getChauffeurId())
                .orElseThrow(() -> new ResourceNotFoundException("Chauffeur introuvable"));

        Passager passager = passagerRepository.findById(dto.getPassagerId())
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

        Course course = new Course();
        course.setChauffeur(chauffeur);
        course.setPassager(passager);
        course.setAdresseDepart(dto.getAdresseDepart());
        course.setAdresseArrivee(dto.getAdresseArrivee());
        course.setDateDemande(dto.getDateDemande());
        course.setDateDebut(dto.getDateDebut());
        course.setDateFin(dto.getDateFin());
        course.setPrix(dto.getPrix());
        course.setStatut(dto.getStatut());

        Course saved = courseRepository.save(course);

        return mapToDTO(saved);
    }

    // ===============================
    // DELETE
    // ===============================
    @Override
    public void deleteCourse(Long id) {

        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course introuvable");
        }

        courseRepository.deleteById(id);
    }

    // ===============================
    // MAPPING ENTITY → DTO
    // ===============================
    private CourseResponseDTO mapToDTO(Course course) {

        return new CourseResponseDTO(
                course.getId(),
                course.getChauffeur().getId(),
                course.getPassager().getId(),
                course.getAdresseDepart(),
                course.getAdresseArrivee(),
                course.getDateDemande(),
                course.getDateDebut(),
                course.getDateFin(),
                course.getPrix(),
                course.getStatut()
        );
    }
}
