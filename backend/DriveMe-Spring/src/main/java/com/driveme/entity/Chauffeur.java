package com.driveme.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "chauffeur")
public class Chauffeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", nullable = false, unique = true)
    private Utilisateur utilisateur;

    @Column(name = "statut_validation", nullable = false)
    private Byte statutValidation;

    @Column(name = "note_moyenne", precision = 3, scale = 2)
    private BigDecimal noteMoyenne;

    @Column(name = "solde_credit", precision = 10, scale = 2)
    private BigDecimal soldeCredit;

    public Chauffeur() {
    }

    public Long getId() {
        return id;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public Byte getStatutValidation() {
        return statutValidation;
    }

    public BigDecimal getNoteMoyenne() {
        return noteMoyenne;
    }

    public BigDecimal getSoldeCredit() {
        return soldeCredit;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public void setStatutValidation(Byte statutValidation) {
        this.statutValidation = statutValidation;
    }

    public void setNoteMoyenne(BigDecimal noteMoyenne) {
        this.noteMoyenne = noteMoyenne;
    }

    public void setSoldeCredit(BigDecimal soldeCredit) {
        this.soldeCredit = soldeCredit;
    }
}