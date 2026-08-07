package com.driveme.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="contact_message")
public class ContactMessage {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=100) private String nom;
 @Column(nullable=false,length=150) private String email;
 @Column(length=20) private String telephone;
 @Column(nullable=false,length=150) private String sujet;
 @Column(nullable=false,columnDefinition="TEXT") private String message;
 @Column(name="consentement_at",nullable=false) private LocalDateTime consentementAt;
 @Column(name="date_creation",nullable=false) private LocalDateTime dateCreation=LocalDateTime.now();
 @Column(nullable=false,length=20) private String statut="NOUVEAU";
 public Long getId(){return id;} public String getNom(){return nom;} public void setNom(String v){nom=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getTelephone(){return telephone;}
 public void setTelephone(String v){telephone=v;} public String getSujet(){return sujet;} public void setSujet(String v){sujet=v;}
 public String getMessage(){return message;} public void setMessage(String v){message=v;} public LocalDateTime getConsentementAt(){return consentementAt;}
 public void setConsentementAt(LocalDateTime v){consentementAt=v;} public LocalDateTime getDateCreation(){return dateCreation;}
 public String getStatut(){return statut;}
}
