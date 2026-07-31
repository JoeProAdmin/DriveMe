package com.driveme.service;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;

import java.util.List;

public interface CourseService {

    CourseResponseDTO createCourse(CourseCreateDTO dto, String authenticatedIdentifier);

    List<CourseResponseDTO> getAllCourses();

    List<CourseResponseDTO> getCoursesByChauffeur(Long chauffeurId);

    List<CourseResponseDTO> getCoursesByPassager(Long passagerId);

    /**
     * Retourne toutes les courses en attente
     * disponibles pour les chauffeurs.
     */
    List<CourseResponseDTO> getCoursesEnAttente();

    CourseResponseDTO updateStatus(Long id, String status);

    long count();
}
