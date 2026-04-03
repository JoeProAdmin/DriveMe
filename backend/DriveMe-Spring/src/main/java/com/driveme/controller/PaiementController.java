package com.driveme.controller;

import com.driveme.entity.Paiement;
import com.driveme.service.PaiementService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    private final PaiementService paiementService;

    public PaiementController(PaiementService paiementService) {
        this.paiementService = paiementService;
    }

    @PostMapping
    public Paiement creerPaiement(
            @RequestParam Long courseId,
            @RequestParam Double montant,
            @RequestParam String methode) {

        return paiementService.creerPaiement(courseId, montant, methode);
    }
}