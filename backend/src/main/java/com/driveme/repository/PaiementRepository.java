package com.driveme.repository;

import com.driveme.entity.Paiement;
import com.driveme.entity.PaiementStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    List<Paiement> findAllByOrderByDatePaiementDescIdDesc();

    boolean existsByCourseId(Long courseId);

    Optional<Paiement> findByCourseId(Long courseId);

    List<Paiement> findAllByCourse_Passager_IdOrderByDatePaiementDesc(Long passagerId);

    long countByStatut(PaiementStatut statut);

    @Query("select coalesce(sum(p.montant), 0) from Paiement p where p.statut = :statut")
    BigDecimal sumMontantByStatut(@Param("statut") PaiementStatut statut);
}
