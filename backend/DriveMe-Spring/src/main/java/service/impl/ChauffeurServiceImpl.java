package com.driveme.service.impl;

import com.driveme.dto.ChauffeurResponseDTO;
import com.driveme.entity.Chauffeur;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.service.ChauffeurService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChauffeurServiceImpl implements ChauffeurService {

    private final ChauffeurRepository chauffeurRepository;

    public ChauffeurServiceImpl(ChauffeurRepository chauffeurRepository) {
        this.chauffeurRepository = chauffeurRepository;
    }

    @Override
    public List<ChauffeurResponseDTO> getAllChauffeurs() {
        return chauffeurRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public ChauffeurResponseDTO getChauffeurById(Long id) {

        Chauffeur chauffeur = chauffeurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chauffeur introuvable"));

        return mapToDTO(chauffeur);
    }

    @Override
    public Chauffeur createChauffeur(Chauffeur chauffeur) {
        return chauffeurRepository.save(chauffeur);
    }

    @Override
    public Chauffeur updateChauffeur(Long id, Chauffeur chauffeurDetails) {

        Chauffeur chauffeur = chauffeurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chauffeur introuvable"));

        chauffeur.setStatutValidation(chauffeurDetails.getStatutValidation());
        chauffeur.setNoteMoyenne(chauffeurDetails.getNoteMoyenne());
        chauffeur.setSoldeCredit(chauffeurDetails.getSoldeCredit());

        return chauffeurRepository.save(chauffeur);
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
                chauffeur.getStatutValidation(),
                chauffeur.getNoteMoyenne()
        );
    }
}
