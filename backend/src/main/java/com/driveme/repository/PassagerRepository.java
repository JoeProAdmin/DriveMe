package com.driveme.repository;

import com.driveme.entity.Passager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PassagerRepository extends JpaRepository<Passager, Long> {

    boolean existsByUtilisateur_Telephone(String telephone);

    Optional<Passager> findByUtilisateur_Email(String email);

    Optional<Passager> findByUtilisateur_EmailOrUtilisateur_Telephone(String email, String telephone);

}
