package com.driveme.dto;

import com.driveme.entity.DriverType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ChauffeurResponseDTO {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private Integer statutValidation;
    private Double noteMoyenne;
    private Double soldeCredit;
    private DriverType typeChauffeur;
    private Boolean disponible;
    private Double latitudeActuelle;
    private Double longitudeActuelle;
    private LocalDateTime dernierePositionAt;
    private String marqueVehicule;
    private String modeleVehicule;
    private Integer anneeVehicule;
    private String immatriculation;
    private List<ChauffeurDocumentDTO> documents = new ArrayList<>();

    public ChauffeurResponseDTO() {
    }

    public ChauffeurResponseDTO(
            Long id,
            String nom,
            String prenom,
            String email,
            String telephone,
            Integer statutValidation,
            Double noteMoyenne,
            Double soldeCredit,
            Boolean disponible,
            Double latitudeActuelle,
            Double longitudeActuelle,
            LocalDateTime dernierePositionAt) {

        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.statutValidation = statutValidation;
        this.noteMoyenne = noteMoyenne;
        this.soldeCredit = soldeCredit;
        this.disponible = disponible;
        this.latitudeActuelle = latitudeActuelle;
        this.longitudeActuelle = longitudeActuelle;
        this.dernierePositionAt = dernierePositionAt;
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

    public String getEmail() {
        return email;
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

    public Double getSoldeCredit() {
        return soldeCredit;
    }
    public DriverType getTypeChauffeur() { return typeChauffeur; }
    public Boolean getDisponible() { return disponible; }
    public Double getLatitudeActuelle() { return latitudeActuelle; }
    public Double getLongitudeActuelle() { return longitudeActuelle; }
    public LocalDateTime getDernierePositionAt() { return dernierePositionAt; }
    public String getMarqueVehicule() { return marqueVehicule; }
    public String getModeleVehicule() { return modeleVehicule; }
    public Integer getAnneeVehicule() { return anneeVehicule; }
    public String getImmatriculation() { return immatriculation; }
    public List<ChauffeurDocumentDTO> getDocuments() { return documents; }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public void setSoldeCredit(Double soldeCredit) {
        this.soldeCredit = soldeCredit;
    }
    public void setTypeChauffeur(DriverType typeChauffeur) { this.typeChauffeur = typeChauffeur; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
    public void setLatitudeActuelle(Double latitudeActuelle) { this.latitudeActuelle = latitudeActuelle; }
    public void setLongitudeActuelle(Double longitudeActuelle) { this.longitudeActuelle = longitudeActuelle; }
    public void setDernierePositionAt(LocalDateTime dernierePositionAt) { this.dernierePositionAt = dernierePositionAt; }
    public void setMarqueVehicule(String marqueVehicule) { this.marqueVehicule = marqueVehicule; }
    public void setModeleVehicule(String modeleVehicule) { this.modeleVehicule = modeleVehicule; }
    public void setAnneeVehicule(Integer anneeVehicule) { this.anneeVehicule = anneeVehicule; }
    public void setImmatriculation(String immatriculation) { this.immatriculation = immatriculation; }
    public void setDocuments(List<ChauffeurDocumentDTO> documents) { this.documents = documents != null ? documents : new ArrayList<>(); }
}
