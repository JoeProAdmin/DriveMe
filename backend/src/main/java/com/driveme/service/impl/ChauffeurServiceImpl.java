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
import com.driveme.service.ChauffeurDocumentService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class ChauffeurServiceImpl implements ChauffeurService {

    private final ChauffeurRepository chauffeurRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ChauffeurDocumentService chauffeurDocumentService;

    public ChauffeurServiceImpl(
            ChauffeurRepository chauffeurRepository,
            UtilisateurRepository utilisateurRepository,
            ChauffeurDocumentService chauffeurDocumentService
    ) {
        this.chauffeurRepository = chauffeurRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.chauffeurDocumentService = chauffeurDocumentService;
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
            if (chauffeur.getSoldeCredit() == null || chauffeur.getSoldeCredit().signum() <= 0) {
                throw new IllegalStateException("Votre crédit DriveMe est épuisé. Rechargez votre portefeuille pour recevoir de nouvelles courses.");
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

        if (dto.getTypeChauffeur() == null) {
            throw new IllegalArgumentException("Le type de chauffeur est obligatoire");
        }

        Utilisateur user = utilisateurRepository
                .findById(dto.getUtilisateurId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Utilisateur introuvable"));

        Chauffeur chauffeur = new Chauffeur();

        chauffeur.setUtilisateur(user);

        chauffeur.setTypeChauffeur(dto.getTypeChauffeur());

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

        if (dto.getTypeChauffeur() != null) {
            chauffeur.setTypeChauffeur(dto.getTypeChauffeur());
        }

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

        if (statut == 1 && !dossierValidable(chauffeur)) {
            throw new IllegalStateException(
                    "Le chauffeur ne peut pas être approuvé : véhicule incomplet ou documents obligatoires non approuvés."
            );
        }

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

        ChauffeurResponseDTO dto = new ChauffeurResponseDTO(
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
        dto.setMarqueVehicule(chauffeur.getMarqueVehicule());
        dto.setModeleVehicule(chauffeur.getModeleVehicule());
        dto.setAnneeVehicule(chauffeur.getAnneeVehicule());
        dto.setImmatriculation(chauffeur.getImmatriculation());
        dto.setTypeChauffeur(chauffeur.getTypeChauffeur());
        dto.setDocuments(chauffeurDocumentService.listForChauffeur(chauffeur.getId()));
        return dto;
    }

    private boolean dossierValidable(Chauffeur chauffeur) {
        return chauffeur.getMarqueVehicule() != null && !chauffeur.getMarqueVehicule().isBlank()
                && chauffeur.getModeleVehicule() != null && !chauffeur.getModeleVehicule().isBlank()
                && chauffeur.getAnneeVehicule() != null
                && chauffeur.getImmatriculation() != null && !chauffeur.getImmatriculation().isBlank()
                && chauffeurDocumentService.requiredDocumentsApproved(chauffeur.getId());
    }
}
