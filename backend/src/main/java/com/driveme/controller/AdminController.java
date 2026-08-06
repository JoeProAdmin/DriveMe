package com.driveme.controller;

import com.driveme.dto.AdminStats;
import com.driveme.entity.PaiementStatut;
import com.driveme.service.ChauffeurService;
import com.driveme.service.CourseService;
import com.driveme.service.PaiementService;
import com.driveme.service.PassagerService;
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
    private final CourseService courseService;
    private final PaiementService paiementService;

    @GetMapping("/stats")
    public AdminStats getStats() {
        AdminStats stats = new AdminStats();
        stats.setTotalChauffeurs(chauffeurService.count());
        stats.setTotalPassagers(passagerService.count());
        stats.setTotalCourses(courseService.count());
        stats.setTotalPaiements(paiementService.count());
        stats.setPaiementsPayes(paiementService.countByStatut(PaiementStatut.PAYE));
        stats.setMontantPaiementsPayes(paiementService.sumMontantByStatut(PaiementStatut.PAYE));
        stats.setSoldeCreditsChauffeurs(chauffeurService.sumSoldeCredit());
        return stats;
    }
}
