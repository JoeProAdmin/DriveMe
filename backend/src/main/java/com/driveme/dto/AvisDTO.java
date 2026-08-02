package com.driveme.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AvisDTO {

    @NotNull(message = "La course est obligatoire")
    private Long courseId;

    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note doit être comprise entre 1 et 5")
    @Max(value = 5, message = "La note doit être comprise entre 1 et 5")
    private Integer note;

    @Size(
            max = 1000,
            message = "Le commentaire ne peut pas dépasser 1000 caractères"
    )
    private String commentaire;

    public AvisDTO() {
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Integer getNote() {
        return note;
    }

    public void setNote(Integer note) {
        this.note = note;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }
}