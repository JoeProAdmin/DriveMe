package com.driveme.dto;

import java.time.LocalDateTime;

public class PaiementResponseDTO {

    private Long id;
    private Long courseId;
    private Double montant;
    private String methode;
    private String statut;
    private LocalDateTime datePaiement;

    public PaiementResponseDTO() {
    }

    public PaiementResponseDTO(
            Long id,
            Long courseId,
            Double montant,
            String methode,
            String statut,
            LocalDateTime datePaiement
    ) {
        this.id = id;
        this.courseId = courseId;
        this.montant = montant;
        this.methode = methode;
        this.statut = statut;
        this.datePaiement = datePaiement;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Double getMontant() {
        return montant;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public String getMethode() {
        return methode;
    }

    public void setMethode(String methode) {
        this.methode = methode;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDateTime getDatePaiement() {
        return datePaiement;
    }

    public void setDatePaiement(LocalDateTime datePaiement) {
        this.datePaiement = datePaiement;
    }
}
