package com.driveme.service;

import com.driveme.dto.ChauffeurResponseDTO;
import com.driveme.entity.Chauffeur;

import java.util.List;

public interface ChauffeurService {

    List<ChauffeurResponseDTO> getAllChauffeurs();

    ChauffeurResponseDTO getChauffeurById(Long id);

    Chauffeur createChauffeur(Chauffeur chauffeur);

    Chauffeur updateChauffeur(Long id, Chauffeur chauffeur);

    void deleteChauffeur(Long id);
}
