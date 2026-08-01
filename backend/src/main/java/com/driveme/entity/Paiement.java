package com.driveme.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiement")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaiementMethode methode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaiementStatut statut;

    @Column(name = "date_paiement")
    private LocalDateTime datePaiement;

    @OneToOne
    @JoinColumn(name = "course_id", unique = true)
    private Course course;

    public Paiement() {
        this.datePaiement = LocalDateTime.now();
        this.statut = PaiementStatut.EN_ATTENTE;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public PaiementMethode getMethode() {
        return methode;
    }

    public void setMethode(PaiementMethode methode) {
        this.methode = methode;
    }

    public PaiementStatut getStatut() {
        return statut;
    }

    public void setStatut(PaiementStatut statut) {
        this.statut = statut;
    }

    public LocalDateTime getDatePaiement() {
        return datePaiement;
    }

    public void setDatePaiement(LocalDateTime datePaiement) {
        this.datePaiement = datePaiement;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}
