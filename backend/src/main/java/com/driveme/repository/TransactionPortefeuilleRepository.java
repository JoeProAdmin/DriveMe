package com.driveme.repository;

import com.driveme.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;

public interface TransactionPortefeuilleRepository extends JpaRepository<TransactionPortefeuille, Long> {
    List<TransactionPortefeuille> findByChauffeurIdOrderByDateCreationDesc(Long chauffeurId);
    List<TransactionPortefeuille> findByStatutOrderByDateCreationAsc(PortefeuilleTransactionStatut statut);
    boolean existsByCourseIdAndTypeTransaction(Long courseId, PortefeuilleTransactionType type);
    @Query("select coalesce(sum(t.montant),0) from TransactionPortefeuille t where t.typeTransaction = :type and t.statut = :statut")
    BigDecimal sumByTypeAndStatut(PortefeuilleTransactionType type, PortefeuilleTransactionStatut statut);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from TransactionPortefeuille t where t.id = :id")
    Optional<TransactionPortefeuille> findByIdForUpdate(Long id);
}
