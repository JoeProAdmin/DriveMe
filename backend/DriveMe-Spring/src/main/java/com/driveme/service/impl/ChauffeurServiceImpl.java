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

    public ChauffeurServiceImpl(ChauffeurRepository chauffeurRepository,
                                UtilisateurRepository utilisateurRepository) {
        this.chauffeurRepository = chauffeurRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public List<ChauffeurResponseDTO> getAllChauffeurs() {
        return chauffeurRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ChauffeurResponseDTO getChauffeurById(Long id) {
        Chauffeur chauffeur = chauffeurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chauffeur introuvable"));
        return mapToDTO(chauffeur);
    }

    @Override
    public ChauffeurResponseDTO createChauffeur(ChauffeurCreateDTO dto) {

        Utilisateur utilisateur = utilisateurRepository.findById(dto.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (chauffeurRepository.existsByUtilisateurId(dto.getUtilisateurId())) {
            throw new IllegalArgumentException("Un chauffeur existe déjà pour cet utilisateur");
        }

        Chauffeur chauffeur = new Chauffeur();
        chauffeur.setUtilisateur(utilisateur);
        chauffeur.setStatutValidation(dto.getStatutValidation().byteValue());
        chauffeur.setNoteMoyenne(
                dto.getNoteMoyenne() != null ?
                        BigDecimal.valueOf(dto.getNoteMoyenne()) : null
        );
        chauffeur.setSoldeCredit(
                dto.getSoldeCredit() != null ?
                        BigDecimal.valueOf(dto.getSoldeCredit()) : BigDecimal.ZERO
        );

        Chauffeur saved = chauffeurRepository.save(chauffeur);

        return mapToDTO(saved);
    }

    @Override
    public ChauffeurResponseDTO updateChauffeur(Long id, ChauffeurCreateDTO dto) {

        Chauffeur chauffeur = chauffeurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chauffeur introuvable"));

        chauffeur.setStatutValidation(dto.getStatutValidation().byteValue());
        chauffeur.setNoteMoyenne(
                dto.getNoteMoyenne() != null ?
                        BigDecimal.valueOf(dto.getNoteMoyenne()) : null
        );
        chauffeur.setSoldeCredit(
                dto.getSoldeCredit() != null ?
                        BigDecimal.valueOf(dto.getSoldeCredit()) : BigDecimal.ZERO
        );

        Chauffeur updated = chauffeurRepository.save(chauffeur);

        return mapToDTO(updated);
    }

    @Override
    public void deleteChauffeur(Long id) {
        if (!chauffeurRepository.existsById(id)) {
            throw new ResourceNotFoundException("Chauffeur introuvable");
        }
        chauffeurRepository.deleteById(id);
    }

    private ChauffeurResponseDTO mapToDTO(Chauffeur chauffeur) {
        return new ChauffeurResponseDTO(
                chauffeur.getId(),
                chauffeur.getUtilisateur().getNom(),
                chauffeur.getUtilisateur().getPrenom(),
                chauffeur.getUtilisateur().getTelephone(),
                chauffeur.getStatutValidation().intValue(),
                chauffeur.getNoteMoyenne() != null ?
                        chauffeur.getNoteMoyenne().doubleValue() : null
        );
    }
}
