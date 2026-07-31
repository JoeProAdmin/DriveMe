package com.driveme.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "passager")
public class Passager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //  LIEN AVEC UTILISATEUR (IMPORTANT)
    @OneToOne
    @JoinColumn(name = "utilisateur_id", nullable = false, unique = true)
    private Utilisateur utilisateur;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    public Passager() {}

    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public Utilisateur getUtilisateur() { return utilisateur; }

    public String getPhotoUrl() { return photoUrl; }

    public LocalDateTime getDateCreation() { return dateCreation; }

    public void setId(Long id) { this.id = id; }

    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
}