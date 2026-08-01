package com.driveme.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(
        name = "proposition_chauffeur",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_course_chauffeur",
                        columnNames = {
                                "course_id",
                                "chauffeur_id"
                        }
                )
        }
)
public class PropositionChauffeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chauffeur_id", nullable = false)
    private Chauffeur chauffeur;

    @Column(name = "prix_propose", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixPropose;

    @Column(name = "distance_chauffeur_depart")
    private Double distanceChauffeurDepart;

    @Column(name = "temps_estime_minutes")
    private Integer tempsEstimeMinutes;

    @Column(length = 300)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_proposition", nullable = false)
    private PropositionStatus statutProposition;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @Version
    private Long version;

    public PropositionChauffeur() {
    }

    @PrePersist
    public void prePersist() {

        dateCreation = LocalDateTime.now();

        if (statutProposition == null) {
            statutProposition = PropositionStatus.EN_ATTENTE;
        }

    }

    public Long getId() {
        return id;
    }

    public Course getCourse() {
        return course;
    }

    public Chauffeur getChauffeur() {
        return chauffeur;
    }

    public BigDecimal getPrixPropose() {
        return prixPropose;
    }

    public Double getDistanceChauffeurDepart() {
        return distanceChauffeurDepart;
    }

    public Integer getTempsEstimeMinutes() {
        return tempsEstimeMinutes;
    }

    public String getMessage() {
        return message;
    }

    public PropositionStatus getStatutProposition() {
        return statutProposition;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setChauffeur(Chauffeur chauffeur) {
        this.chauffeur = chauffeur;
    }

    public void setPrixPropose(BigDecimal prixPropose) {
        this.prixPropose = prixPropose;
    }

    public void setDistanceChauffeurDepart(Double distanceChauffeurDepart) {
        this.distanceChauffeurDepart = distanceChauffeurDepart;
    }

    public void setTempsEstimeMinutes(Integer tempsEstimeMinutes) {
        this.tempsEstimeMinutes = tempsEstimeMinutes;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setStatutProposition(PropositionStatus statutProposition) {
        this.statutProposition = statutProposition;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Long getVersion() { return version; }

    public void setVersion(Long version) { this.version = version; }

}
