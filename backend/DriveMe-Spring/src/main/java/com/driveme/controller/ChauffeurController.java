package com.driveme.controller;

import com.driveme.dto.ChauffeurCreateDTO;
import com.driveme.dto.ChauffeurResponseDTO;
import com.driveme.service.ChauffeurService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/chauffeurs")
public class ChauffeurController {

    private final ChauffeurService chauffeurService;

    public ChauffeurController(ChauffeurService chauffeurService) {
        this.chauffeurService = chauffeurService;
    }

    // ===============================
    // GET ALL
    // ===============================
    @GetMapping
    public ResponseEntity<List<ChauffeurResponseDTO>> getAllChauffeurs() {
        return ResponseEntity.ok(chauffeurService.getAllChauffeurs());
    }

    // ===============================
    // GET BY ID
    // ===============================
    @GetMapping("/{id}")
    public ResponseEntity<ChauffeurResponseDTO> getChauffeur(@PathVariable Long id) {
        return ResponseEntity.ok(chauffeurService.getChauffeurById(id));
    }

    // ===============================
    // CREATE
    // ===============================
    @PostMapping
    public ResponseEntity<ChauffeurResponseDTO> createChauffeur(
            @Valid @RequestBody ChauffeurCreateDTO dto) {

        ChauffeurResponseDTO created = chauffeurService.createChauffeur(dto);

        return ResponseEntity
                .created(URI.create("/api/chauffeurs/" + created.getId()))
                .body(created);
    }

    // ===============================
    // UPDATE
    // ===============================
    @PutMapping("/{id}")
    public ResponseEntity<ChauffeurResponseDTO> updateChauffeur(
            @PathVariable Long id,
            @Valid @RequestBody ChauffeurCreateDTO dto) {

        return ResponseEntity.ok(chauffeurService.updateChauffeur(id, dto));
    }

    // ===============================
    // DELETE
    // ===============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChauffeur(@PathVariable Long id) {
        chauffeurService.deleteChauffeur(id);
        return ResponseEntity.noContent().build();
    }
}
