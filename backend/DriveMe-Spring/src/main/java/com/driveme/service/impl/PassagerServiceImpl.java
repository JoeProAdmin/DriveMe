package com.driveme.service.impl;

import com.driveme.dto.PassagerCreateDTO;
import com.driveme.dto.PassagerResponseDTO;
import com.driveme.entity.Passager;
import com.driveme.entity.Utilisateur;
import com.driveme.repository.PassagerRepository;
import com.driveme.repository.UtilisateurRepository;
import com.driveme.service.PassagerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassagerServiceImpl implements PassagerService {

    private final PassagerRepository passagerRepository;
    private final UtilisateurRepository utilisateurRepository;

    public PassagerServiceImpl(PassagerRepository passagerRepository,
                               UtilisateurRepository utilisateurRepository) {
        this.passagerRepository = passagerRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public List<PassagerResponseDTO> getAllPassagers() {
        return passagerRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public PassagerResponseDTO createPassager(PassagerCreateDTO dto) {

        Utilisateur utilisateur = utilisateurRepository.findById(dto.getUtilisateurId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Passager passager = new Passager();
        passager.setPhoto(dto.getPhoto());
        passager.setUtilisateur(utilisateur);

        Passager saved = passagerRepository.save(passager);

        return mapToDTO(saved);
    }

    private PassagerResponseDTO mapToDTO(Passager passager) {
        return new PassagerResponseDTO(
                passager.getId(),
                passager.getPhoto(),
                passager.getUtilisateur().getId()
        );
    }
}
