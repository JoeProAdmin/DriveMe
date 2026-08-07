package com.driveme.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "incident_sos")
@Getter
@Setter
@NoArgsConstructor
public class SosIncident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @Column(name = "type_incident", nullable = false, length = 50)
    private String type;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "precision_metres", precision = 10, scale = 2)
    private BigDecimal precisionMetres;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SosStatus statut = SosStatus.NOUVEAU;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_mise_a_jour", nullable = false)
    private LocalDateTime dateMiseAJour = LocalDateTime.now();
}
