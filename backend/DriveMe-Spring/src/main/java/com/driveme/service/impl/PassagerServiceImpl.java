package com.driveme.service.impl;

import com.driveme.dto.PassagerCreateDTO;
import com.driveme.dto.PassagerResponseDTO;
import com.driveme.entity.Passager;
import com.driveme.entity.Utilisateur;
import com.driveme.entity.Role;
import com.driveme.entity.Language;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.PassagerRepository;
import com.driveme.repository.UtilisateurRepository;
import com.driveme.service.PassagerService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PassagerServiceImpl implements PassagerService {

    private final PassagerRepository passagerRepository;
    private final UtilisateurRepository utilisateurRepository;

    public PassagerServiceImpl(PassagerRepository passagerRepository, UtilisateurRepository utilisateurRepository) {
        this.passagerRepository = passagerRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public long count() {
        return passagerRepository.count();
    }

    @Override
    public PassagerResponseDTO createPassager(PassagerCreateDTO dto) {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setTelephone(dto.getTelephone());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setMotDePasse("test123");
        utilisateur.setRole(Role.PASSAGER);
        utilisateur.setLanguage(Language.FR);
        utilisateur = utilisateurRepository.save(utilisateur);

        Passager passager = new Passager();
        passager.setUtilisateur(utilisateur);
        passager.setPhotoUrl(dto.getPhotoUrl());
        return mapToDTO(passagerRepository.save(passager));
    }

    @Override
    public List<PassagerResponseDTO> getAllPassagers() {
        return passagerRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public PassagerResponseDTO getPassagerById(Long id) {
        return mapToDTO(passagerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Passager introuvable")));
    }

    @Override
    public PassagerResponseDTO updatePassager(Long id, PassagerCreateDTO dto) {
        Passager passager = passagerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));
        Utilisateur utilisateur = passager.getUtilisateur();
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setTelephone(dto.getTelephone());
        utilisateur.setEmail(dto.getEmail());
        utilisateurRepository.save(utilisateur);
        passager.setPhotoUrl(dto.getPhotoUrl());
        return mapToDTO(passagerRepository.save(passager));
    }

    @Override
    public void deletePassager(Long id) {
        passagerRepository.deleteById(id);
    }

    private PassagerResponseDTO mapToDTO(Passager passager) {
        return new PassagerResponseDTO(passager.getId(), passager.getUtilisateur().getNom(), passager.getUtilisateur().getPrenom(), passager.getUtilisateur().getTelephone(), passager.getUtilisateur().getEmail(), passager.getPhotoUrl(), passager.getDateCreation());
    }
}