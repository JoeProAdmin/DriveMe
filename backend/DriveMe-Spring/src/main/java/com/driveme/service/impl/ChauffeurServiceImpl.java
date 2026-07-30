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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChauffeurServiceImpl implements ChauffeurService {

    private final ChauffeurRepository chauffeurRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ChauffeurServiceImpl(
            ChauffeurRepository chauffeurRepository,
            UtilisateurRepository utilisateurRepository
    ) {
        this.chauffeurRepository = chauffeurRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public long count() {
        return chauffeurRepository.count();
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
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chauffeur introuvable"));

        return mapToDTO(chauffeur);
    }

    @Override
    public ChauffeurResponseDTO getChauffeurByEmail(String email) {

        Chauffeur chauffeur = chauffeurRepository
                .findByUtilisateurEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chauffeur introuvable : " + email));

        return mapToDTO(chauffeur);
    }

    @Override
    public ChauffeurResponseDTO createChauffeur(ChauffeurCreateDTO dto) {

        Utilisateur user = utilisateurRepository
                .findById(dto.getUtilisateurId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Utilisateur introuvable"));

        Chauffeur chauffeur = new Chauffeur();

        chauffeur.setUtilisateur(user);

        chauffeur.setStatutValidation(
                dto.getStatutValidation().byteValue()
        );

        return mapToDTO(
                chauffeurRepository.save(chauffeur)
        );
    }

    @Override
    public ChauffeurResponseDTO updateChauffeur(
            Long id,
            ChauffeurCreateDTO dto
    ) {

        Chauffeur chauffeur = chauffeurRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chauffeur introuvable"));

        chauffeur.setStatutValidation(
                dto.getStatutValidation().byteValue()
        );

        return mapToDTO(
                chauffeurRepository.save(chauffeur)
        );
    }

    @Override
    public ChauffeurResponseDTO updateStatutValidation(Long id, Integer statut) {

        if (statut == null || statut < 0 || statut > 2) {
            throw new IllegalArgumentException(
                    "Statut de validation invalide. Valeurs autorisées : 0, 1 ou 2."
            );
        }

        Chauffeur chauffeur = chauffeurRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chauffeur introuvable : " + id));

        chauffeur.setStatutValidation(statut.byteValue());

        return mapToDTO(chauffeurRepository.save(chauffeur));
    }

    @Override
    public void deleteChauffeur(Long id) {

        if (!chauffeurRepository.existsById(id)) {
            throw new ResourceNotFoundException("Chauffeur introuvable : " + id);
        }

        chauffeurRepository.deleteById(id);
    }

    private ChauffeurResponseDTO mapToDTO(
            Chauffeur chauffeur
    ) {

        return new ChauffeurResponseDTO(
                chauffeur.getId(),
                chauffeur.getUtilisateur().getNom(),
                chauffeur.getUtilisateur().getPrenom(),
                chauffeur.getUtilisateur().getTelephone(),
                chauffeur.getStatutValidation().intValue(),
                chauffeur.getNoteMoyenne() != null
                        ? chauffeur.getNoteMoyenne().doubleValue()
                        : 0.0,
                chauffeur.getSoldeCredit() != null
                        ? chauffeur.getSoldeCredit().doubleValue()
                        : 0.0
        );
    }
}