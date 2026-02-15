package com.driveme.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.driveme.model.Chauffeur;

@Repository
public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {
    // Ici, tu pourras ajouter des méthodes de recherche personnalisées si besoin
}
