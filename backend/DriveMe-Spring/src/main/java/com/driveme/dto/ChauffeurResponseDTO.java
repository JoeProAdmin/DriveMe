package com.driveme.dto;

public class ChauffeurResponseDTO {

    private Long id;
    private String nom;
    private String prenom;
    private String telephone;
    private Integer statutValidation;
    private Double noteMoyenne;

    public ChauffeurResponseDTO() {
    }

    public ChauffeurResponseDTO(Long id, String nom, String prenom, String telephone, Integer statutValidation, Double noteMoyenne) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.statutValidation = statutValidation;
        this.noteMoyenne = noteMoyenne;
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public String getTelephone() {
        return telephone;
    }

    public Integer getStatutValidation() {
        return statutValidation;
    }

    public Double getNoteMoyenne() {
        return noteMoyenne;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public void setStatutValidation(Integer statutValidation) {
        this.statutValidation = statutValidation;
    }

    public void setNoteMoyenne(Double noteMoyenne) {
        this.noteMoyenne = noteMoyenne;
    }
}