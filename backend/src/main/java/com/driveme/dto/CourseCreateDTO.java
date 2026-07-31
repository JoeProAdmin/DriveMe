package com.driveme.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CourseCreateDTO {

    @NotBlank(message = "L'adresse de départ est obligatoire")
    private String adresseDepart;

    @NotBlank(message = "L'adresse d'arrivée est obligatoire")
    private String adresseArrivee;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "15.0", message = "Le prix doit être au minimum de 15 MAD")
    private Double prix;

    @NotNull(message = "La latitude de départ est obligatoire")
    @DecimalMin(value = "-90.0", message = "La latitude de départ doit être supérieure ou égale à -90")
    @DecimalMax(value = "90.0", message = "La latitude de départ doit être inférieure ou égale à 90")
    private Double latitudeDepart;
    @NotNull(message = "La longitude de départ est obligatoire")
    @DecimalMin(value = "-180.0", message = "La longitude de départ doit être supérieure ou égale à -180")
    @DecimalMax(value = "180.0", message = "La longitude de départ doit être inférieure ou égale à 180")
    private Double longitudeDepart;
    @NotNull(message = "La latitude d'arrivée est obligatoire")
    @DecimalMin(value = "-90.0", message = "La latitude d'arrivée doit être supérieure ou égale à -90")
    @DecimalMax(value = "90.0", message = "La latitude d'arrivée doit être inférieure ou égale à 90")
    private Double latitudeArrivee;
    @NotNull(message = "La longitude d'arrivée est obligatoire")
    @DecimalMin(value = "-180.0", message = "La longitude d'arrivée doit être supérieure ou égale à -180")
    @DecimalMax(value = "180.0", message = "La longitude d'arrivée doit être inférieure ou égale à 180")
    private Double longitudeArrivee;

    @Positive(message = "La distance doit être strictement positive")
    private Double distanceKm;
    @Positive(message = "La durée estimée doit être strictement positive")
    private Integer dureeEstimeeMinutes;
    @Positive(message = "Le prix estimé doit être strictement positif")
    private Double prixEstime;

    public CourseCreateDTO() {}

    public String getAdresseDepart() { return adresseDepart; }
    public void setAdresseDepart(String adresseDepart) { this.adresseDepart = adresseDepart; }
    public String getAdresseArrivee() { return adresseArrivee; }
    public void setAdresseArrivee(String adresseArrivee) { this.adresseArrivee = adresseArrivee; }
    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }
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
