package com.driveme.dto;

public class AuthRequest {

    private String identifiant;
    private String email;
    private String motDePasse;

    public AuthRequest() {
    }

    public String getIdentifiant() {
        return identifiant;
    }

    public void setIdentifiant(String identifiant) {
        this.identifiant = identifiant;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String resolveIdentifiant() {
        if (identifiant != null && !identifiant.isBlank()) {
            return identifiant.trim();
        }
        return email == null ? null : email.trim();
    }
}
