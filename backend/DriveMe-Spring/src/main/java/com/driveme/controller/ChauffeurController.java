package com.driveme.controller;

import com.driveme.dto.ChauffeurResponseDTO;
import com.driveme.entity.Chauffeur;
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

    @GetMapping
    public ResponseEntity<List<ChauffeurResponseDTO>> getAllChauffeurs() {
        return ResponseEntity.ok(chauffeurService.getAllChauffeurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChauffeurResponseDTO> getChauffeur(@PathVariable Long id) {
        return ResponseEntity.ok(chauffeurService.getChauffeurById(id));
    }

    @PostMapping
    public ResponseEntity<Chauffeur> createChauffeur(@Valid @RequestBody Chauffeur chauffeur) {

        Chauffeur created = chauffeurService.createChauffeur(chauffeur);

        return ResponseEntity
                .created(URI.create("/api/chauffeurs/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Chauffeur> updateChauffeur(@PathVariable Long id,
                                                     @Valid @RequestBody Chauffeur chauffeur) {

        Chauffeur updated = chauffeurService.updateChauffeur(id, chauffeur);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChauffeur(@PathVariable Long id) {

        chauffeurService.deleteChauffeur(id);

        return ResponseEntity.noContent().build();
    }
}
