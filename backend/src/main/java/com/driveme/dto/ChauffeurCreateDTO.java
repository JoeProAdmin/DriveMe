package com.driveme.dto;

public class ChauffeurCreateDTO {

    private Long utilisateurId;
    private Integer statutValidation;
    private Double noteMoyenne;
    private Double soldeCredit;

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
}