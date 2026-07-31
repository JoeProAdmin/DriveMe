package com.driveme.repository;

import com.driveme.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmailIgnoreCase(String email);

    Optional<Utilisateur> findByTelephone(String telephone);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByTelephone(String telephone);

    default Optional<Utilisateur> findByEmail(String email) {
        return findByEmailIgnoreCase(email);
    }
}
