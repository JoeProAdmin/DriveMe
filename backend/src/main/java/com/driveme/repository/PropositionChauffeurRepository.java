package com.driveme.repository;

import com.driveme.entity.PropositionChauffeur;
import com.driveme.entity.PropositionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropositionChauffeurRepository
        extends JpaRepository<PropositionChauffeur, Long> {

    List<PropositionChauffeur> findByCourseId(Long courseId);

    List<PropositionChauffeur> findByCourseIdOrderByPrixProposeAsc(Long courseId);

    List<PropositionChauffeur> findByChauffeurId(Long chauffeurId);

    List<PropositionChauffeur> findByChauffeurUtilisateurEmailIgnoreCaseOrderByDateCreationDesc(String email);

    boolean existsByCourseIdAndChauffeurId(Long courseId, Long chauffeurId);

    List<PropositionChauffeur> findByCourseIdAndStatutProposition(
            Long courseId,
            PropositionStatus statut
    );

}
