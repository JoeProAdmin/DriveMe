package com.driveme.controller;

import com.driveme.dto.PaiementCreateDTO;
import com.driveme.dto.PaiementResponseDTO;
import com.driveme.service.PaiementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    private final PaiementService paiementService;

    public PaiementController(PaiementService paiementService) {
        this.paiementService = paiementService;
    }

    @PreAuthorize("hasRole('PASSAGER')")
    @PostMapping("/valider")
    public ResponseEntity<PaiementResponseDTO> validerPaiement(
            Principal principal,
            @Valid @RequestBody PaiementCreateDTO dto
    ) {
        PaiementResponseDTO paiement = paiementService.validerPaiement(
                dto,
                principal.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(paiement);
    }

    @PreAuthorize("hasRole('PASSAGER')")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<PaiementResponseDTO> getPaiementByCourse(
            Principal principal,
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(
                paiementService.getPaiementByCourse(
                        courseId,
                        principal.getName()
                )
        );
    }

    @PreAuthorize("hasRole('PASSAGER')")
    @GetMapping("/me")
    public ResponseEntity<List<PaiementResponseDTO>> getMesPaiements(
            Principal principal
    ) {
        return ResponseEntity.ok(
                paiementService.getMesPaiements(
                        principal.getName()
                )
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<PaiementResponseDTO>> getAllPaiements() {
        return ResponseEntity.ok(
                paiementService.getAllPaiements()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{paiementId}/refuser")
    public ResponseEntity<PaiementResponseDTO> refuserPaiement(
            @PathVariable Long paiementId
    ) {
        return ResponseEntity.ok(
                paiementService.refuserPaiement(paiementId)
        );
    }
}