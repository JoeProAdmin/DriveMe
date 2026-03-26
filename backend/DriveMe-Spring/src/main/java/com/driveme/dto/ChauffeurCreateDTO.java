package com.driveme.dto;

import jakarta.validation.constraints.NotNull;

public class ChauffeurCreateDTO {

    @NotNull(message = "L'utilisateurId est obligatoire")
    private Long utilisateurId;

    public ChauffeurCreateDTO() {
    }

    public Long getUtilisateurId() {
        return utilisateurId;
    }

    public void setUtilisateurId(Long utilisateurId) {
        this.utilisateurId = utilisateurId;
    }
}