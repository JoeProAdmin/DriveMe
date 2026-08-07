package com.driveme.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionPortefeuilleDTO(Long id, Long chauffeurId, String chauffeurNom, Long courseId,
 String type, String statut, BigDecimal montant, BigDecimal soldeAvant, BigDecimal soldeApres,
 String methode, String reference, String description, LocalDateTime dateCreation, LocalDateTime dateValidation) {}
