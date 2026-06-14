package com.driveme.service;

import com.driveme.dto.ChauffeurCreateDTO;
import com.driveme.dto.ChauffeurResponseDTO;

import java.util.List;

public interface ChauffeurService {

    List<ChauffeurResponseDTO> getAllChauffeurs();

    ChauffeurResponseDTO getChauffeurById(Long id);

    ChauffeurResponseDTO getChauffeurByEmail(String email);

    ChauffeurResponseDTO createChauffeur(ChauffeurCreateDTO dto);

    ChauffeurResponseDTO updateChauffeur(Long id, ChauffeurCreateDTO dto);

    void deleteChauffeur(Long id);

    long count();
}