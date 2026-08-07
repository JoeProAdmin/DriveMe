package com.driveme.controller;

import com.driveme.dto.SosCreateDTO;
import com.driveme.dto.SosResponseDTO;
import com.driveme.entity.SosStatus;
import com.driveme.service.SosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/sos")
@RequiredArgsConstructor
public class SosController {
    private final SosService sosService;

    @PostMapping
    @PreAuthorize("hasAnyRole('PASSAGER','CHAUFFEUR')")
    public SosResponseDTO create(@Valid @RequestBody SosCreateDTO request, Principal principal) {
        return sosService.create(request, principal.getName());
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('PASSAGER','CHAUFFEUR')")
    public List<SosResponseDTO> mine(Principal principal) {
        return sosService.getMine(principal.getName());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<SosResponseDTO> all() {
        return sosService.getAll();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public SosResponseDTO updateStatus(@PathVariable Long id, @RequestParam SosStatus status) {
        return sosService.updateStatus(id, status);
    }
}
