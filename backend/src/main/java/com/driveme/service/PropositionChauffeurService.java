package com.driveme.service;

import com.driveme.dto.PropositionCreateDTO;
import com.driveme.dto.PropositionResponseDTO;

import java.util.List;

public interface PropositionChauffeurService {

    PropositionResponseDTO creerProposition(
            PropositionCreateDTO dto
    );

    List<PropositionResponseDTO> getPropositionsByCourse(
            Long courseId
    );

    List<PropositionResponseDTO> getPropositionsByChauffeur(
            Long chauffeurId
    );

    PropositionResponseDTO choisirProposition(
            Long courseId,
            Long propositionId
    );

}