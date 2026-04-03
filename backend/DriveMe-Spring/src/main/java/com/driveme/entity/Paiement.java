package com.driveme.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiement")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double montant;

    @Column(nullable = false)
    private String methode; // CASH, CARTE, ONLINE

    @Column(nullable = false)
    private String statut; // EN_ATTENTE, PAYE, REFUSE

    @Column(name = "date_paiement")
    private LocalDateTime datePaiement;

    // ===== RELATION AVEC COURSE =====
    @OneToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // ===== CONSTRUCTEUR =====
    public Paiement() {
        this.datePaiement = LocalDateTime.now();
        this.statut = "EN_ATTENTE";
    }

    // ===== GETTERS / SETTERS =====

    public Long getId() { return id; }

    public Double getMontant() { return montant; }

    public void setMontant(Double montant) { this.montant = montant; }

    public String getMethode() { return methode; }

    public void setMethode(String methode) { this.methode = methode; }

    public String getStatut() { return statut; }

    public void setStatut(String statut) { this.statut = statut; }

    public LocalDateTime getDatePaiement() { return datePaiement; }

    public void setDatePaiement(LocalDateTime datePaiement) { this.datePaiement = datePaiement; }

    public Course getCourse() { return course; }

    public void setCourse(Course course) { this.course = course; }
}