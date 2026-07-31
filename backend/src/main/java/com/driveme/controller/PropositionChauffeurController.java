package com.driveme.controller;

import com.driveme.dto.PropositionCreateDTO;
import com.driveme.dto.PropositionResponseDTO;
import com.driveme.service.PropositionChauffeurService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/propositions")
public class PropositionChauffeurController {

    private final PropositionChauffeurService propositionService;

    public PropositionChauffeurController(
            PropositionChauffeurService propositionService
    ) {
        this.propositionService = propositionService;
    }

    /**
     * Le chauffeur soumet une offre pour une course.
     */
    @PostMapping
    public ResponseEntity<PropositionResponseDTO> creerProposition(
            @Valid @RequestBody PropositionCreateDTO dto
    ) {

        PropositionResponseDTO response =
                propositionService.creerProposition(dto);

        return ResponseEntity.ok(response);
    }

    /**
     * Le passager récupère toutes les offres reçues pour une course.
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<PropositionResponseDTO>>
    getPropositionsByCourse(
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                propositionService.getPropositionsByCourse(courseId)
        );

    }

    /**
     * Le chauffeur consulte les offres qu'il a envoyées.
     */
    @GetMapping("/chauffeur/{chauffeurId}")
    public ResponseEntity<List<PropositionResponseDTO>>
    getPropositionsByChauffeur(
            @PathVariable Long chauffeurId
    ) {

        return ResponseEntity.ok(
                propositionService.getPropositionsByChauffeur(chauffeurId)
        );

    }

    /**
     * Le passager choisit définitivement une offre.
     */
    @PutMapping("/{courseId}/choisir/{propositionId}")
    public ResponseEntity<PropositionResponseDTO>
    choisirProposition(

            @PathVariable Long courseId,

            @PathVariable Long propositionId

    ) {

        return ResponseEntity.ok(

                propositionService.choisirProposition(
                        courseId,
                        propositionId
                )

        );

    }

}