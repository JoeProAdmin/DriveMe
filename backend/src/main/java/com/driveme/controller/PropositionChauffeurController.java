package com.driveme.controller;

import com.driveme.dto.PropositionCreateDTO;
import com.driveme.dto.PropositionResponseDTO;
import com.driveme.service.PropositionChauffeurService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PropositionChauffeurController {
    private final PropositionChauffeurService propositionService;

    public PropositionChauffeurController(PropositionChauffeurService propositionService) {
        this.propositionService = propositionService;
    }

    @PreAuthorize("hasRole('CHAUFFEUR')")
    @PostMapping("/courses/{courseId}/propositions")
    public ResponseEntity<PropositionResponseDTO> creer(
            @PathVariable Long courseId, @Valid @RequestBody PropositionCreateDTO dto, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(propositionService.creerProposition(courseId, dto, principal.getName()));
    }

    @PreAuthorize("hasRole('PASSAGER')")
    @GetMapping("/courses/{courseId}/propositions")
    public List<PropositionResponseDTO> parCourse(@PathVariable Long courseId, Principal principal) {
        return propositionService.getPropositionsByCourse(courseId, principal.getName());
    }

    @PreAuthorize("hasRole('CHAUFFEUR')")
    @GetMapping("/chauffeurs/me/propositions")
    public List<PropositionResponseDTO> mesPropositions(Principal principal) {
        return propositionService.getCurrentChauffeurPropositions(principal.getName());
    }

    @PreAuthorize("hasRole('PASSAGER')")
    @PostMapping("/propositions/{propositionId}/accepter")
    public PropositionResponseDTO accepter(@PathVariable Long propositionId, Principal principal) {
        return propositionService.choisirProposition(propositionId, principal.getName());
    }
}
