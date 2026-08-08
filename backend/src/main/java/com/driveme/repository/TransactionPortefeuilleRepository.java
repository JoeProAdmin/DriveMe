package com.driveme.repository;

import com.driveme.entity.PortefeuilleTransactionStatut;
import com.driveme.entity.PortefeuilleTransactionType;
import com.driveme.entity.TransactionPortefeuille;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TransactionPortefeuilleRepository
        extends JpaRepository<TransactionPortefeuille, Long> {

    List<TransactionPortefeuille> findByChauffeurIdOrderByDateCreationDesc(
            Long chauffeurId
    );

    List<TransactionPortefeuille> findByStatutOrderByDateCreationAsc(
            PortefeuilleTransactionStatut statut
    );

    boolean existsByCourseIdAndTypeTransaction(
            Long courseId,
            PortefeuilleTransactionType type
    );

    boolean existsByChauffeurIdAndTypeTransaction(
            Long chauffeurId,
            PortefeuilleTransactionType type
    );

    @Query("""
            select coalesce(sum(t.montant), 0)
            from TransactionPortefeuille t
            where t.typeTransaction = :type
              and t.statut = :statut
            """)
    BigDecimal sumByTypeAndStatut(
            PortefeuilleTransactionType type,
            PortefeuilleTransactionStatut statut
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from TransactionPortefeuille t where t.id = :id")
    Optional<TransactionPortefeuille> findByIdForUpdate(Long id);
}