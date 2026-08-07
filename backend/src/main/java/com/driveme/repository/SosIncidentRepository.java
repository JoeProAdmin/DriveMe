package com.driveme.repository;

import com.driveme.entity.SosIncident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SosIncidentRepository extends JpaRepository<SosIncident, Long> {
    List<SosIncident> findAllByOrderByDateCreationDesc();
    List<SosIncident> findByUtilisateurIdOrderByDateCreationDesc(Long utilisateurId);
}
