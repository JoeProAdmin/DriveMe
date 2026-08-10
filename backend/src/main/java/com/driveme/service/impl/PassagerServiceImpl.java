package com.driveme.service.impl;

import com.driveme.dto.PassagerCreateDTO;
import com.driveme.dto.PassagerResponseDTO;
import com.driveme.entity.Language;
import com.driveme.entity.Passager;
import com.driveme.entity.Role;
import com.driveme.entity.Utilisateur;
import com.driveme.exception.BusinessRuleException;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.PassagerRepository;
import com.driveme.repository.SosIncidentRepository;
import com.driveme.repository.UtilisateurRepository;
import com.driveme.service.PassagerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PassagerServiceImpl implements PassagerService {

    private final PassagerRepository passagerRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final CourseRepository courseRepository;
    private final SosIncidentRepository sosIncidentRepository;

    public PassagerServiceImpl(PassagerRepository passagerRepository,
                               UtilisateurRepository utilisateurRepository,
                               CourseRepository courseRepository,
                               SosIncidentRepository sosIncidentRepository) {
        this.passagerRepository = passagerRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.courseRepository = courseRepository;
        this.sosIncidentRepository = sosIncidentRepository;
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
        return passagerRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PassagerResponseDTO getPassagerById(Long id) {
        Passager passager = passagerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

        return mapToDTO(passager);
    }

    @Override
    public PassagerResponseDTO getPassagerByEmail(String email) {
        Passager passager = passagerRepository.findByUtilisateur_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

        return mapToDTO(passager);
    }

    @Override
    public PassagerResponseDTO updatePassager(Long id, PassagerCreateDTO dto) {
        Passager passager = passagerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

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
    @Transactional
    public void deletePassager(Long id) {
        Passager passager = passagerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passager introuvable"));

        Utilisateur utilisateur = passager.getUtilisateur();
        Long utilisateurId = utilisateur.getId();

        if (courseRepository.existsByPassagerId(id)) {
            throw new BusinessRuleException(
                    "Suppression impossible : ce passager possède un historique de courses. " +
                    "Son compte doit être conservé pour garantir la traçabilité."
            );
        }

        if (sosIncidentRepository.existsByUtilisateurId(utilisateurId)) {
            throw new BusinessRuleException(
                    "Suppression impossible : ce passager possède un historique d'incidents SOS. " +
                    "Son compte doit être conservé pour garantir la traçabilité."
            );
        }

        passagerRepository.delete(passager);
        passagerRepository.flush();
        utilisateurRepository.delete(utilisateur);
    }

    @Override
    public long count() {
        return passagerRepository.count();
    }

    private PassagerResponseDTO mapToDTO(Passager passager) {
        return new PassagerResponseDTO(
                passager.getId(),
                passager.getUtilisateur().getNom(),
                passager.getUtilisateur().getPrenom(),
                passager.getUtilisateur().getTelephone(),
                passager.getUtilisateur().getEmail(),
                passager.getPhotoUrl(),
                passager.getDateCreation()
        );
    }
}
