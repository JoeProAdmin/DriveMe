package com.driveme.repository;

import com.driveme.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select u from Utilisateur u where u.id = :id")
    Optional<Utilisateur> findByIdForPasswordReset(
            @org.springframework.data.repository.query.Param("id") Long id
    );
    @org.springframework.data.jpa.repository.Query(
            "select u.id from Utilisateur u where lower(u.email) = lower(:email)"
    )
    Optional<Long> findIdByEmailForPasswordReset(
            @org.springframework.data.repository.query.Param("email") String email
    );

    Optional<Utilisateur> findByEmailIgnoreCase(String email);

    Optional<Utilisateur> findByTelephone(String telephone);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByTelephone(String telephone);

    default Optional<Utilisateur> findByEmail(String email) {
        return findByEmailIgnoreCase(email);
    }
}
