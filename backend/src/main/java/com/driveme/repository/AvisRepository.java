package com.driveme.repository;

import com.driveme.entity.Avis;
import com.driveme.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvisRepository extends JpaRepository<Avis, Long> {

    List<Avis> findByChauffeur(Chauffeur chauffeur);
}