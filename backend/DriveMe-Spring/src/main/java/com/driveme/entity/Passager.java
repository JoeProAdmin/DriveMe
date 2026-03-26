package com.driveme.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "passager")
public class Passager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String photoUrl;

    private LocalDateTime dateCreation;

    public Passager() {}

    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getTelephone() { return telephone; }
    public String getEmail() { return email; }
    public String getPhotoUrl() { return photoUrl; }
    public LocalDateTime getDateCreation() { return dateCreation; }

    public void setId(Long id) { this.id = id; }
    public void setNom(String nom) { this.nom = nom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public void setEmail(String email) { this.email = email; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
}