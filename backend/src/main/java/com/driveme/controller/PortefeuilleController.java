package com.driveme.controller;

import com.driveme.dto.*;
import com.driveme.service.PortefeuilleService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/portefeuille")
public class PortefeuilleController {
    private final PortefeuilleService service;
    public PortefeuilleController(PortefeuilleService service){this.service=service;}
    @PreAuthorize("hasRole('CHAUFFEUR')") @PostMapping("/me/recharges")
    public TransactionPortefeuilleDTO demander(@Valid @RequestBody RechargeCreateDTO dto, Principal p){return service.demanderRecharge(p.getName(),dto);}
    @PreAuthorize("hasRole('CHAUFFEUR')") @GetMapping("/me/transactions")
    public List<TransactionPortefeuilleDTO> historique(Principal p){return service.historique(p.getName());}
    @PreAuthorize("hasRole('ADMIN')") @GetMapping("/admin/recharges/en-attente")
    public List<TransactionPortefeuilleDTO> attente(){return service.rechargesEnAttente();}
    @PreAuthorize("hasRole('ADMIN')") @PutMapping("/admin/recharges/{id}")
    public TransactionPortefeuilleDTO valider(@PathVariable Long id,@RequestParam boolean approuver,Principal p){return service.validerRecharge(id,p.getName(),approuver);}
}
