package com.driveme.dto;
public class ContactCreateDTO {
 private String nom,email,telephone,sujet,message; private Boolean consentement;
 public String getNom(){return nom;} public void setNom(String v){nom=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;}
 public String getTelephone(){return telephone;} public void setTelephone(String v){telephone=v;} public String getSujet(){return sujet;} public void setSujet(String v){sujet=v;}
 public String getMessage(){return message;} public void setMessage(String v){message=v;} public Boolean getConsentement(){return consentement;} public void setConsentement(Boolean v){consentement=v;}
}
