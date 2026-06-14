package com.driveme.controller;

import com.driveme.dto.ChauffeurCreateDTO;
import com.driveme.dto.ChauffeurResponseDTO;
import com.driveme.service.ChauffeurService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chauffeurs")
public class ChauffeurController {

    private final ChauffeurService chauffeurService;

    public ChauffeurController(
            ChauffeurService chauffeurService
    ) {
        this.chauffeurService = chauffeurService;
    }

    @GetMapping
    public ResponseEntity<List<ChauffeurResponseDTO>> getAllChauffeurs() {
        return ResponseEntity.ok(
                chauffeurService.getAllChauffeurs()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChauffeurResponseDTO> getChauffeurById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                chauffeurService.getChauffeurById(id)
        );
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ChauffeurResponseDTO> getChauffeurByEmail(
            @PathVariable String email
    ) {
        return ResponseEntity.ok(
                chauffeurService.getChauffeurByEmail(email)
        );
    }

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

    @PutMapping("/{id}")
    public ResponseEntity<ChauffeurResponseDTO> updateChauffeur(
            @PathVariable Long id,
            @Valid @RequestBody ChauffeurCreateDTO dto
    ) {

        return ResponseEntity.ok(
                chauffeurService.updateChauffeur(id, dto)
        );
    }

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