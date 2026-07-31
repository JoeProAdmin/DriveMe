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
    private Double latitudeDepart;
    private Double longitudeDepart;
    private Double latitudeArrivee;
    private Double longitudeArrivee;
    private Double distanceKm;
    private Integer dureeEstimeeMinutes;
    private Double prixEstime;

    public CourseResponseDTO() {}

    public CourseResponseDTO(Long id, String passagerNom, String chauffeurNom,
                             String adresseDepart, String adresseArrivee, Double prix,
                             String statut, LocalDateTime dateCreation,
                             Double latitudeDepart, Double longitudeDepart,
                             Double latitudeArrivee, Double longitudeArrivee,
                             Double distanceKm, Integer dureeEstimeeMinutes, Double prixEstime) {
        this.id = id;
        this.passagerNom = passagerNom;
        this.chauffeurNom = chauffeurNom;
        this.adresseDepart = adresseDepart;
        this.adresseArrivee = adresseArrivee;
        this.prix = prix;
        this.statut = statut;
        this.dateCreation = dateCreation;
        this.latitudeDepart = latitudeDepart;
        this.longitudeDepart = longitudeDepart;
        this.latitudeArrivee = latitudeArrivee;
        this.longitudeArrivee = longitudeArrivee;
        this.distanceKm = distanceKm;
        this.dureeEstimeeMinutes = dureeEstimeeMinutes;
        this.prixEstime = prixEstime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPassagerNom() { return passagerNom; }
    public void setPassagerNom(String passagerNom) { this.passagerNom = passagerNom; }
    public String getChauffeurNom() { return chauffeurNom; }
    public void setChauffeurNom(String chauffeurNom) { this.chauffeurNom = chauffeurNom; }
    public String getAdresseDepart() { return adresseDepart; }
    public void setAdresseDepart(String adresseDepart) { this.adresseDepart = adresseDepart; }
    public String getAdresseArrivee() { return adresseArrivee; }
    public void setAdresseArrivee(String adresseArrivee) { this.adresseArrivee = adresseArrivee; }
    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
    public Double getLatitudeDepart() { return latitudeDepart; }
    public void setLatitudeDepart(Double latitudeDepart) { this.latitudeDepart = latitudeDepart; }
    public Double getLongitudeDepart() { return longitudeDepart; }
    public void setLongitudeDepart(Double longitudeDepart) { this.longitudeDepart = longitudeDepart; }
    public Double getLatitudeArrivee() { return latitudeArrivee; }
    public void setLatitudeArrivee(Double latitudeArrivee) { this.latitudeArrivee = latitudeArrivee; }
    public Double getLongitudeArrivee() { return longitudeArrivee; }
    public void setLongitudeArrivee(Double longitudeArrivee) { this.longitudeArrivee = longitudeArrivee; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public Integer getDureeEstimeeMinutes() { return dureeEstimeeMinutes; }
    public void setDureeEstimeeMinutes(Integer dureeEstimeeMinutes) { this.dureeEstimeeMinutes = dureeEstimeeMinutes; }
    public Double getPrixEstime() { return prixEstime; }
    public void setPrixEstime(Double prixEstime) { this.prixEstime = prixEstime; }
}
