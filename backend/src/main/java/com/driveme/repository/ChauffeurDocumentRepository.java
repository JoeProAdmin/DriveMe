package com.driveme.repository;

import com.driveme.entity.ChauffeurDocument;
import com.driveme.entity.ChauffeurDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChauffeurDocumentRepository extends JpaRepository<ChauffeurDocument, Long> {

    List<ChauffeurDocument> findByChauffeurIdOrderByTypeDocumentAsc(Long chauffeurId);

    Optional<ChauffeurDocument> findByIdAndChauffeurId(Long id, Long chauffeurId);

    Optional<ChauffeurDocument> findByChauffeurIdAndTypeDocument(Long chauffeurId, ChauffeurDocumentType typeDocument);
}
