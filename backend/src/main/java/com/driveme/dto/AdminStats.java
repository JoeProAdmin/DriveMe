package com.driveme.dto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AdminStats {
    private long totalChauffeurs;
    private long totalPassagers;
    private long totalCourses;
    private long coursesEnAttente;
    private long coursesActives;
    private long coursesTerminees;
    private long coursesAnnulees;
    private long totalPaiements;
    private long paiementsPayes;
    private BigDecimal montantPaiementsPayes;
    private BigDecimal soldeCreditsChauffeurs;
    private BigDecimal commissionsDriveMe;
    private BigDecimal rechargesValidees;
    private long rechargesEnAttente;
}
