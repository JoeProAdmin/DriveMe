package com.driveme.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CourseResponseDTO {

    private Long id;
    private String passagerNom;
    private String chauffeurNom;
    private String adresseDepart;
    private String adresseArrivee;
    private BigDecimal prix;
    private String statut;
    private LocalDateTime dateCreation;
    private Double latitudeDepart;
    private Double longitudeDepart;
    private Double latitudeArrivee;
    private Double longitudeArrivee;
    private Double distanceKm;
    private Integer dureeEstimeeMinutes;
    private BigDecimal prixEstime;
    private String categorieService;
    private Integer nombrePassagers;
    private LocalDateTime dateHeureDepart;
    private String periodeCourse;
    private boolean bagagesImportants;
    private boolean vehiculeAdapte;

    // RC3.4 Angular : informations nécessaires pour afficher l’avis
    private String paiementStatut;
    private boolean avisDepose;

    public CourseResponseDTO() {
    }

    public CourseResponseDTO(
            Long id,
            String passagerNom,
            String chauffeurNom,
            String adresseDepart,
            String adresseArrivee,
            BigDecimal prix,
            String statut,
            LocalDateTime dateCreation,
            Double latitudeDepart,
            Double longitudeDepart,
            Double latitudeArrivee,
            Double longitudeArrivee,
            Double distanceKm,
            Integer dureeEstimeeMinutes,
            BigDecimal prixEstime,
            String categorieService,
            Integer nombrePassagers,
            LocalDateTime dateHeureDepart,
            String periodeCourse,
            boolean bagagesImportants,
            boolean vehiculeAdapte,
            String paiementStatut,
            boolean avisDepose
    ) {
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
        this.categorieService = categorieService;
        this.nombrePassagers = nombrePassagers;
        this.dateHeureDepart = dateHeureDepart;
        this.periodeCourse = periodeCourse;
        this.bagagesImportants = bagagesImportants;
        this.vehiculeAdapte = vehiculeAdapte;
        this.paiementStatut = paiementStatut;
        this.avisDepose = avisDepose;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassagerNom() {
        return passagerNom;
    }

    public void setPassagerNom(String passagerNom) {
        this.passagerNom = passagerNom;
    }

    public String getChauffeurNom() {
        return chauffeurNom;
    }

    public void setChauffeurNom(String chauffeurNom) {
        this.chauffeurNom = chauffeurNom;
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

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Double getLatitudeDepart() {
        return latitudeDepart;
    }

    public void setLatitudeDepart(Double latitudeDepart) {
        this.latitudeDepart = latitudeDepart;
    }

    public Double getLongitudeDepart() {
        return longitudeDepart;
    }

    public void setLongitudeDepart(Double longitudeDepart) {
        this.longitudeDepart = longitudeDepart;
    }

    public Double getLatitudeArrivee() {
        return latitudeArrivee;
    }

    public void setLatitudeArrivee(Double latitudeArrivee) {
        this.latitudeArrivee = latitudeArrivee;
    }

    public Double getLongitudeArrivee() {
        return longitudeArrivee;
    }

    public void setLongitudeArrivee(Double longitudeArrivee) {
        this.longitudeArrivee = longitudeArrivee;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Integer getDureeEstimeeMinutes() {
        return dureeEstimeeMinutes;
    }

    public void setDureeEstimeeMinutes(Integer dureeEstimeeMinutes) {
        this.dureeEstimeeMinutes = dureeEstimeeMinutes;
    }

    public BigDecimal getPrixEstime() {
        return prixEstime;
    }

    public void setPrixEstime(BigDecimal prixEstime) {
        this.prixEstime = prixEstime;
    }

    public String getCategorieService() { return categorieService; }
    public void setCategorieService(String categorieService) { this.categorieService = categorieService; }
    public Integer getNombrePassagers() { return nombrePassagers; }
    public void setNombrePassagers(Integer nombrePassagers) { this.nombrePassagers = nombrePassagers; }
    public LocalDateTime getDateHeureDepart() { return dateHeureDepart; }
    public void setDateHeureDepart(LocalDateTime dateHeureDepart) { this.dateHeureDepart = dateHeureDepart; }
    public String getPeriodeCourse() { return periodeCourse; }
    public void setPeriodeCourse(String periodeCourse) { this.periodeCourse = periodeCourse; }
    public boolean isBagagesImportants() { return bagagesImportants; }
    public void setBagagesImportants(boolean bagagesImportants) { this.bagagesImportants = bagagesImportants; }
    public boolean isVehiculeAdapte() { return vehiculeAdapte; }
    public void setVehiculeAdapte(boolean vehiculeAdapte) { this.vehiculeAdapte = vehiculeAdapte; }

    public String getPaiementStatut() {
        return paiementStatut;
    }

    public void setPaiementStatut(String paiementStatut) {
        this.paiementStatut = paiementStatut;
    }

    public boolean isAvisDepose() {
        return avisDepose;
    }

    public void setAvisDepose(boolean avisDepose) {
        this.avisDepose = avisDepose;
    }
}
