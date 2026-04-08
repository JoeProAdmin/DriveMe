package com.driveme.repository;

import com.driveme.entity.Passager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassagerRepository extends JpaRepository<Passager, Long> {

    //  CORRECTION : passer par utilisateur
    boolean existsByUtilisateur_Telephone(String telephone);
}