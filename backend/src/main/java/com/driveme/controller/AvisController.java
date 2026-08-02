package com.driveme.controller;

import com.driveme.dto.AvisDTO;
import com.driveme.service.AvisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/avis")
public class AvisController {

    private final AvisService avisService;

    public AvisController(AvisService avisService) {
        this.avisService = avisService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PASSAGER')")
    public ResponseEntity<Void> soumettreAvis(
            @Valid @RequestBody AvisDTO avisDTO,
            Principal principal) {

        avisService.soumettreAvis(
                avisDTO,
                principal.getName()
        );

        return ResponseEntity.ok().build();
    }
}