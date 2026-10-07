package com.driveme.service.impl;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.CategorieService;
import com.driveme.entity.Course;
import com.driveme.entity.CourseStatus;
import com.driveme.entity.DriverType;
import com.driveme.entity.Passager;
import com.driveme.entity.PeriodeCourse;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.AvisRepository;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.PassagerRepository;
import com.driveme.repository.PropositionChauffeurRepository;
import com.driveme.service.CourseService;
import com.driveme.service.PortefeuilleService;
import com.driveme.repository.UtilisateurRepository;
import com.driveme.entity.Role;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final PassagerRepository passagerRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final AvisRepository avisRepository;
    private final PortefeuilleService portefeuilleService;
    private final UtilisateurRepository utilisateurRepository;
    private final PropositionChauffeurRepository propositionChauffeurRepository;

    public CourseServiceImpl(
            CourseRepository courseRepository,
            PassagerRepository passagerRepository,
            ChauffeurRepository chauffeurRepository,
            AvisRepository avisRepository,
            PortefeuilleService portefeuilleService,
            UtilisateurRepository utilisateurRepository,
            PropositionChauffeurRepository propositionChauffeurRepository
    ) {
        this.courseRepository = courseRepository;
        this.passagerRepository = passagerRepository;
        this.chauffeurRepository = chauffeurRepository;
        this.avisRepository = avisRepository;
        this.portefeuilleService = portefeuilleService;
        this.utilisateurRepository = utilisateurRepository;
        this.propositionChauffeurRepository = propositionChauffeurRepository;
    }

    @Override
    public long count() {
        return courseRepository.count();
    }

    @Override
    public CourseResponseDTO createCourse(
            CourseCreateDTO dto,
            String authenticatedIdentifier
    ) {

        Passager passager = passagerRepository
                .findByUtilisateur_EmailOrUtilisateur_Telephone(
                        authenticatedIdentifier,
                        authenticatedIdentifier
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Aucun profil passager n'est associé au compte authentifié"
                        )
                );

        Course course = new Course();

        course.setPassager(passager);
        course.setAdresseDepart(dto.getAdresseDepart().trim());
        course.setAdresseArrivee(dto.getAdresseArrivee().trim());
        course.setPrix(dto.getPrix());
        course.setLatitudeDepart(dto.getLatitudeDepart());
        course.setLongitudeDepart(dto.getLongitudeDepart());
        course.setLatitudeArrivee(dto.getLatitudeArrivee());
        course.setLongitudeArrivee(dto.getLongitudeArrivee());
        course.setDistanceKm(dto.getDistanceKm());
        course.setDureeEstimeeMinutes(dto.getDureeEstimeeMinutes());
        course.setPrixEstime(dto.getPrixEstime());
        course.setCategorieService(dto.getCategorieService() == null
                ? CategorieService.TOUS_SERVICES
                : dto.getCategorieService());
        course.setNombrePassagers(dto.getNombrePassagers() == null
                ? 1
                : dto.getNombrePassagers());
        LocalDateTime dateHeureDepart = dto.getDateHeureDepart() == null
                ? LocalDateTime.now()
                : dto.getDateHeureDepart();
        course.setDateHeureDepart(dateHeureDepart);
        course.setPeriodeCourse(determinerPeriode(dateHeureDepart.toLocalTime()));
        course.setBagagesImportants(dto.isBagagesImportants());
        course.setVehiculeAdapte(dto.isVehiculeAdapte());
        course.setStatut(CourseStatus.EN_ATTENTE);

        Course saved = courseRepository.save(course);

        return mapToDTO(saved);
    }

    @Override
    public List<CourseResponseDTO> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponseDTO> getCoursesByChauffeur(Long chauffeurId) {

        return courseRepository.findByChauffeurId(chauffeurId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponseDTO> getCoursesByPassager(Long passagerId) {

        return courseRepository.findByPassagerId(passagerId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponseDTO> getCurrentPassagerCourses(
            String authenticatedIdentifier
    ) {

        Passager authenticatedPassager = passagerRepository
                .findByUtilisateur_EmailOrUtilisateur_Telephone(
                        authenticatedIdentifier,
                        authenticatedIdentifier
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Aucun profil passager n'est associé au compte authentifié"
                        )
                );

        return courseRepository.findByPassagerId(authenticatedPassager.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponseDTO> getCurrentChauffeurCourses(
            String authenticatedIdentifier
    ) {

        Chauffeur authenticatedChauffeur = chauffeurRepository
                .findByUtilisateur_EmailOrUtilisateur_Telephone(
                        authenticatedIdentifier,
                        authenticatedIdentifier
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Aucun profil chauffeur n'est associé au compte authentifié"
                        )
                );

        return courseRepository.findByChauffeurId(authenticatedChauffeur.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponseDTO> getCoursesEnAttente(String authenticatedIdentifier) {

        var user = utilisateurRepository.findByEmailIgnoreCase(authenticatedIdentifier)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        Chauffeur chauffeur = null;
        if (user.getRole() == Role.CHAUFFEUR) {
            chauffeur = chauffeurRepository.findByUtilisateurEmail(authenticatedIdentifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Chauffeur introuvable"));
            if (!chauffeur.isDisponible() || chauffeur.getSoldeCredit() == null || chauffeur.getSoldeCredit().signum() <= 0) {
                return List.of();
            }
        }

        final Chauffeur chauffeurConnecte = chauffeur;

        return courseRepository.findAll()
                .stream()
                .filter(course ->
                        course.getStatut() == CourseStatus.EN_ATTENTE
                                || course.getStatut() == CourseStatus.PROPOSITION_RECUE
                )
                .filter(course -> chauffeurConnecte == null
                        || categorieCompatible(course.getCategorieService(), chauffeurConnecte.getTypeChauffeur()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private boolean categorieCompatible(CategorieService categorieService, DriverType typeChauffeur) {
        if (categorieService == null || categorieService == CategorieService.TOUS_SERVICES) {
            return true;
        }
        return typeChauffeur != null && categorieService.name().equals(typeChauffeur.name());
    }

    @Override
    @Transactional
    public CourseResponseDTO updateChauffeurStatus(
            Long courseId,
            String status,
            String authenticatedIdentifier
    ) {

        Chauffeur authenticatedChauffeur = chauffeurRepository
                .findByUtilisateur_EmailOrUtilisateur_Telephone(
                        authenticatedIdentifier,
                        authenticatedIdentifier
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Aucun profil chauffeur n'est associé au compte authentifié"
                        )
                );

        Course course = courseRepository.findByIdForUpdate(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable")
                );

        if (course.getChauffeur() == null) {
            throw new IllegalStateException(
                    "Aucun chauffeur n'est attribué à cette course."
            );
        }

        if (!course.getChauffeur().getId().equals(authenticatedChauffeur.getId())) {
            throw new AccessDeniedException(
                    "Cette course est attribuée à un autre chauffeur."
            );
        }

        final CourseStatus requestedStatus;

        try {
            requestedStatus = CourseStatus.valueOf(
                    status.trim().toUpperCase()
            );
        } catch (IllegalArgumentException | NullPointerException exception) {
            throw new IllegalArgumentException(
                    "Statut de course invalide."
            );
        }

        CourseStatus expectedStatus = getExpectedChauffeurStatus(
                course.getStatut()
        );

        if (requestedStatus != expectedStatus) {
            throw new IllegalStateException(
                    "Transition interdite : la course au statut "
                            + course.getStatut().name()
                            + " doit passer au statut "
                            + expectedStatus.name()
                            + "."
            );
        }

        if (requestedStatus == CourseStatus.TERMINEE) {
            portefeuilleService.debiterCommissionCourse(course.getId());
        }
        course.setStatut(requestedStatus);

        Course updated = courseRepository.save(course);

        return mapToDTO(updated);
    }

    private CourseStatus getExpectedChauffeurStatus(
            CourseStatus currentStatus
    ) {

        return switch (currentStatus) {
            case ACCEPTEE -> CourseStatus.CHAUFFEUR_EN_ROUTE;
            case CHAUFFEUR_EN_ROUTE -> CourseStatus.CHAUFFEUR_ARRIVE;
            case CHAUFFEUR_ARRIVE -> CourseStatus.EN_COURS;
            case EN_COURS -> CourseStatus.TERMINEE;
            default -> throw new IllegalStateException(
                    "Le chauffeur ne peut pas faire progresser une course au statut "
                            + currentStatus.name()
                            + "."
            );
        };
    }

    @Override
    @Transactional
    public CourseResponseDTO cancelCurrentPassengerCourse(Long courseId, String email) {
        Course course = courseRepository.findByIdForUpdate(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course introuvable"));

        String ownerEmail = course.getPassager().getUtilisateur().getEmail();
        if (email == null || ownerEmail == null || !ownerEmail.equalsIgnoreCase(email)) {
            throw new AccessDeniedException(
                    "Vous ne pouvez annuler que vos propres demandes.");
        }

        if (course.getStatut() == CourseStatus.ANNULEE) {
            return mapToDTO(course);
        }

        if (course.getChauffeur() != null
                || (course.getStatut() != CourseStatus.EN_ATTENTE
                && course.getStatut() != CourseStatus.PROPOSITION_RECUE)) {
            throw new com.driveme.exception.BusinessRuleException(
                    "Seule une demande sans chauffeur attribue peut etre annulee ici. "
                            + "Pour une course deja acceptee, contactez le support.");
        }

        if (course.getPaiement() != null) {
            throw new com.driveme.exception.BusinessRuleException(
                    "Cette demande comporte un paiement. Contactez le support.");
        }

        course.setStatut(CourseStatus.ANNULEE);
        return mapToDTO(courseRepository.save(course));
    }

    @Override
    public CourseResponseDTO updateStatus(Long id, String status) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable")
                );

        final CourseStatus newStatus;

        try {
            newStatus = CourseStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException exception) {
            throw new IllegalArgumentException(
                    "Statut de course invalide."
            );
        }

        if (newStatus == CourseStatus.ACCEPTEE
                && course.getChauffeur() == null) {

            throw new IllegalStateException(
                    "Une course ne peut pas être acceptée sans chauffeur. "
                            + "Le passager doit sélectionner une proposition de chauffeur."
            );
        }

        if (newStatus == CourseStatus.TERMINEE) {

            if (course.getChauffeur() == null) {
                throw new IllegalStateException(
                        "Une course sans chauffeur ne peut pas être terminée."
                );
            }

            if (course.getStatut() != CourseStatus.EN_COURS) {
                throw new IllegalStateException(
                        "Seule une course en cours peut être terminée."
                );
            }
        }

        if (newStatus == CourseStatus.TERMINEE) {
            portefeuilleService.debiterCommissionCourse(course.getId());
        }
        course.setStatut(newStatus);

        Course updated = courseRepository.save(course);

        return mapToDTO(updated);
    }

    private CourseResponseDTO mapToDTO(Course course) {

        String chauffeurNom = null;

        if (course.getChauffeur() != null) {
            chauffeurNom = course.getChauffeur()
                    .getUtilisateur()
                    .getNom();
        }

        String paiementStatut = null;
        java.math.BigDecimal paiementMontant = null;
        String paiementMethode = null;
        LocalDateTime paiementDate = null;

        if (course.getPaiement() != null
                && course.getPaiement().getStatut() != null) {
            paiementStatut = course.getPaiement()
                    .getStatut()
                    .name();
            paiementMontant = course.getPaiement().getMontant();
            paiementMethode = course.getPaiement().getMethode() == null
                    ? null
                    : course.getPaiement().getMethode().name();
            paiementDate = course.getPaiement().getDatePaiement();
        }

        boolean avisDepose = avisRepository.existsByCourseId(
                course.getId()
        );

        return new CourseResponseDTO(
                course.getId(),
                course.getPassager().getId(),
                course.getChauffeur() == null ? null : course.getChauffeur().getId(),
                course.getPassager().getUtilisateur().getNom(),
                chauffeurNom,
                course.getAdresseDepart(),
                course.getAdresseArrivee(),
                course.getPrix(),
                course.getPrixInitial(),
                course.getPrixFinal(),
                course.getStatut().name(),
                course.getDateCreation(),
                course.getLatitudeDepart(),
                course.getLongitudeDepart(),
                course.getLatitudeArrivee(),
                course.getLongitudeArrivee(),
                course.getDistanceKm(),
                course.getDureeEstimeeMinutes(),
                course.getPrixEstime(),
                course.getCategorieService().name(),
                course.getNombrePassagers(),
                course.getDateHeureDepart(),
                course.getPeriodeCourse().name(),
                course.isBagagesImportants(),
                course.isVehiculeAdapte(),
                paiementStatut,
                paiementMontant,
                paiementMethode,
                paiementDate,
                Math.toIntExact(propositionChauffeurRepository.countByCourseId(course.getId())),
                avisDepose
        );
    }

    private PeriodeCourse determinerPeriode(LocalTime heureDepart) {
        LocalTime debutNuit = LocalTime.of(20, 0);
        LocalTime finNuit = LocalTime.of(6, 0);

        return !heureDepart.isBefore(debutNuit) || heureDepart.isBefore(finNuit)
                ? PeriodeCourse.NUIT
                : PeriodeCourse.JOUR;
    }
}
