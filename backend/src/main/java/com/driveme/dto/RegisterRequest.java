package com.driveme.dto;

public class RegisterRequest {

    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String motDePasse;
    private String role;
    private String marque;
    private String modele;
    private Integer annee;
    private String immatriculation;
    private Boolean conditionsAcceptees;
    private String versionConditions;

    public RegisterRequest() {}

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMarque() { return marque; }
    public void setMarque(String marque) { this.marque = marque; }
    public String getModele() { return modele; }
    public void setModele(String modele) { this.modele = modele; }
    public Integer getAnnee() { return annee; }
    public void setAnnee(Integer annee) { this.annee = annee; }
    public String getImmatriculation() { return immatriculation; }
    public void setImmatriculation(String immatriculation) { this.immatriculation = immatriculation; }
    public Boolean getConditionsAcceptees() { return conditionsAcceptees; }
    public void setConditionsAcceptees(Boolean value) { this.conditionsAcceptees = value; }
    public String getVersionConditions() { return versionConditions; }
    public void setVersionConditions(String value) { this.versionConditions = value; }
}
