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

    public CourseResponseDTO(
            Long id,
            Long chauffeurId,
            Long passagerId,
            String adresseDepart,
            String adresseArrivee,
            LocalDateTime dateDemande,
            LocalDateTime dateDebut,
            LocalDateTime dateFin,
            BigDecimal prix,
            String statut
    ) {
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

    public Long getId() { return id; }
    public Long getChauffeurId() { return chauffeurId; }
    public Long getPassagerId() { return passagerId; }
    public String getAdresseDepart() { return adresseDepart; }
    public String getAdresseArrivee() { return adresseArrivee; }
    public LocalDateTime getDateDemande() { return dateDemande; }
    public LocalDateTime getDateDebut() { return dateDebut; }
    public LocalDateTime getDateFin() { return dateFin; }
    public BigDecimal getPrix() { return prix; }
    public String getStatut() { return statut; }
}
