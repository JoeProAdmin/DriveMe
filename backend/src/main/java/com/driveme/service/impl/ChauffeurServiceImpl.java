package com.driveme.service.impl;

import com.driveme.dto.ChauffeurCreateDTO;
import com.driveme.dto.ChauffeurResponseDTO;
import com.driveme.dto.ChauffeurPositionRequestDTO;
import com.driveme.dto.ChauffeurDisponibiliteRequestDTO;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.Utilisateur;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.UtilisateurRepository;
import com.driveme.service.ChauffeurService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDateTime;
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
    public BigDecimal sumSoldeCredit() {
        return chauffeurRepository.sumSoldeCredit();
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
    public ChauffeurResponseDTO getCurrentChauffeur(String email) {
        return getChauffeurByEmail(email);
    }

    @Override
    public ChauffeurResponseDTO updateCurrentPosition(String email, ChauffeurPositionRequestDTO dto) {
        Chauffeur chauffeur = findCurrent(email);
        chauffeur.setLatitudeActuelle(dto.getLatitude());
        chauffeur.setLongitudeActuelle(dto.getLongitude());
        chauffeur.setDernierePositionAt(LocalDateTime.now());
        return mapToDTO(chauffeurRepository.save(chauffeur));
    }

    @Override
    public ChauffeurResponseDTO updateCurrentDisponibilite(String email, ChauffeurDisponibiliteRequestDTO dto) {
        Chauffeur chauffeur = findCurrent(email);
        if (Boolean.TRUE.equals(dto.getDisponible())) {
            if (chauffeur.getStatutValidation() == null || chauffeur.getStatutValidation() != 1) {
                throw new IllegalStateException("Le chauffeur doit être validé avant de devenir disponible.");
            }
            if (chauffeur.getLatitudeActuelle() == null || chauffeur.getLongitudeActuelle() == null) {
                throw new IllegalStateException("La position doit être enregistrée avant d'activer la disponibilité.");
            }
        }
        chauffeur.setDisponible(Boolean.TRUE.equals(dto.getDisponible()));
        return mapToDTO(chauffeurRepository.save(chauffeur));
    }

    private Chauffeur findCurrent(String email) {
        return chauffeurRepository.findByUtilisateurEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun profil chauffeur n'est associé au compte authentifié"));
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
                chauffeur.getUtilisateur().getEmail(),
                chauffeur.getUtilisateur().getTelephone(),
                chauffeur.getStatutValidation().intValue(),
                chauffeur.getNoteMoyenne() != null
                        ? chauffeur.getNoteMoyenne().doubleValue()
                        : 0.0,
                chauffeur.getSoldeCredit() != null
                        ? chauffeur.getSoldeCredit().doubleValue()
                        : 0.0,
                chauffeur.isDisponible(),
                chauffeur.getLatitudeActuelle(),
                chauffeur.getLongitudeActuelle(),
                chauffeur.getDernierePositionAt()
        );
    }
}
