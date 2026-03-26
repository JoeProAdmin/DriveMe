package com.driveme.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

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
    @JoinColumn(name = "chauffeur_id", nullable = false)
    private Chauffeur chauffeur;

    @Column(name = "adresse_depart", nullable = false)
    private String adresseDepart;

    @Column(name = "adresse_arrivee", nullable = false)
    private String adresseArrivee;

    @Column(nullable = false)
    private Double prix;

    @Column(nullable = false)
    private String statut;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    public Course() {
    }

    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
        if (this.statut == null) {
            this.statut = "EN_ATTENTE";
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

    public Double getPrix() {
        return prix;
    }

    public String getStatut() {
        return statut;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
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

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
}