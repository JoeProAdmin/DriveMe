package com.driveme.dto;

import com.driveme.entity.SosStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SosResponseDTO(
        Long id,
        Long utilisateurId,
        String utilisateurNom,
        String utilisateurEmail,
        String utilisateurTelephone,
        String utilisateurRole,
        String type,
        String description,
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal precisionMetres,
        SosStatus statut,
        LocalDateTime dateCreation,
        LocalDateTime dateMiseAJour
) {}
