package com.driveme.controller;

import com.driveme.dto.PaiementCreateDTO;
import com.driveme.dto.PaiementResponseDTO;
import com.driveme.service.PaiementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    private final PaiementService paiementService;

    public PaiementController(PaiementService paiementService) {
        this.paiementService = paiementService;
    }

    @PostMapping("/valider")
    public ResponseEntity<PaiementResponseDTO> validerPaiement(
            @RequestBody PaiementCreateDTO dto
    ) {
        PaiementResponseDTO paiement = paiementService.validerPaiement(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(paiement);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<PaiementResponseDTO> getPaiementByCourse(
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(
                paiementService.getPaiementByCourse(courseId)
        );
    }

    @GetMapping
    public ResponseEntity<List<PaiementResponseDTO>> getAllPaiements() {
        return ResponseEntity.ok(paiementService.getAllPaiements());
    }

    @PutMapping("/{paiementId}/refuser")
    public ResponseEntity<PaiementResponseDTO> refuserPaiement(
            @PathVariable Long paiementId
    ) {
        return ResponseEntity.ok(
                paiementService.refuserPaiement(paiementId)
        );
    }
}
