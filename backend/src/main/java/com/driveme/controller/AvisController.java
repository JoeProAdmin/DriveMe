package com.driveme.controller;

import com.driveme.dto.AvisDTO;
import com.driveme.service.AvisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avis")
@CrossOrigin(origins = "*")
public class AvisController {

    private final AvisService avisService;

    public AvisController(AvisService avisService) {
        this.avisService = avisService;
    }

    @PostMapping
    public ResponseEntity<Void> soumettreAvis(@RequestBody AvisDTO avisDTO) {

        avisService.soumettreAvis(avisDTO);

        return ResponseEntity.ok().build();
    }
}