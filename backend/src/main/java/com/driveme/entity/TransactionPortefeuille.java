package com.driveme.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_portefeuille", uniqueConstraints =
        @UniqueConstraint(name = "uk_transaction_commission_course", columnNames = {"course_id", "type_transaction"}))
public class TransactionPortefeuille {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "chauffeur_id", nullable = false)
    private Chauffeur chauffeur;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "course_id")
    private Course course;
    @Enumerated(EnumType.STRING) @Column(name = "type_transaction", nullable = false)
    private PortefeuilleTransactionType typeTransaction;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private PortefeuilleTransactionStatut statut;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal montant;
    @Column(name = "solde_avant", precision = 10, scale = 2) private BigDecimal soldeAvant;
    @Column(name = "solde_apres", precision = 10, scale = 2) private BigDecimal soldeApres;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private RechargeMethode methode;
    @Column(name = "reference_externe", length = 120) private String referenceExterne;
    @Column(nullable = false, length = 255) private String description;
    @Column(name = "date_creation", nullable = false) private LocalDateTime dateCreation;
    @Column(name = "date_validation") private LocalDateTime dateValidation;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "validee_par") private Utilisateur valideePar;

    @PrePersist void prePersist() { if (dateCreation == null) dateCreation = LocalDateTime.now(); }
    public Long getId(){return id;} public Chauffeur getChauffeur(){return chauffeur;} public Course getCourse(){return course;}
    public PortefeuilleTransactionType getTypeTransaction(){return typeTransaction;} public PortefeuilleTransactionStatut getStatut(){return statut;}
    public BigDecimal getMontant(){return montant;} public BigDecimal getSoldeAvant(){return soldeAvant;} public BigDecimal getSoldeApres(){return soldeApres;}
    public RechargeMethode getMethode(){return methode;} public String getReferenceExterne(){return referenceExterne;} public String getDescription(){return description;}
    public LocalDateTime getDateCreation(){return dateCreation;} public LocalDateTime getDateValidation(){return dateValidation;}
    public void setChauffeur(Chauffeur v){chauffeur=v;} public void setCourse(Course v){course=v;} public void setTypeTransaction(PortefeuilleTransactionType v){typeTransaction=v;}
    public void setStatut(PortefeuilleTransactionStatut v){statut=v;} public void setMontant(BigDecimal v){montant=v;} public void setSoldeAvant(BigDecimal v){soldeAvant=v;}
    public void setSoldeApres(BigDecimal v){soldeApres=v;} public void setMethode(RechargeMethode v){methode=v;} public void setReferenceExterne(String v){referenceExterne=v;}
    public void setDescription(String v){description=v;} public void setDateValidation(LocalDateTime v){dateValidation=v;} public void setValideePar(Utilisateur v){valideePar=v;}
}
