package com.driveme.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "avis",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_avis_course",
                        columnNames = "course_id"
                )
        }
)
public class Avis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id", nullable = false, unique = true)
    private Course course;

    @ManyToOne(optional = false)
    @JoinColumn(name = "chauffeur_id", nullable = false)
    private Chauffeur chauffeur;

    @Column(nullable = false)
    private Integer note;

    @Column(length = 1000)
    private String commentaire;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    public Avis() {
    }

    @PrePersist
    public void prePersist() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
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

    public Integer getNote() {
        return note;
    }

    public String getCommentaire() {
        return commentaire;
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

    public void setNote(Integer note) {
        this.note = note;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
}