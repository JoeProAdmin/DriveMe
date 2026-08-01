package com.driveme.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private boolean disponible;

    @Column(name = "latitude_actuelle")
    private Double latitudeActuelle;

    @Column(name = "longitude_actuelle")
    private Double longitudeActuelle;

    @Column(name = "derniere_position_at")
    private LocalDateTime dernierePositionAt;

    @Version
    private Long version;

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

    public boolean isDisponible() { return disponible; }
    public Double getLatitudeActuelle() { return latitudeActuelle; }
    public Double getLongitudeActuelle() { return longitudeActuelle; }
    public LocalDateTime getDernierePositionAt() { return dernierePositionAt; }
    public Long getVersion() { return version; }

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

    public void setDisponible(boolean disponible) { this.disponible = disponible; }
    public void setLatitudeActuelle(Double latitudeActuelle) { this.latitudeActuelle = latitudeActuelle; }
    public void setLongitudeActuelle(Double longitudeActuelle) { this.longitudeActuelle = longitudeActuelle; }
    public void setDernierePositionAt(LocalDateTime dernierePositionAt) { this.dernierePositionAt = dernierePositionAt; }
    public void setVersion(Long version) { this.version = version; }
}
