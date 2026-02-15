package com.driveme.model;

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

    @Column(name = "solde_credit", nullable = false, precision = 10, scale = 2)
    private BigDecimal soldeCredit;

    // GETTERS & SETTERS

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Utilisateur getUtilisateur() { return utilisateur; }

    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

    public Byte getStatutValidation() { return statutValidation; }

    public void setStatutValidation(Byte statutValidation) { this.statutValidation = statutValidation; }

    public BigDecimal getNoteMoyenne() { return noteMoyenne; }

    public void setNoteMoyenne(BigDecimal noteMoyenne) { this.noteMoyenne = noteMoyenne; }

    public BigDecimal getSoldeCredit() { return soldeCredit; }

    public void setSoldeCredit(BigDecimal soldeCredit) { this.soldeCredit = soldeCredit; }
}
