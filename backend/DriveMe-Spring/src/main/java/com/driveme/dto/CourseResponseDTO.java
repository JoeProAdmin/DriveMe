package com.driveme.dto;

import java.time.LocalDateTime;

public class CourseResponseDTO {

    private Long id;
    private String passagerNom;
    private String chauffeurNom;
    private String adresseDepart;
    private String adresseArrivee;
    private Double prix;
    private String statut;
    private LocalDateTime dateCreation;

    public CourseResponseDTO() {}

    public CourseResponseDTO(Long id, String passagerNom, String chauffeurNom,
                             String adresseDepart, String adresseArrivee,
                             Double prix, String statut, LocalDateTime dateCreation) {
        this.id = id;
        this.passagerNom = passagerNom;
        this.chauffeurNom = chauffeurNom;
        this.adresseDepart = adresseDepart;
        this.adresseArrivee = adresseArrivee;
        this.prix = prix;
        this.statut = statut;
        this.dateCreation = dateCreation;
    }

    // getters/setters
    public Long getId() { return id; }
    public String getPassagerNom() { return passagerNom; }
    public String getChauffeurNom() { return chauffeurNom; }
    public String getAdresseDepart() { return adresseDepart; }
    public String getAdresseArrivee() { return adresseArrivee; }
    public Double getPrix() { return prix; }
    public String getStatut() { return statut; }
    public LocalDateTime getDateCreation() { return dateCreation; }

    public void setId(Long id) { this.id = id; }
    public void setPassagerNom(String passagerNom) { this.passagerNom = passagerNom; }
    public void setChauffeurNom(String chauffeurNom) { this.chauffeurNom = chauffeurNom; }
    public void setAdresseDepart(String adresseDepart) { this.adresseDepart = adresseDepart; }
    public void setAdresseArrivee(String adresseArrivee) { this.adresseArrivee = adresseArrivee; }
    public void setPrix(Double prix) { this.prix = prix; }
    public void setStatut(String statut) { this.statut = statut; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
}