package com.driveme.service;

import com.driveme.dto.ChauffeurDocumentDTO;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.ChauffeurDocument;
import com.driveme.entity.ChauffeurDocumentType;
import com.driveme.entity.DocumentValidationStatus;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.ChauffeurDocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChauffeurDocumentService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChauffeurDocumentService.class);

    public record DocumentContent(Resource resource, String contentType, String originalFilename) {}

    private static final long MAX_FILE_SIZE = 10L * 1024L * 1024L;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf", "image/jpeg", "image/png", "image/webp"
    );
    private static final Set<ChauffeurDocumentType> REQUIRED_TYPES = EnumSet.of(
            ChauffeurDocumentType.CIN,
            ChauffeurDocumentType.PERMIS,
            ChauffeurDocumentType.CARTE_GRISE,
            ChauffeurDocumentType.ASSURANCE,
            ChauffeurDocumentType.SELFIE
    );

    private final ChauffeurDocumentRepository repository;
    private final Path storageRoot;

    public ChauffeurDocumentService(
            ChauffeurDocumentRepository repository,
            @Value("${app.storage.driver-documents}") String storageRoot
    ) {
        this.repository = repository;
        this.storageRoot = Path.of(storageRoot).toAbsolutePath().normalize();
    }

    public void saveInitialDocuments(
            Chauffeur chauffeur,
            MultipartFile cin,
            MultipartFile permis,
            MultipartFile carteGrise,
            MultipartFile assurance,
            MultipartFile selfie,
            MultipartFile vehiculeAvant,
            MultipartFile vehiculeArriere
    ) {
        requireFile(cin, "La CIN est obligatoire");
        requireFile(permis, "Le permis est obligatoire");
        requireFile(carteGrise, "La carte grise est obligatoire");
        requireFile(assurance, "L'assurance est obligatoire");
        requireFile(selfie, "Le selfie de contrôle est obligatoire");

        save(chauffeur, ChauffeurDocumentType.CIN, cin);
        save(chauffeur, ChauffeurDocumentType.PERMIS, permis);
        save(chauffeur, ChauffeurDocumentType.CARTE_GRISE, carteGrise);
        save(chauffeur, ChauffeurDocumentType.ASSURANCE, assurance);
        save(chauffeur, ChauffeurDocumentType.SELFIE, selfie);
        if (vehiculeAvant != null && !vehiculeAvant.isEmpty()) {
            save(chauffeur, ChauffeurDocumentType.VEHICULE_AVANT, vehiculeAvant);
        }
        if (vehiculeArriere != null && !vehiculeArriere.isEmpty()) {
            save(chauffeur, ChauffeurDocumentType.VEHICULE_ARRIERE, vehiculeArriere);
        }
    }

    public List<ChauffeurDocumentDTO> listForChauffeur(Long chauffeurId) {
        return repository.findByChauffeurIdOrderByTypeDocumentAsc(chauffeurId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public ChauffeurDocumentDTO updateValidation(
            Long chauffeurId,
            Long documentId,
            DocumentValidationStatus status
    ) {
        if (status == null) {
            throw new IllegalArgumentException("Le statut du document est obligatoire");
        }
        ChauffeurDocument document = repository.findByIdAndChauffeurId(documentId, chauffeurId)
                .orElseThrow(() -> new ResourceNotFoundException("Document chauffeur introuvable"));
        document.setStatutValidation(status);
        document.setDateValidation(status == DocumentValidationStatus.EN_ATTENTE ? null : LocalDateTime.now());
        return toDto(repository.save(document));
    }

    public DocumentContent loadContent(Long chauffeurId, Long documentId) {
        ChauffeurDocument document = repository.findByIdAndChauffeurId(documentId, chauffeurId)
                .orElseThrow(() -> new ResourceNotFoundException("Document chauffeur introuvable"));
        Path path = resolveStoredPath(chauffeurId, document.getNomStockage());
        if (!Files.isRegularFile(path)) {
            throw new ResourceNotFoundException("Fichier chauffeur introuvable sur le stockage");
        }
        return new DocumentContent(
                new FileSystemResource(path),
                document.getTypeContenu(),
                document.getNomOriginal()
        );
    }

    public boolean requiredDocumentsApproved(Long chauffeurId) {
        Map<ChauffeurDocumentType, ChauffeurDocument> byType = new EnumMap<>(ChauffeurDocumentType.class);
        for (ChauffeurDocument document : repository.findByChauffeurIdOrderByTypeDocumentAsc(chauffeurId)) {
            byType.put(document.getTypeDocument(), document);
        }
        return REQUIRED_TYPES.stream().allMatch(type -> {
            ChauffeurDocument document = byType.get(type);
            return document != null && document.getStatutValidation() == DocumentValidationStatus.APPROUVE;
        });
    }

    private ChauffeurDocument save(Chauffeur chauffeur, ChauffeurDocumentType type, MultipartFile file) {
        validateFile(file);
        if (repository.findByChauffeurIdAndTypeDocument(chauffeur.getId(), type).isPresent()) {
            throw new IllegalStateException("Un document de type " + type + " existe déjà pour ce chauffeur");
        }

        String originalName = Optional.ofNullable(file.getOriginalFilename())
                .map(Path::of)
                .map(Path::getFileName)
                .map(Path::toString)
                .filter(name -> !name.isBlank())
                .orElse(type.name().toLowerCase(Locale.ROOT));
        String contentType = normalizeContentType(file.getContentType());
        String storedName = UUID.randomUUID() + extensionFor(contentType);
        Path driverDirectory = storageRoot.resolve(chauffeur.getId().toString()).normalize();
        Path destination = driverDirectory.resolve(storedName).normalize();

        if (!destination.startsWith(driverDirectory) || !driverDirectory.startsWith(storageRoot)) {
            throw new SecurityException("Chemin de stockage invalide");
        }

        try {
            Files.createDirectories(driverDirectory);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            LOGGER.error(
                    "Echec du stockage du document {} pour le chauffeur {} vers {} (fichier={}, taille={}, type={})",
                    type,
                    chauffeur.getId(),
                    destination,
                    originalName,
                    file.getSize(),
                    contentType,
                    ex
            );
            throw new IllegalStateException("Impossible de stocker le document " + type, ex);
        }

        ChauffeurDocument document = new ChauffeurDocument();
        document.setChauffeur(chauffeur);
        document.setTypeDocument(type);
        document.setNomOriginal(originalName);
        document.setNomStockage(storedName);
        document.setTypeContenu(contentType);
        document.setTailleOctets(file.getSize());
        document.setStatutValidation(DocumentValidationStatus.EN_ATTENTE);
        document.setDateDepot(LocalDateTime.now());

        try {
            return repository.save(document);
        } catch (RuntimeException ex) {
            try {
                Files.deleteIfExists(destination);
            } catch (IOException ignored) {
                // Le nettoyage ne doit pas masquer l'erreur de persistance initiale.
            }
            throw ex;
        }
    }

    private ChauffeurDocumentDTO toDto(ChauffeurDocument document) {
        ChauffeurDocumentDTO dto = new ChauffeurDocumentDTO();
        dto.setId(document.getId());
        dto.setType(document.getTypeDocument().name());
        dto.setNomOriginal(document.getNomOriginal());
        dto.setTypeContenu(document.getTypeContenu());
        dto.setTailleOctets(document.getTailleOctets());
        dto.setStatutValidation(document.getStatutValidation().name());
        dto.setDateDepot(document.getDateDepot());
        dto.setDateValidation(document.getDateValidation());
        return dto;
    }

    private Path resolveStoredPath(Long chauffeurId, String storedName) {
        Path driverDirectory = storageRoot.resolve(chauffeurId.toString()).normalize();
        Path path = driverDirectory.resolve(storedName).normalize();
        if (!path.startsWith(driverDirectory) || !driverDirectory.startsWith(storageRoot)) {
            throw new SecurityException("Chemin de stockage invalide");
        }
        return path;
    }

    private void requireFile(MultipartFile file, String message) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(message);
        }
    }

    private void validateFile(MultipartFile file) {
        requireFile(file, "Le fichier est vide");
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Chaque document doit faire au maximum 10 Mo");
        }
        String contentType = normalizeContentType(file.getContentType());
        if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Format de fichier non autorisé. Utilisez PDF, JPEG, PNG ou WebP");
        }
    }

    private String normalizeContentType(String contentType) {
        return contentType == null ? "" : contentType.toLowerCase(Locale.ROOT).trim();
    }

    private String extensionFor(String contentType) {
        return switch (contentType) {
            case "application/pdf" -> ".pdf";
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> "";
        };
    }
}
