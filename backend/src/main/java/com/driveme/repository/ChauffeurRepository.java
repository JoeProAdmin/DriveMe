package com.driveme.repository;

import com.driveme.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;

import java.math.BigDecimal;
import java.util.Optional;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {

    java.util.List<Chauffeur> findAllByOrderByIdDesc();

    boolean existsByUtilisateurId(Long utilisateurId);

    Optional<Chauffeur> findByUtilisateurEmail(String email);

    Optional<Chauffeur> findByUtilisateur_EmailOrUtilisateur_Telephone(
            String email,
            String telephone
    );

    @Query("select coalesce(sum(c.soldeCredit), 0) from Chauffeur c")
    BigDecimal sumSoldeCredit();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Chauffeur c where c.id = :id")
    Optional<Chauffeur> findByIdForUpdate(Long id);
}
