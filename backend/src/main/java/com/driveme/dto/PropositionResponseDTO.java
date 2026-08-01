package com.driveme.dto;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public class PropositionResponseDTO {

    private Long id;

    private Long courseId;

    private Long chauffeurId;

    private String chauffeurNom;

    private Double noteMoyenne;

    private BigDecimal prixPropose;

    private Double distanceChauffeurDepart;

    private Integer tempsEstimeMinutes;

    private String message;

    private String statut;

    private LocalDateTime dateCreation;

    public PropositionResponseDTO() {
    }

    public PropositionResponseDTO(
            Long id,
            Long courseId,
            Long chauffeurId,
            String chauffeurNom,
            Double noteMoyenne,
            BigDecimal prixPropose,
            Double distanceChauffeurDepart,
            Integer tempsEstimeMinutes,
            String message,
            String statut,
            LocalDateTime dateCreation
    ) {

        this.id = id;
        this.courseId = courseId;
        this.chauffeurId = chauffeurId;
        this.chauffeurNom = chauffeurNom;
        this.noteMoyenne = noteMoyenne;
        this.prixPropose = prixPropose;
        this.distanceChauffeurDepart = distanceChauffeurDepart;
        this.tempsEstimeMinutes = tempsEstimeMinutes;
        this.message = message;
        this.statut = statut;
        this.dateCreation = dateCreation;

    }

    public Long getId() { return id; }

    public Long getCourseId() { return courseId; }

    public Long getChauffeurId() { return chauffeurId; }

    public String getChauffeurNom() { return chauffeurNom; }

    public Double getNoteMoyenne() { return noteMoyenne; }

    public BigDecimal getPrixPropose() { return prixPropose; }

    public Double getDistanceChauffeurDepart() { return distanceChauffeurDepart; }

    public Integer getTempsEstimeMinutes() { return tempsEstimeMinutes; }

    public String getMessage() { return message; }

    public String getStatut() { return statut; }

    public LocalDateTime getDateCreation() { return dateCreation; }

    public void setId(Long id) { this.id = id; }

    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public void setChauffeurId(Long chauffeurId) { this.chauffeurId = chauffeurId; }

    public void setChauffeurNom(String chauffeurNom) { this.chauffeurNom = chauffeurNom; }

    public void setNoteMoyenne(Double noteMoyenne) { this.noteMoyenne = noteMoyenne; }

    public void setPrixPropose(BigDecimal prixPropose) { this.prixPropose = prixPropose; }

    public void setDistanceChauffeurDepart(Double distanceChauffeurDepart) { this.distanceChauffeurDepart = distanceChauffeurDepart; }

    public void setTempsEstimeMinutes(Integer tempsEstimeMinutes) { this.tempsEstimeMinutes = tempsEstimeMinutes; }

    public void setMessage(String message) { this.message = message; }

    public void setStatut(String statut) { this.statut = statut; }

    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

}
