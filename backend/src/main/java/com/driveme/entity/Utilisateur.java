package com.driveme.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(length = 150)
    private String email;

    @Column(nullable = false, length = 20, unique = true)
    private String telephone;

    @JsonIgnore
    @Column(name = "mot_de_passe", nullable = false, length = 255)
    private String motDePasse;

    // ✅ ROLE PROPRE
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // ✅ LANGUE
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;
    @Column(name = "conditions_acceptees_at") private LocalDateTime conditionsAccepteesAt;
    @Column(name = "version_conditions", length = 30) private String versionConditions;

    // ===== CONSTRUCTEUR =====
    public Utilisateur() {
        this.dateCreation = LocalDateTime.now();
        this.language = Language.FR;
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }

    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }

    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }

    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getMotDePasse() { return motDePasse; }

    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

    public Role getRole() { return role; }

    public void setRole(Role role) { this.role = role; }

    public Language getLanguage() { return language; }

    public void setLanguage(Language language) { this.language = language; }

    public LocalDateTime getDateCreation() { return dateCreation; }

    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
    public LocalDateTime getConditionsAccepteesAt() { return conditionsAccepteesAt; }
    public void setConditionsAccepteesAt(LocalDateTime value) { this.conditionsAccepteesAt = value; }
    public String getVersionConditions() { return versionConditions; }
    public void setVersionConditions(String value) { this.versionConditions = value; }
}
