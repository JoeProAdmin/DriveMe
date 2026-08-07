package com.driveme.service;

import com.driveme.dto.*;
import java.util.List;

public interface PortefeuilleService {
    void attribuerBonusBienvenue(Long chauffeurId);
    void verifierCreditPourCourse(Long chauffeurId, java.math.BigDecimal prix);
    void debiterCommissionCourse(Long courseId);
    TransactionPortefeuilleDTO demanderRecharge(String email, RechargeCreateDTO dto);
    List<TransactionPortefeuilleDTO> historique(String email);
    List<TransactionPortefeuilleDTO> rechargesEnAttente();
    TransactionPortefeuilleDTO validerRecharge(Long id, String adminEmail, boolean approuver);
}
