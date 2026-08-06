package com.driveme.dto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AdminStats {
    private long totalChauffeurs;
    private long totalPassagers;
    private long totalCourses;
    private long totalPaiements;
    private long paiementsPayes;
    private BigDecimal montantPaiementsPayes;
    private BigDecimal soldeCreditsChauffeurs;
}
