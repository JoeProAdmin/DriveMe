package com.driveme.service.impl;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;
import com.driveme.entity.Course;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.CourseRepository;
import com.driveme.service.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course introuvable"));
        return mapToDTO(course);
    }

    @Override
    public CourseResponseDTO createCourse(CourseCreateDTO dto) {
        Course course = new Course();
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

    @Override
    public CourseResponseDTO updateCourse(Long id, CourseCreateDTO dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course introuvable"));

        course.setAdresseDepart(dto.getAdresseDepart());
        course.setAdresseArrivee(dto.getAdresseArrivee());
        course.setDateDemande(dto.getDateDemande());
        course.setDateDebut(dto.getDateDebut());
        course.setDateFin(dto.getDateFin());
        course.setPrix(dto.getPrix());
        course.setStatut(dto.getStatut());

        Course updated = courseRepository.save(course);
        return mapToDTO(updated);
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course introuvable");
        }
        courseRepository.deleteById(id);
    }

    private CourseResponseDTO mapToDTO(Course course) {
        CourseResponseDTO dto = new CourseResponseDTO();
        dto.setId(course.getId());
        dto.setAdresseDepart(course.getAdresseDepart());
        dto.setAdresseArrivee(course.getAdresseArrivee());
        dto.setDateDemande(course.getDateDemande());
        dto.setDateDebut(course.getDateDebut());
        dto.setDateFin(course.getDateFin());
        dto.setPrix(course.getPrix());
        dto.setStatut(course.getStatut());
        return dto;
    }
}
