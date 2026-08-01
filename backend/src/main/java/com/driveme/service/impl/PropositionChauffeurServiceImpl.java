package com.driveme.service.impl;

import com.driveme.dto.PropositionCreateDTO;
import com.driveme.dto.PropositionResponseDTO;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.Course;
import com.driveme.entity.CourseStatus;
import com.driveme.entity.PropositionChauffeur;
import com.driveme.entity.PropositionStatus;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.PropositionChauffeurRepository;
import com.driveme.service.PropositionChauffeurService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PropositionChauffeurServiceImpl implements PropositionChauffeurService {
    private static final byte CHAUFFEUR_VALIDE = 1;

    private final PropositionChauffeurRepository propositionRepository;
    private final CourseRepository courseRepository;
    private final ChauffeurRepository chauffeurRepository;

    public PropositionChauffeurServiceImpl(PropositionChauffeurRepository propositionRepository,
                                            CourseRepository courseRepository,
                                            ChauffeurRepository chauffeurRepository) {
        this.propositionRepository = propositionRepository;
        this.courseRepository = courseRepository;
        this.chauffeurRepository = chauffeurRepository;
    }

    @Override
    public PropositionResponseDTO creerProposition(Long courseId, PropositionCreateDTO dto, String chauffeurEmail) {
        Course course = courseRepository.findByIdForUpdate(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course introuvable"));
        if (course.getStatut() != CourseStatus.EN_ATTENTE && course.getStatut() != CourseStatus.PROPOSITION_RECUE) {
            throw new IllegalStateException("Cette course n'accepte plus de propositions.");
        }

        Chauffeur chauffeur = chauffeurRepository.findByUtilisateurEmail(chauffeurEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun profil chauffeur n'est associé au compte authentifié"));
        if (chauffeur.getStatutValidation() == null || chauffeur.getStatutValidation() != CHAUFFEUR_VALIDE) {
            throw new IllegalStateException("Le chauffeur doit être validé pour envoyer une proposition.");
        }
        if (!chauffeur.isDisponible()) {
            throw new IllegalStateException("Le chauffeur doit être disponible pour envoyer une proposition.");
        }
        if (propositionRepository.existsByCourseIdAndChauffeurId(courseId, chauffeur.getId())) {
            throw new IllegalStateException("Une proposition existe déjà pour cette course.");
        }

        PropositionChauffeur proposition = new PropositionChauffeur();
        proposition.setCourse(course);
        proposition.setChauffeur(chauffeur);
        proposition.setPrixPropose(dto.getPrixPropose());
        proposition.setDistanceChauffeurDepart(dto.getDistanceChauffeurDepart());
        proposition.setTempsEstimeMinutes(dto.getTempsEstimeMinutes());
        proposition.setMessage(dto.getMessage() == null ? null : dto.getMessage().trim());
        proposition.setStatutProposition(PropositionStatus.EN_ATTENTE);

        if (course.getStatut() == CourseStatus.EN_ATTENTE) {
            course.setStatut(CourseStatus.PROPOSITION_RECUE);
        }

        try {
            return mapToDTO(propositionRepository.save(proposition));
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalStateException("Une proposition existe déjà pour cette course.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropositionResponseDTO> getPropositionsByCourse(Long courseId, String passagerEmail) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course introuvable"));
        assertPassagerOwner(course, passagerEmail);
        return propositionRepository.findByCourseIdOrderByPrixProposeAsc(courseId).stream().map(this::mapToDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropositionResponseDTO> getCurrentChauffeurPropositions(String chauffeurEmail) {
        return propositionRepository
                .findByChauffeurUtilisateurEmailIgnoreCaseOrderByDateCreationDesc(chauffeurEmail)
                .stream().map(this::mapToDTO).toList();
    }

    @Override
    public PropositionResponseDTO choisirProposition(Long propositionId, String passagerEmail) {
        PropositionChauffeur initiale = propositionRepository.findById(propositionId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposition introuvable"));
        Course course = courseRepository.findByIdForUpdate(initiale.getCourse().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Course introuvable"));
        assertPassagerOwner(course, passagerEmail);

        if (course.getStatut() != CourseStatus.PROPOSITION_RECUE) {
            throw new IllegalStateException("Cette course n'est plus ouverte au choix d'une proposition.");
        }
        PropositionChauffeur choisie = propositionRepository.findById(propositionId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposition introuvable"));
        if (!choisie.getCourse().getId().equals(course.getId())
                || choisie.getStatutProposition() != PropositionStatus.EN_ATTENTE) {
            throw new IllegalStateException("Cette proposition n'est plus disponible.");
        }

        course.setChauffeur(choisie.getChauffeur());
        course.setPrix(choisie.getPrixPropose());
        course.setPrixFinal(choisie.getPrixPropose());
        course.setStatut(CourseStatus.ACCEPTEE);

        List<PropositionChauffeur> propositions = propositionRepository.findByCourseId(course.getId());
        for (PropositionChauffeur proposition : propositions) {
            proposition.setStatutProposition(
                    proposition.getId().equals(propositionId) ? PropositionStatus.ACCEPTEE : PropositionStatus.REFUSEE);
        }
        propositionRepository.saveAll(propositions);
        courseRepository.save(course);
        return mapToDTO(choisie);
    }

    private void assertPassagerOwner(Course course, String email) {
        if (!course.getPassager().getUtilisateur().getEmail().equalsIgnoreCase(email)) {
            throw new SecurityException("Accès interdit à cette course.");
        }
    }

    private PropositionResponseDTO mapToDTO(PropositionChauffeur proposition) {
        Chauffeur chauffeur = proposition.getChauffeur();
        return new PropositionResponseDTO(
                proposition.getId(), proposition.getCourse().getId(), chauffeur.getId(),
                chauffeur.getUtilisateur().getPrenom(),
                chauffeur.getNoteMoyenne() == null ? 0.0 : chauffeur.getNoteMoyenne().doubleValue(),
                proposition.getPrixPropose(), proposition.getDistanceChauffeurDepart(),
                proposition.getTempsEstimeMinutes(), proposition.getMessage(),
                proposition.getStatutProposition().name(), proposition.getDateCreation());
    }
}
