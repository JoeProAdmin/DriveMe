package com.driveme.repository;

import com.driveme.entity.Course;
import com.driveme.entity.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByChauffeurId(Long chauffeurId);

    List<Course> findByPassagerId(Long passagerId);

    boolean existsByPassagerId(Long passagerId);

    List<Course> findByStatut(CourseStatus statut);

    long countByStatutIn(List<CourseStatus> statuts);

    List<Course> findByPassagerUtilisateurEmailIgnoreCase(String email);

    List<Course> findByChauffeurUtilisateurEmailIgnoreCase(String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Course c where c.id = :id")
    Optional<Course> findByIdForUpdate(@Param("id") Long id);
}
