package com.driveme.dto;
import lombok.Data;

@Data
public class AdminStats {
    private long totalChauffeurs;
    private long totalPassagers;
    private long totalCourses;
    private long totalPaiements;
}