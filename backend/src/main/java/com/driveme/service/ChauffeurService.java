package com.driveme.service;

import com.driveme.dto.ChauffeurCreateDTO;
import com.driveme.dto.ChauffeurResponseDTO;
import com.driveme.dto.ChauffeurPositionRequestDTO;
import com.driveme.dto.ChauffeurDisponibiliteRequestDTO;

import java.math.BigDecimal;
import com.driveme.entity.DriverType;
import java.util.List;

public interface ChauffeurService {

    List<ChauffeurResponseDTO> getAllChauffeurs();

    ChauffeurResponseDTO getChauffeurById(Long id);

    ChauffeurResponseDTO getChauffeurByEmail(String email);

    ChauffeurResponseDTO getCurrentChauffeur(String email);

    ChauffeurResponseDTO updateCurrentPosition(String email, ChauffeurPositionRequestDTO dto);

    ChauffeurResponseDTO updateCurrentDisponibilite(String email, ChauffeurDisponibiliteRequestDTO dto);

    ChauffeurResponseDTO createChauffeur(ChauffeurCreateDTO dto);

    ChauffeurResponseDTO updateChauffeur(Long id, ChauffeurCreateDTO dto);

    ChauffeurResponseDTO updateStatutValidation(Long id, Integer statut);
    ChauffeurResponseDTO updateTypeChauffeur(Long id, DriverType typeChauffeur);
    com.driveme.entity.Chauffeur getEntityById(Long id);

    void deleteChauffeur(Long id);

    long count();

    BigDecimal sumSoldeCredit();
}
