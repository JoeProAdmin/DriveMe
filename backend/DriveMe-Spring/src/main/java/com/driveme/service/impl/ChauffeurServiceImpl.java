package com.driveme.service.impl;

import com.driveme.dto.ChauffeurCreateDTO;
import com.driveme.dto.ChauffeurResponseDTO;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.Utilisateur;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.UtilisateurRepository;
import com.driveme.service.ChauffeurService;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChauffeurServiceImpl implements ChauffeurService {

    private final ChauffeurRepository chauffeurRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ChauffeurServiceImpl(ChauffeurRepository chauffeurRepository, UtilisateurRepository utilisateurRepository) {
        this.chauffeurRepository = chauffeurRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public long count() {
        return chauffeurRepository.count();
    }

    @Override
    public List<ChauffeurResponseDTO> getAllChauffeurs() {
        return chauffeurRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public ChauffeurResponseDTO getChauffeurById(Long id) {
        return mapToDTO(chauffeurRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Chauffeur introuvable")));
    }

    @Override
    public ChauffeurResponseDTO createChauffeur(ChauffeurCreateDTO dto) {
        Utilisateur user = utilisateurRepository.findById(dto.getUtilisateurId()).orElseThrow();
        Chauffeur c = new Chauffeur();
        c.setUtilisateur(user);
        c.setStatutValidation(dto.getStatutValidation().byteValue());
        return mapToDTO(chauffeurRepository.save(c));
    }

    @Override
    public ChauffeurResponseDTO updateChauffeur(Long id, ChauffeurCreateDTO dto) {
        Chauffeur c = chauffeurRepository.findById(id).orElseThrow();
        c.setStatutValidation(dto.getStatutValidation().byteValue());
        return mapToDTO(chauffeurRepository.save(c));
    }

    @Override
    public void deleteChauffeur(Long id) { chauffeurRepository.deleteById(id); }

    private ChauffeurResponseDTO mapToDTO(Chauffeur c) {
        return new ChauffeurResponseDTO(c.getId(), c.getUtilisateur().getNom(), c.getUtilisateur().getPrenom(), c.getUtilisateur().getTelephone(), c.getStatutValidation().intValue(), c.getNoteMoyenne() != null ? c.getNoteMoyenne().doubleValue() : null);
    }
}