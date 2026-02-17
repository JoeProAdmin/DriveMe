package com.driveme.repository;

import com.driveme.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {

    boolean existsByUtilisateurId(Long utilisateurId);
}
