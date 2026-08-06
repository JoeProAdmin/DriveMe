package com.driveme.dto;

import java.time.LocalDateTime;

public class ChauffeurDocumentDTO {
    private Long id;
    private String type;
    private String nomOriginal;
    private String typeContenu;
    private Long tailleOctets;
    private String statutValidation;
    private LocalDateTime dateDepot;
    private LocalDateTime dateValidation;

    public Long getId() { return id; }
    public String getType() { return type; }
    public String getNomOriginal() { return nomOriginal; }
    public String getTypeContenu() { return typeContenu; }
    public Long getTailleOctets() { return tailleOctets; }
    public String getStatutValidation() { return statutValidation; }
    public LocalDateTime getDateDepot() { return dateDepot; }
    public LocalDateTime getDateValidation() { return dateValidation; }

    public void setId(Long id) { this.id = id; }
    public void setType(String type) { this.type = type; }
    public void setNomOriginal(String nomOriginal) { this.nomOriginal = nomOriginal; }
    public void setTypeContenu(String typeContenu) { this.typeContenu = typeContenu; }
    public void setTailleOctets(Long tailleOctets) { this.tailleOctets = tailleOctets; }
    public void setStatutValidation(String statutValidation) { this.statutValidation = statutValidation; }
    public void setDateDepot(LocalDateTime dateDepot) { this.dateDepot = dateDepot; }
    public void setDateValidation(LocalDateTime dateValidation) { this.dateValidation = dateValidation; }
}
