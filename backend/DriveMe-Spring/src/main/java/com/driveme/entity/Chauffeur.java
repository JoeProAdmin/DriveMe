package com.driveme.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

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

    @NotNull(message = "Le statutValidation est obligatoire")
    @Column(name = "statut_validation", nullable = false)
    private Byte statutValidation;

    @PositiveOrZero(message = "La noteMoyenne ne peut pas être négative")
    @Column(name = "note_moyenne", precision = 3, scale = 2)
    private BigDecimal noteMoyenne;

    @NotNull(message = "Le soldeCredit est obligatoire")
    @PositiveOrZero(message = "Le soldeCredit ne peut pas être négatif")
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
