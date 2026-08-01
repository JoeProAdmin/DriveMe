package com.driveme.controller;

import com.driveme.dto.ChauffeurCreateDTO;
import com.driveme.dto.ChauffeurResponseDTO;
import com.driveme.dto.ChauffeurPositionRequestDTO;
import com.driveme.dto.ChauffeurDisponibiliteRequestDTO;
import com.driveme.service.ChauffeurService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.security.Principal;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/chauffeurs")
public class ChauffeurController {

    private final ChauffeurService chauffeurService;

    public ChauffeurController(
            ChauffeurService chauffeurService
    ) {
        this.chauffeurService = chauffeurService;
    }

    @PreAuthorize("hasRole('CHAUFFEUR')")
    @GetMapping("/me")
    public ResponseEntity<ChauffeurResponseDTO> getCurrent(Principal principal) {
        return ResponseEntity.ok(chauffeurService.getCurrentChauffeur(principal.getName()));
    }

    @PreAuthorize("hasRole('CHAUFFEUR')")
    @PatchMapping("/me/position")
    public ResponseEntity<ChauffeurResponseDTO> updatePosition(
            Principal principal,
            @Valid @RequestBody ChauffeurPositionRequestDTO dto) {
        return ResponseEntity.ok(chauffeurService.updateCurrentPosition(principal.getName(), dto));
    }

    @PreAuthorize("hasRole('CHAUFFEUR')")
    @PatchMapping("/me/disponibilite")
    public ResponseEntity<ChauffeurResponseDTO> updateDisponibilite(
            Principal principal,
            @Valid @RequestBody ChauffeurDisponibiliteRequestDTO dto) {
        return ResponseEntity.ok(chauffeurService.updateCurrentDisponibilite(principal.getName(), dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ChauffeurResponseDTO>> getAllChauffeurs() {
        return ResponseEntity.ok(
                chauffeurService.getAllChauffeurs()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ChauffeurResponseDTO> getChauffeurById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                chauffeurService.getChauffeurById(id)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/email/{email}")
    public ResponseEntity<ChauffeurResponseDTO> getChauffeurByEmail(
            @PathVariable String email
    ) {
        return ResponseEntity.ok(
                chauffeurService.getChauffeurByEmail(email)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ChauffeurResponseDTO> createChauffeur(
            @Valid @RequestBody ChauffeurCreateDTO dto
    ) {

        ChauffeurResponseDTO created =
                chauffeurService.createChauffeur(dto);

        return new ResponseEntity<>(
                created,
                HttpStatus.CREATED
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ChauffeurResponseDTO> updateChauffeur(
            @PathVariable Long id,
            @Valid @RequestBody ChauffeurCreateDTO dto
    ) {

        return ResponseEntity.ok(
                chauffeurService.updateChauffeur(id, dto)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/validation")
    public ResponseEntity<ChauffeurResponseDTO> updateStatutValidation(
            @PathVariable Long id,
            @RequestParam Integer statut
    ) {

        return ResponseEntity.ok(
                chauffeurService.updateStatutValidation(id, statut)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteChauffeur(
            @PathVariable Long id
    ) {

        chauffeurService.deleteChauffeur(id);

        return ResponseEntity.ok(
                "Chauffeur supprimé"
        );
    }
}
