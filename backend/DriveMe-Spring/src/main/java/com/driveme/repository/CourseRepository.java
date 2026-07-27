package com.driveme.repository;

import com.driveme.entity.Course;
import com.driveme.entity.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByChauffeurId(Long chauffeurId);

    List<Course> findByPassagerId(Long passagerId);

    List<Course> findByStatut(CourseStatus statut);
}