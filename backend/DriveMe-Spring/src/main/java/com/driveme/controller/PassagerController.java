package com.driveme.controller;

import com.driveme.dto.PassagerCreateDTO;
import com.driveme.dto.PassagerResponseDTO;
import com.driveme.service.PassagerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/passagers")
public class PassagerController {

    private final PassagerService passagerService;

    public PassagerController(PassagerService passagerService) {
        this.passagerService = passagerService;
    }

    @PostMapping
    public ResponseEntity<PassagerResponseDTO> create(@Valid @RequestBody PassagerCreateDTO dto) {
        PassagerResponseDTO created = passagerService.createPassager(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PassagerResponseDTO>> getAll() {
        return ResponseEntity.ok(passagerService.getAllPassagers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PassagerResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(passagerService.getPassagerById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PassagerResponseDTO> update(@PathVariable Long id,
                                                      @Valid @RequestBody PassagerCreateDTO dto) {
        return ResponseEntity.ok(passagerService.updatePassager(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        passagerService.deletePassager(id);
        return ResponseEntity.ok("Passager supprimé");
    }
}