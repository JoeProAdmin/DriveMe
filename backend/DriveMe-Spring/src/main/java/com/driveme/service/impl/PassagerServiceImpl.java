package com.driveme.service.impl;

import com.driveme.dto.PassagerCreateDTO;
import com.driveme.dto.PassagerResponseDTO;
import com.driveme.entity.Passager;
import com.driveme.repository.PassagerRepository;
import com.driveme.service.PassagerService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PassagerServiceImpl implements PassagerService {

    private final PassagerRepository passagerRepository;

    public PassagerServiceImpl(PassagerRepository passagerRepository) {
        this.passagerRepository = passagerRepository;
    }

    @Override
    public PassagerResponseDTO createPassager(PassagerCreateDTO dto) {

        if (passagerRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un passager avec cet email existe déjà");
        }

        if (passagerRepository.existsByTelephone(dto.getTelephone())) {
            throw new RuntimeException("Un passager avec ce téléphone existe déjà");
        }

        Passager passager = new Passager();
        passager.setNom(dto.getNom());
        passager.setPrenom(dto.getPrenom());
        passager.setTelephone(dto.getTelephone());
        passager.setEmail(dto.getEmail());
        passager.setPhotoUrl(dto.getPhotoUrl());

        Passager saved = passagerRepository.save(passager);

        return mapToResponse(saved);
    }

    @Override
    public List<PassagerResponseDTO> getAllPassagers() {
        return passagerRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PassagerResponseDTO getPassagerById(Long id) {
        Passager passager = passagerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passager introuvable avec l'id : " + id));

        return mapToResponse(passager);
    }

    @Override
    public PassagerResponseDTO updatePassager(Long id, PassagerCreateDTO dto) {

        Passager passager = passagerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passager introuvable avec l'id : " + id));

        passager.setNom(dto.getNom());
        passager.setPrenom(dto.getPrenom());
        passager.setTelephone(dto.getTelephone());
        passager.setEmail(dto.getEmail());
        passager.setPhotoUrl(dto.getPhotoUrl());

        Passager updated = passagerRepository.save(passager);

        return mapToResponse(updated);
    }

    @Override
    public void deletePassager(Long id) {

        Passager passager = passagerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passager introuvable avec l'id : " + id));

        passagerRepository.delete(passager);
    }

    private PassagerResponseDTO mapToResponse(Passager passager) {
        return new PassagerResponseDTO(
                passager.getId(),
                passager.getNom(),
                passager.getPrenom(),
                passager.getTelephone(),
                passager.getEmail(),
                passager.getPhotoUrl(),
                passager.getDateCreation()
        );
    }
}