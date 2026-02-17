package com.driveme.dto;

public class PassagerResponseDTO {

    private Long id;
    private String photo;
    private Long utilisateurId;

    public PassagerResponseDTO(Long id, String photo, Long utilisateurId) {
        this.id = id;
        this.photo = photo;
        this.utilisateurId = utilisateurId;
    }

    public Long getId() {
        return id;
    }

    public String getPhoto() {
        return photo;
    }

    public Long getUtilisateurId() {
        return utilisateurId;
    }
}
