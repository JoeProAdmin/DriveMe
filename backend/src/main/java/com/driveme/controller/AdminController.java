package com.driveme.controller;

import com.driveme.dto.AdminStats;
import com.driveme.entity.CourseStatus;
import com.driveme.repository.CourseRepository;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import com.driveme.entity.PaiementStatut;
import com.driveme.service.ChauffeurService;
import com.driveme.service.PaiementService;
import com.driveme.service.PassagerService;
import com.driveme.repository.TransactionPortefeuilleRepository;
import com.driveme.entity.PortefeuilleTransactionType;
import com.driveme.entity.PortefeuilleTransactionStatut;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ChauffeurService chauffeurService;
    private final PassagerService passagerService;
    private final CourseRepository courseRepository;
    private final PaiementService paiementService;
    private final TransactionPortefeuilleRepository transactionPortefeuilleRepository;

    @GetMapping("/stats")
    @Transactional(readOnly = true)
    public AdminStats getStats() {
        AdminStats stats = new AdminStats();
        stats.setTotalChauffeurs(chauffeurService.count());
        stats.setTotalPassagers(passagerService.count());
        stats.setTotalCourses(courseRepository.count());
        stats.setCoursesEnAttente(courseRepository.countByStatutIn(
            List.of(CourseStatus.EN_ATTENTE, CourseStatus.PROPOSITION_RECUE)));
        stats.setCoursesActives(courseRepository.countByStatutIn(
            List.of(CourseStatus.ACCEPTEE, CourseStatus.CHAUFFEUR_EN_ROUTE,
                CourseStatus.CHAUFFEUR_ARRIVE, CourseStatus.EN_COURS)));
        stats.setCoursesTerminees(courseRepository.countByStatutIn(
            List.of(CourseStatus.TERMINEE)));
        stats.setCoursesAnnulees(courseRepository.countByStatutIn(
            List.of(CourseStatus.ANNULEE)));
        stats.setTotalPaiements(paiementService.count());
        stats.setPaiementsPayes(paiementService.countByStatut(PaiementStatut.PAYE));
        stats.setMontantPaiementsPayes(paiementService.sumMontantByStatut(PaiementStatut.PAYE));
        stats.setSoldeCreditsChauffeurs(chauffeurService.sumSoldeCredit());
        stats.setCommissionsDriveMe(transactionPortefeuilleRepository.sumByTypeAndStatut(PortefeuilleTransactionType.COMMISSION_COURSE, PortefeuilleTransactionStatut.VALIDEE));
        stats.setRechargesValidees(transactionPortefeuilleRepository.sumByTypeAndStatut(PortefeuilleTransactionType.RECHARGE, PortefeuilleTransactionStatut.VALIDEE));
        stats.setRechargesEnAttente(transactionPortefeuilleRepository.findByStatutOrderByDateCreationAsc(PortefeuilleTransactionStatut.EN_ATTENTE).size());
        return stats;
    }
}
