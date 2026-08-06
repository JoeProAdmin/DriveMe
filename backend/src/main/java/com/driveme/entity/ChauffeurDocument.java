package com.driveme.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "chauffeur_document",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_chauffeur_document_type",
                columnNames = {"chauffeur_id", "type_document"}
        )
)
public class ChauffeurDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chauffeur_id", nullable = false)
    private Chauffeur chauffeur;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "type_document", nullable = false, length = 30)
    private ChauffeurDocumentType typeDocument;

    @Column(name = "nom_original", nullable = false)
    private String nomOriginal;

    @Column(name = "nom_stockage", nullable = false)
    private String nomStockage;

    @Column(name = "type_contenu", nullable = false, length = 100)
    private String typeContenu;

    @Column(name = "taille_octets", nullable = false)
    private Long tailleOctets;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "statut_validation", nullable = false, length = 20)
    private DocumentValidationStatus statutValidation;

    @Column(name = "date_depot", nullable = false)
    private LocalDateTime dateDepot;

    @Column(name = "date_validation")
    private LocalDateTime dateValidation;

    public Long getId() { return id; }
    public Chauffeur getChauffeur() { return chauffeur; }
    public ChauffeurDocumentType getTypeDocument() { return typeDocument; }
    public String getNomOriginal() { return nomOriginal; }
    public String getNomStockage() { return nomStockage; }
    public String getTypeContenu() { return typeContenu; }
    public Long getTailleOctets() { return tailleOctets; }
    public DocumentValidationStatus getStatutValidation() { return statutValidation; }
    public LocalDateTime getDateDepot() { return dateDepot; }
    public LocalDateTime getDateValidation() { return dateValidation; }

    public void setId(Long id) { this.id = id; }
    public void setChauffeur(Chauffeur chauffeur) { this.chauffeur = chauffeur; }
    public void setTypeDocument(ChauffeurDocumentType typeDocument) { this.typeDocument = typeDocument; }
    public void setNomOriginal(String nomOriginal) { this.nomOriginal = nomOriginal; }
    public void setNomStockage(String nomStockage) { this.nomStockage = nomStockage; }
    public void setTypeContenu(String typeContenu) { this.typeContenu = typeContenu; }
    public void setTailleOctets(Long tailleOctets) { this.tailleOctets = tailleOctets; }
    public void setStatutValidation(DocumentValidationStatus statutValidation) { this.statutValidation = statutValidation; }
    public void setDateDepot(LocalDateTime dateDepot) { this.dateDepot = dateDepot; }
    public void setDateValidation(LocalDateTime dateValidation) { this.dateValidation = dateValidation; }
}
