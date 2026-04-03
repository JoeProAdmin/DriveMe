package com.driveme.service;

import com.driveme.entity.Paiement;

public interface PaiementService {

    Paiement creerPaiement(Long courseId, Double montant, String methode);
}