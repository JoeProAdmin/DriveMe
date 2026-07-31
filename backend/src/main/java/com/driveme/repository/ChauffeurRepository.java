package com.driveme.repository;

import com.driveme.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {

    boolean existsByUtilisateurId(Long utilisateurId);

    Optional<Chauffeur> findByUtilisateurEmail(String email);
}