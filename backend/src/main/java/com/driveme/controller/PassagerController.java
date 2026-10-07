package com.driveme.controller;

import com.driveme.dto.PassagerCreateDTO;
import com.driveme.dto.PassagerResponseDTO;
import com.driveme.service.PassagerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.security.Principal;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/passagers")
public class PassagerController {

    private final PassagerService passagerService;

    public PassagerController(PassagerService passagerService) {
        this.passagerService = passagerService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PassagerResponseDTO> create(@Valid @RequestBody PassagerCreateDTO dto) {
        PassagerResponseDTO created = passagerService.createPassager(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<PassagerResponseDTO>> getAll() {
        return ResponseEntity.ok(passagerService.getAllPassagers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PassagerResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(passagerService.getPassagerById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/email/{email}")
    public ResponseEntity<PassagerResponseDTO> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(passagerService.getPassagerByEmail(email));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PassagerResponseDTO> update(@PathVariable Long id,
                                                      @Valid @RequestBody PassagerCreateDTO dto) {
        return ResponseEntity.ok(passagerService.updatePassager(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        passagerService.deletePassager(id);
        return ResponseEntity.ok("Passager supprimé");
    }

    @PreAuthorize("hasRole('PASSAGER')")
    @GetMapping("/me")
    public ResponseEntity<PassagerResponseDTO> getCurrent(Principal principal) {
        return ResponseEntity.ok(
                passagerService.getPassagerByEmail(principal.getName())
        );
    }

    @PreAuthorize("hasRole('PASSAGER')")
    @DeleteMapping("/me")
    public ResponseEntity<String> deleteCurrent(Principal principal) {
        passagerService.deleteCurrentPassager(principal.getName());
        return ResponseEntity.ok("Compte ferme. Les donnees du profil ont ete retirees. Un historique peut subsister selon la politique de conservation.");
    }
}