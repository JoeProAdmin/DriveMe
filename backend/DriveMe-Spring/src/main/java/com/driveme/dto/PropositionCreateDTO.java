package com.driveme.dto;

import jakarta.validation.constraints.NotNull;

public class PropositionCreateDTO {

    @NotNull
    private Long courseId;

    @NotNull
    private Long chauffeurId;

    @NotNull
    private Double prixPropose;

    private Double distanceChauffeurDepart;

    private Integer tempsEstimeMinutes;

    private String message;

    public PropositionCreateDTO() {
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getChauffeurId() {
        return chauffeurId;
    }

    public void setChauffeurId(Long chauffeurId) {
        this.chauffeurId = chauffeurId;
    }

    public Double getPrixPropose() {
        return prixPropose;
    }

    public void setPrixPropose(Double prixPropose) {
        this.prixPropose = prixPropose;
    }

    public Double getDistanceChauffeurDepart() {
        return distanceChauffeurDepart;
    }

    public void setDistanceChauffeurDepart(Double distanceChauffeurDepart) {
        this.distanceChauffeurDepart = distanceChauffeurDepart;
    }

    public Integer getTempsEstimeMinutes() {
        return tempsEstimeMinutes;
    }

    public void setTempsEstimeMinutes(Integer tempsEstimeMinutes) {
        this.tempsEstimeMinutes = tempsEstimeMinutes;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}