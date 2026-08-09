package com.driveme.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import com.driveme.entity.CategorieService;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CourseCreateDTO {

    @NotBlank(message = "L'adresse de départ est obligatoire")
    private String adresseDepart;

    @NotBlank(message = "L'adresse d'arrivée est obligatoire")
    private String adresseArrivee;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "15.0", message = "Le prix doit être au minimum de 15 MAD")
    private BigDecimal prix;

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
    private BigDecimal prixEstime;

    private CategorieService categorieService;

    @Min(value = 1, message = "Le nombre de passagers doit être au minimum de 1")
    @Max(value = 50, message = "Le nombre de passagers ne peut pas dépasser 50")
    private Integer nombrePassagers;

    @FutureOrPresent(message = "La date et l'heure de départ ne peuvent pas être dans le passé")
    private LocalDateTime dateHeureDepart;

    private boolean bagagesImportants;
    private boolean vehiculeAdapte;

    public CourseCreateDTO() {}

    public String getAdresseDepart() { return adresseDepart; }
    public void setAdresseDepart(String adresseDepart) { this.adresseDepart = adresseDepart; }
    public String getAdresseArrivee() { return adresseArrivee; }
    public void setAdresseArrivee(String adresseArrivee) { this.adresseArrivee = adresseArrivee; }
    public BigDecimal getPrix() { return prix; }
    public void setPrix(BigDecimal prix) { this.prix = prix; }
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
    public BigDecimal getPrixEstime() { return prixEstime; }
    public void setPrixEstime(BigDecimal prixEstime) { this.prixEstime = prixEstime; }
    public CategorieService getCategorieService() { return categorieService; }
    public void setCategorieService(CategorieService categorieService) { this.categorieService = categorieService; }
    public Integer getNombrePassagers() { return nombrePassagers; }
    public void setNombrePassagers(Integer nombrePassagers) { this.nombrePassagers = nombrePassagers; }
    public LocalDateTime getDateHeureDepart() { return dateHeureDepart; }
    public void setDateHeureDepart(LocalDateTime dateHeureDepart) { this.dateHeureDepart = dateHeureDepart; }
    public boolean isBagagesImportants() { return bagagesImportants; }
    public void setBagagesImportants(boolean bagagesImportants) { this.bagagesImportants = bagagesImportants; }
    public boolean isVehiculeAdapte() { return vehiculeAdapte; }
    public void setVehiculeAdapte(boolean vehiculeAdapte) { this.vehiculeAdapte = vehiculeAdapte; }
}
