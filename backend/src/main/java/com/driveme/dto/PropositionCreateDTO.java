package com.driveme.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class PropositionCreateDTO {

    @NotNull(message = "Le montant proposé est obligatoire")
    @DecimalMin(value = "1.00", message = "Le montant proposé doit être supérieur ou égal à 1 MAD")
    @Digits(integer = 8, fraction = 2, message = "Le montant proposé doit contenir au maximum 2 décimales")
    private BigDecimal prixPropose;

    private Double distanceChauffeurDepart;

    private Integer tempsEstimeMinutes;

    @Size(max = 300, message = "Le message ne peut pas dépasser 300 caractères")
    private String message;

    public PropositionCreateDTO() {
    }

    public BigDecimal getPrixPropose() {
        return prixPropose;
    }

    public void setPrixPropose(BigDecimal prixPropose) {
        this.prixPropose = prixPropose;
    }

    public Double getDistanceChauffeurDepart() {
        return distanceChauffeurDepart;
    }

    public void setDistanceChauffeurDepart(Double distanceChauffeurDepart) {
        this.distanceChauffeurDepart = distanceChauffeurDepart;
    }

    public Integer getTempsEstimeMinutes() {
        return tempsEstimeMinutes;
    }

    public void setTempsEstimeMinutes(Integer tempsEstimeMinutes) {
        this.tempsEstimeMinutes = tempsEstimeMinutes;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
