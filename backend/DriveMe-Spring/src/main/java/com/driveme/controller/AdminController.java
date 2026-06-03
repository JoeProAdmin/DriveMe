package com.driveme.controller;

import com.driveme.dto.AdminStats;
import com.driveme.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
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
        return stats;
    }
}