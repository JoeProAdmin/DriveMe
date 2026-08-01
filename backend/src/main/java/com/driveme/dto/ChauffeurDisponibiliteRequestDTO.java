package com.driveme.dto;

import jakarta.validation.constraints.NotNull;

public class ChauffeurDisponibiliteRequestDTO {
    @NotNull(message = "La disponibilité est obligatoire")
    private Boolean disponible;

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
}
