package com.driveme.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "passager")
public class Passager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    private String photo;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", nullable = false, unique = true)
    private Utilisateur utilisateur;

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getPhoto() { return photo; }

    public void setPhoto(String photo) { this.photo = photo; }

    public Utilisateur getUtilisateur() { return utilisateur; }

    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }
}
