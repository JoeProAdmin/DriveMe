package com.driveme.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CourseCreateDTO {

    @NotNull(message = "chauffeurId est obligatoire")
    private Long chauffeurId;

    @NotNull(message = "passagerId est obligatoire")
    private Long passagerId;

    @NotBlank(message = "adresseDepart est obligatoire")
    private String adresseDepart;

    @NotBlank(message = "adresseArrivee est obligatoire")
    private String adresseArrivee;

    @NotNull(message = "dateDemande est obligatoire")
    private LocalDateTime dateDemande;

    @NotNull(message = "dateDebut est obligatoire")
    private LocalDateTime dateDebut;

    @NotNull(message = "dateFin est obligatoire")
    private LocalDateTime dateFin;

    @NotNull(message = "prix est obligatoire")
    @Positive(message = "prix doit être positif")
    private BigDecimal prix;

    @NotBlank(message = "statut est obligatoire")
    private String statut;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getChauffeurId() {
        return chauffeurId;
    }

    public void setChauffeurId(Long chauffeurId) {
        this.chauffeurId = chauffeurId;
    }

    public Long getPassagerId() {
        return passagerId;
    }

    public void setPassagerId(Long passagerId) {
        this.passagerId = passagerId;
    }

    public String getAdresseDepart() {
        return adresseDepart;
    }

    public void setAdresseDepart(String adresseDepart) {
        this.adresseDepart = adresseDepart;
    }

    public String getAdresseArrivee() {
        return adresseArrivee;
    }

    public void setAdresseArrivee(String adresseArrivee) {
        this.adresseArrivee = adresseArrivee;
    }

    public LocalDateTime getDateDemande() {
        return dateDemande;
    }

    public void setDateDemande(LocalDateTime dateDemande) {
        this.dateDemande = dateDemande;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public BigDecimal getPrix() {
        return prix;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
}
