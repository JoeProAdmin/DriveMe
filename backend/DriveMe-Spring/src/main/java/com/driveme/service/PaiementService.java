package com.driveme.service;

import com.driveme.dto.PaiementCreateDTO;
import com.driveme.dto.PaiementResponseDTO;

import java.util.List;

public interface PaiementService {

    PaiementResponseDTO validerPaiement(PaiementCreateDTO dto);

    PaiementResponseDTO getPaiementByCourse(Long courseId);

    List<PaiementResponseDTO> getAllPaiements();

    PaiementResponseDTO refuserPaiement(Long paiementId);

    long count();
}
