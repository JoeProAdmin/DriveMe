package com.driveme.dto;

import jakarta.validation.constraints.*;

public class RechargeCreateDTO {
    @NotNull @DecimalMin("1.00") private Double montantPaye;
    @NotNull @DecimalMin("1.00") private Double credits;
    @NotBlank private String methode;
    private String reference;
    public Double getMontantPaye(){return montantPaye;} public void setMontantPaye(Double v){montantPaye=v;}
    public Double getCredits(){return credits;} public void setCredits(Double v){credits=v;}
    public String getMethode(){return methode;} public void setMethode(String v){methode=v;}
    public String getReference(){return reference;} public void setReference(String v){reference=v;}
}
