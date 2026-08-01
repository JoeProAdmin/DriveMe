package com.driveme.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "passager_id", nullable = false)
    private Passager passager;

    @ManyToOne
    @JoinColumn(name = "chauffeur_id")
    private Chauffeur chauffeur;

    @Column(name = "adresse_depart", nullable = false)
    private String adresseDepart;

    @Column(name = "adresse_arrivee", nullable = false)
    private String adresseArrivee;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    @Column(name = "latitude_depart")
    private Double latitudeDepart;

    @Column(name = "longitude_depart")
    private Double longitudeDepart;

    @Column(name = "latitude_arrivee")
    private Double latitudeArrivee;

    @Column(name = "longitude_arrivee")
    private Double longitudeArrivee;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "duree_estimee_minutes")
    private Integer dureeEstimeeMinutes;

    @Column(name = "prix_estime", precision = 10, scale = 2)
    private BigDecimal prixEstime;

    @Column(name = "prix_initial", precision = 10, scale = 2)
    private BigDecimal prixInitial;

    @Column(name = "prix_final", precision = 10, scale = 2)
    private BigDecimal prixFinal;

    @Version
    private Long version;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseStatus statut;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @OneToOne(mappedBy = "course", cascade = CascadeType.ALL)
    private Paiement paiement;

    @OneToMany(
            mappedBy = "course",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<PropositionChauffeur> propositions = new ArrayList<>();

    public Course() {
    }

    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();

        if (this.statut == null) {
            this.statut = CourseStatus.EN_ATTENTE;
        }

        if (this.prixInitial == null && this.prix != null) {
            this.prixInitial = this.prix;
        }

        if (this.prixFinal == null && this.prix != null) {
            this.prixFinal = this.prix;
        }
    }

    public Long getId() {
        return id;
    }

    public Passager getPassager() {
        return passager;
    }

    public Chauffeur getChauffeur() {
        return chauffeur;
    }

    public String getAdresseDepart() {
        return adresseDepart;
    }

    public String getAdresseArrivee() {
        return adresseArrivee;
    }

    public BigDecimal getPrix() {
        return prix;
    }

    public Double getLatitudeDepart() { return latitudeDepart; }
    public Double getLongitudeDepart() { return longitudeDepart; }
    public Double getLatitudeArrivee() { return latitudeArrivee; }
    public Double getLongitudeArrivee() { return longitudeArrivee; }
    public Double getDistanceKm() { return distanceKm; }
    public Integer getDureeEstimeeMinutes() { return dureeEstimeeMinutes; }
    public BigDecimal getPrixEstime() { return prixEstime; }

    public BigDecimal getPrixInitial() {
        return prixInitial;
    }

    public BigDecimal getPrixFinal() {
        return prixFinal;
    }

    public CourseStatus getStatut() {
        return statut;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public Paiement getPaiement() {
        return paiement;
    }

    public List<PropositionChauffeur> getPropositions() {
        return propositions;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPassager(Passager passager) {
        this.passager = passager;
    }

    public void setChauffeur(Chauffeur chauffeur) {
        this.chauffeur = chauffeur;
    }

    public void setAdresseDepart(String adresseDepart) {
        this.adresseDepart = adresseDepart;
    }

    public void setAdresseArrivee(String adresseArrivee) {
        this.adresseArrivee = adresseArrivee;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public void setLatitudeDepart(Double latitudeDepart) { this.latitudeDepart = latitudeDepart; }
    public void setLongitudeDepart(Double longitudeDepart) { this.longitudeDepart = longitudeDepart; }
    public void setLatitudeArrivee(Double latitudeArrivee) { this.latitudeArrivee = latitudeArrivee; }
    public void setLongitudeArrivee(Double longitudeArrivee) { this.longitudeArrivee = longitudeArrivee; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public void setDureeEstimeeMinutes(Integer dureeEstimeeMinutes) { this.dureeEstimeeMinutes = dureeEstimeeMinutes; }
    public void setPrixEstime(BigDecimal prixEstime) { this.prixEstime = prixEstime; }

    public void setPrixInitial(BigDecimal prixInitial) {
        this.prixInitial = prixInitial;
    }

    public void setPrixFinal(BigDecimal prixFinal) {
        this.prixFinal = prixFinal;
    }

    public void setStatut(CourseStatus statut) {
        this.statut = statut;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public void setPaiement(Paiement paiement) {
        this.paiement = paiement;
    }

    public void setPropositions(List<PropositionChauffeur> propositions) {
        this.propositions = propositions;
    }

    public Long getVersion() { return version; }

    public void setVersion(Long version) { this.version = version; }
}
