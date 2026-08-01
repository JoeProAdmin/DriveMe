package com.driveme.service;

import com.driveme.dto.PropositionCreateDTO;
import com.driveme.dto.PropositionResponseDTO;
import java.util.List;

public interface PropositionChauffeurService {
    PropositionResponseDTO creerProposition(Long courseId, PropositionCreateDTO dto, String chauffeurEmail);
    List<PropositionResponseDTO> getPropositionsByCourse(Long courseId, String passagerEmail);
    List<PropositionResponseDTO> getCurrentChauffeurPropositions(String chauffeurEmail);
    PropositionResponseDTO choisirProposition(Long propositionId, String passagerEmail);
}
