package com.driveme.service.impl;

import com.driveme.dto.PropositionCreateDTO;
import com.driveme.dto.PropositionResponseDTO;
import com.driveme.entity.*;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.PropositionChauffeurRepository;
import com.driveme.service.PropositionChauffeurService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PropositionChauffeurServiceImpl
        implements PropositionChauffeurService {

    private final PropositionChauffeurRepository propositionRepository;
    private final CourseRepository courseRepository;
    private final ChauffeurRepository chauffeurRepository;

    public PropositionChauffeurServiceImpl(
            PropositionChauffeurRepository propositionRepository,
            CourseRepository courseRepository,
            ChauffeurRepository chauffeurRepository
    ) {

        this.propositionRepository = propositionRepository;
        this.courseRepository = courseRepository;
        this.chauffeurRepository = chauffeurRepository;

    }

    @Override
    public PropositionResponseDTO creerProposition(
            PropositionCreateDTO dto
    ) {

        Course course = courseRepository.findById(
                dto.getCourseId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Course introuvable"
                )
        );

        Chauffeur chauffeur =
                chauffeurRepository.findById(
                        dto.getChauffeurId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Chauffeur introuvable"
                        )
                );

        PropositionChauffeur proposition =
                new PropositionChauffeur();

        proposition.setCourse(course);

        proposition.setChauffeur(chauffeur);

        proposition.setPrixPropose(
                dto.getPrixPropose()
        );

        proposition.setDistanceChauffeurDepart(
                dto.getDistanceChauffeurDepart()
        );

        proposition.setTempsEstimeMinutes(
                dto.getTempsEstimeMinutes()
        );

        proposition.setMessage(
                dto.getMessage()
        );

        proposition.setStatutProposition(
                PropositionStatus.EN_ATTENTE
        );

        PropositionChauffeur saved =
                propositionRepository.save(
                        proposition
                );

        return mapToDTO(saved);

    }

    private PropositionResponseDTO mapToDTO(
            PropositionChauffeur proposition
    ) {

        Chauffeur chauffeur =
                proposition.getChauffeur();

        return new PropositionResponseDTO(

                proposition.getId(),

                proposition.getCourse().getId(),

                chauffeur.getId(),

                chauffeur.getUtilisateur().getNom(),
                0.0,

                proposition.getPrixPropose(),

                proposition.getDistanceChauffeurDepart(),

                proposition.getTempsEstimeMinutes(),

                proposition.getMessage(),

                proposition.getStatutProposition().name(),

                proposition.getDateCreation()

        );

    }

    @Override
    public List<PropositionResponseDTO> getPropositionsByCourse(
            Long courseId
    ) {

        courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course introuvable"
                        )
                );

        return propositionRepository
                .findByCourseIdOrderByPrixProposeAsc(courseId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

    }

    @Override
    public List<PropositionResponseDTO> getPropositionsByChauffeur(
            Long chauffeurId
    ) {

        chauffeurRepository.findById(chauffeurId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Chauffeur introuvable"
                        )
                );

        return propositionRepository
                .findByChauffeurId(chauffeurId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

    }

    @Override
    public PropositionResponseDTO choisirProposition(
            Long courseId,
            Long propositionId
    ) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course introuvable"
                        )
                );

        if (course.getStatut() != CourseStatus.EN_ATTENTE) {
            throw new IllegalStateException(
                    "Cette course n'est plus disponible."
            );
        }

        PropositionChauffeur propositionChoisie =
                propositionRepository.findById(propositionId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Proposition introuvable"
                                )
                        );

        if (!propositionChoisie.getCourse().getId().equals(courseId)) {
            throw new IllegalStateException(
                    "Cette proposition ne correspond pas à la course demandée."
            );
        }

        if (propositionChoisie.getStatutProposition() != PropositionStatus.EN_ATTENTE) {
            throw new IllegalStateException(
                    "Cette proposition n'est plus disponible."
            );
        }

        Chauffeur chauffeurChoisi =
                propositionChoisie.getChauffeur();

        course.setChauffeur(chauffeurChoisi);
        course.setStatut(CourseStatus.ACCEPTEE);
        course.setPrixFinal(propositionChoisie.getPrixPropose());
        course.setPrix(propositionChoisie.getPrixPropose());

        propositionChoisie.setStatutProposition(
                PropositionStatus.ACCEPTEE
        );

        List<PropositionChauffeur> autresPropositions =
                propositionRepository.findByCourseId(courseId);

        for (PropositionChauffeur proposition : autresPropositions) {

            if (!proposition.getId().equals(propositionId)) {
                proposition.setStatutProposition(
                        PropositionStatus.REFUSEE
                );
            }

        }

        courseRepository.save(course);
        propositionRepository.saveAll(autresPropositions);

        return mapToDTO(propositionChoisie);
    }

}