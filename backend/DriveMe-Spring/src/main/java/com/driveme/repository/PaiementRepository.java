package com.driveme.repository;

import com.driveme.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    boolean existsByCourseId(Long courseId);

    Optional<Paiement> findByCourseId(Long courseId);
}