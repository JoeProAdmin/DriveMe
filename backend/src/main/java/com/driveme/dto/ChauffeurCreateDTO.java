package com.driveme.dto;

import com.driveme.entity.DriverType;

public class ChauffeurCreateDTO {

    private Long utilisateurId;
    private Integer statutValidation;
    private Double noteMoyenne;
    private Double soldeCredit;
    private DriverType typeChauffeur;

    public ChauffeurCreateDTO() {
    }

    public Long getUtilisateurId() {
        return utilisateurId;
    }

    public void setUtilisateurId(Long utilisateurId) {
        this.utilisateurId = utilisateurId;
    }

    public Integer getStatutValidation() {
        return statutValidation;
    }

    public void setStatutValidation(Integer statutValidation) {
        this.statutValidation = statutValidation;
    }

    public Double getNoteMoyenne() {
        return noteMoyenne;
    }

    public void setNoteMoyenne(Double noteMoyenne) {
        this.noteMoyenne = noteMoyenne;
    }

    public Double getSoldeCredit() {
        return soldeCredit;
    }

    public void setSoldeCredit(Double soldeCredit) {
        this.soldeCredit = soldeCredit;
    }

    public DriverType getTypeChauffeur() { return typeChauffeur; }
    public void setTypeChauffeur(DriverType typeChauffeur) { this.typeChauffeur = typeChauffeur; }
}
