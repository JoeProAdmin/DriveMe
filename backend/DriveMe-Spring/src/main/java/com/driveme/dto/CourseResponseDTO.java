package com.driveme.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CourseResponseDTO {

    private Long id;
    private Long chauffeurId;
    private Long passagerId;
    private String adresseDepart;
    private String adresseArrivee;
    private LocalDateTime dateDemande;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private BigDecimal prix;
    private String statut;

    // ✅ CONSTRUCTEUR VIDE (IMPORTANT)
    public CourseResponseDTO() {
    }

    // ✅ CONSTRUCTEUR COMPLET
    public CourseResponseDTO(Long id,
                             Long chauffeurId,
                             Long passagerId,
                             String adresseDepart,
                             String adresseArrivee,
                             LocalDateTime dateDemande,
                             LocalDateTime dateDebut,
                             LocalDateTime dateFin,
                             BigDecimal prix,
                             String statut) {
        this.id = id;
        this.chauffeurId = chauffeurId;
        this.passagerId = passagerId;
        this.adresseDepart = adresseDepart;
        this.adresseArrivee = adresseArrivee;
        this.dateDemande = dateDemande;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.prix = prix;
        this.statut = statut;
    }

    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getChauffeurId() { return chauffeurId; }
    public void setChauffeurId(Long chauffeurId) { this.chauffeurId = chauffeurId; }

    public Long getPassagerId() { return passagerId; }
    public void setPassagerId(Long passagerId) { this.passagerId = passagerId; }

    public String getAdresseDepart() { return adresseDepart; }
    public void setAdresseDepart(String adresseDepart) { this.adresseDepart = adresseDepart; }

    public String getAdresseArrivee() { return adresseArrivee; }
    public void setAdresseArrivee(String adresseArrivee) { this.adresseArrivee = adresseArrivee; }

    public LocalDateTime getDateDemande() { return dateDemande; }
    public void setDateDemande(LocalDateTime dateDemande) { this.dateDemande = dateDemande; }

    public LocalDateTime getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }

    public LocalDateTime getDateFin() { return dateFin; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }

    public BigDecimal getPrix() { return prix; }
    public void setPrix(BigDecimal prix) { this.prix = prix; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}
