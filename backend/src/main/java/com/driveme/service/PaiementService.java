package com.driveme.service;

import com.driveme.dto.PaiementCreateDTO;
import com.driveme.dto.PaiementResponseDTO;
import com.driveme.entity.PaiementStatut;

import java.math.BigDecimal;
import java.util.List;

public interface PaiementService {

    PaiementResponseDTO validerPaiement(
            PaiementCreateDTO dto,
            String identifiant
    );

    PaiementResponseDTO getPaiementByCourse(
            Long courseId,
            String identifiant
    );

    List<PaiementResponseDTO> getMesPaiements(String identifiant);

    List<PaiementResponseDTO> getAllPaiements();

    PaiementResponseDTO refuserPaiement(Long paiementId);

    long count();

    long countByStatut(PaiementStatut statut);

    BigDecimal sumMontantByStatut(PaiementStatut statut);
}
