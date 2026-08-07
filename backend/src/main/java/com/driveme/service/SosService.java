package com.driveme.service;

import com.driveme.dto.SosCreateDTO;
import com.driveme.dto.SosResponseDTO;
import com.driveme.entity.SosStatus;
import com.driveme.entity.Utilisateur;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.SosIncidentRepository;
import com.driveme.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SosService {
    private final SosIncidentRepository incidentRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
    public SosResponseDTO create(SosCreateDTO request, String email) {
        Utilisateur user = requireUser(email);
        if (user.getRole().name().equals("ADMIN")) {
            throw new AccessDeniedException("Un administrateur ne peut pas déclarer un SOS utilisateur");
        }
        var incident = new com.driveme.entity.SosIncident();
        incident.setUtilisateur(user);
        incident.setType(request.type().trim());
        incident.setDescription(request.description().trim());
        incident.setLatitude(request.latitude());
        incident.setLongitude(request.longitude());
        incident.setPrecisionMetres(request.precisionMetres());
        return toDto(incidentRepository.save(incident));
    }

    @Transactional(readOnly = true)
    public List<SosResponseDTO> getMine(String email) {
        Utilisateur user = requireUser(email);
        return incidentRepository.findByUtilisateurIdOrderByDateCreationDesc(user.getId())
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<SosResponseDTO> getAll() {
        return incidentRepository.findAllByOrderByDateCreationDesc().stream().map(this::toDto).toList();
    }

    @Transactional
    public SosResponseDTO updateStatus(Long id, SosStatus status) {
        var incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident SOS introuvable"));
        incident.setStatut(status);
        incident.setDateMiseAJour(LocalDateTime.now());
        return toDto(incidentRepository.save(incident));
    }

    private Utilisateur requireUser(String email) {
        return utilisateurRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
    }

    private SosResponseDTO toDto(com.driveme.entity.SosIncident incident) {
        Utilisateur u = incident.getUtilisateur();
        return new SosResponseDTO(incident.getId(), u.getId(), u.getPrenom() + " " + u.getNom(),
                u.getEmail(), u.getTelephone(), u.getRole().name(), incident.getType(),
                incident.getDescription(), incident.getLatitude(), incident.getLongitude(),
                incident.getPrecisionMetres(), incident.getStatut(), incident.getDateCreation(),
                incident.getDateMiseAJour());
    }
}
