package com.driveme.controller;

import com.driveme.dto.ChauffeurCreateDTO;
import com.driveme.dto.ChauffeurResponseDTO;
import com.driveme.dto.ChauffeurPositionRequestDTO;
import com.driveme.dto.ChauffeurDisponibiliteRequestDTO;
import com.driveme.dto.ChauffeurDocumentDTO;
import com.driveme.entity.DocumentValidationStatus;
import com.driveme.entity.DriverType;
import com.driveme.service.ChauffeurDocumentService;
import com.driveme.service.ChauffeurService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.driveme.entity.ChauffeurDocumentType;

import java.util.List;
import java.security.Principal;
import java.nio.charset.StandardCharsets;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/chauffeurs")
public class ChauffeurController {

    private final ChauffeurService chauffeurService;
    private final ChauffeurDocumentService chauffeurDocumentService;

    public ChauffeurController(
            ChauffeurService chauffeurService,
            ChauffeurDocumentService chauffeurDocumentService
    ) {
        this.chauffeurService = chauffeurService;
        this.chauffeurDocumentService = chauffeurDocumentService;
    }

    @PreAuthorize("hasRole('CHAUFFEUR')")
    @GetMapping("/me")
    public ResponseEntity<ChauffeurResponseDTO> getCurrent(Principal principal) {
        return ResponseEntity.ok(chauffeurService.getCurrentChauffeur(principal.getName()));
    }

    @PreAuthorize("hasRole('CHAUFFEUR')")
    @PatchMapping("/me/position")
    public ResponseEntity<ChauffeurResponseDTO> updatePosition(
            Principal principal,
            @Valid @RequestBody ChauffeurPositionRequestDTO dto) {
        return ResponseEntity.ok(chauffeurService.updateCurrentPosition(principal.getName(), dto));
    }

    @PreAuthorize("hasRole('CHAUFFEUR')")
    @PatchMapping("/me/disponibilite")
    public ResponseEntity<ChauffeurResponseDTO> updateDisponibilite(
            Principal principal,
            @Valid @RequestBody ChauffeurDisponibiliteRequestDTO dto) {
        return ResponseEntity.ok(chauffeurService.updateCurrentDisponibilite(principal.getName(), dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ChauffeurResponseDTO>> getAllChauffeurs() {
        return ResponseEntity.ok(
                chauffeurService.getAllChauffeurs()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ChauffeurResponseDTO> getChauffeurById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                chauffeurService.getChauffeurById(id)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/email/{email}")
    public ResponseEntity<ChauffeurResponseDTO> getChauffeurByEmail(
            @PathVariable String email
    ) {
        return ResponseEntity.ok(
                chauffeurService.getChauffeurByEmail(email)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
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

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ChauffeurResponseDTO> updateChauffeur(
            @PathVariable Long id,
            @Valid @RequestBody ChauffeurCreateDTO dto
    ) {

        return ResponseEntity.ok(
                chauffeurService.updateChauffeur(id, dto)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/validation")
    public ResponseEntity<ChauffeurResponseDTO> updateStatutValidation(
            @PathVariable Long id,
            @RequestParam Integer statut
    ) {

        return ResponseEntity.ok(
                chauffeurService.updateStatutValidation(id, statut)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/type")
    public ResponseEntity<ChauffeurResponseDTO> updateTypeChauffeur(
            @PathVariable Long id, @RequestParam DriverType type) {
        return ResponseEntity.ok(chauffeurService.updateTypeChauffeur(id, type));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/documents/{documentId}/validation")
    public ResponseEntity<ChauffeurDocumentDTO> updateDocumentValidation(
            @PathVariable Long id,
            @PathVariable Long documentId,
            @RequestParam DocumentValidationStatus statut
    ) {
        return ResponseEntity.ok(
                chauffeurDocumentService.updateValidation(id, documentId, statut)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/documents/{documentId}/content")
    public ResponseEntity<Resource> getDocumentContent(
            @PathVariable Long id,
            @PathVariable Long documentId
    ) {
        ChauffeurDocumentService.DocumentContent content =
                chauffeurDocumentService.loadContent(id, documentId);
        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(content.contentType());
        } catch (IllegalArgumentException ex) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }
        ContentDisposition disposition = ContentDisposition.inline()
                .filename(content.originalFilename(), StandardCharsets.UTF_8)
                .build();
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(content.resource());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/{id}/documents/{type}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChauffeurDocumentDTO> addDocument(
            @PathVariable Long id,
            @PathVariable ChauffeurDocumentType type,
            @RequestPart("file") MultipartFile file) {
        com.driveme.entity.Chauffeur chauffeur = chauffeurService.getEntityById(id);
        return new ResponseEntity<>(chauffeurDocumentService.addDocument(chauffeur, type, file), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
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
