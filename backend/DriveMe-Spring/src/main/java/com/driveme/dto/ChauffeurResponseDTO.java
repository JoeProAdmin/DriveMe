package com.driveme.dto;

import java.math.BigDecimal;

public class ChauffeurResponseDTO {

    private Long id;
    private String nom;
    private String prenom;
    private String telephone;
    private Byte statutValidation;
    private BigDecimal noteMoyenne;

    public ChauffeurResponseDTO() {}

    public ChauffeurResponseDTO(Long id, String nom, String prenom,
                                String telephone,
                                Byte statutValidation,
                                BigDecimal noteMoyenne) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.statutValidation = statutValidation;
        this.noteMoyenne = noteMoyenne;
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getTelephone() { return telephone; }
    public Byte getStatutValidation() { return statutValidation; }
    public BigDecimal getNoteMoyenne() { return noteMoyenne; }
}
