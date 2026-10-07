package com.driveme.service;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;

import java.util.List;

public interface CourseService {

    CourseResponseDTO createCourse(CourseCreateDTO dto, String authenticatedIdentifier);

    List<CourseResponseDTO> getAllCourses();

    List<CourseResponseDTO> getCoursesByChauffeur(Long chauffeurId);

    List<CourseResponseDTO> getCoursesByPassager(Long passagerId);

    List<CourseResponseDTO> getCurrentPassagerCourses(String email);

    List<CourseResponseDTO> getCurrentChauffeurCourses(String email);

    /**
     * Retourne toutes les courses en attente
     * disponibles pour les chauffeurs.
     */
    List<CourseResponseDTO> getCoursesEnAttente(String authenticatedIdentifier);

    /**
     * Fait progresser une course selon le cycle chauffeur autorisé.
     * L'identité du chauffeur provient du JWT.
     */
    CourseResponseDTO updateChauffeurStatus(
            Long courseId,
            String status,
            String authenticatedIdentifier
    );

    CourseResponseDTO cancelCurrentPassengerCourse(Long courseId, String email);

    CourseResponseDTO updateStatus(Long id, String status);

    long count();
}
