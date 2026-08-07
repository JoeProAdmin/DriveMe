package com.driveme.controller;
import com.driveme.dto.ContactCreateDTO; import com.driveme.entity.ContactMessage; import com.driveme.repository.ContactMessageRepository;
import org.springframework.web.bind.annotation.*; import java.time.LocalDateTime; import java.util.*;
@RestController @RequestMapping("/api/contact")
public class ContactController {
 private final ContactMessageRepository repository; public ContactController(ContactMessageRepository r){repository=r;}
 @PostMapping public Map<String,Object> create(@RequestBody ContactCreateDTO d){
  if(d==null||blank(d.getNom())||blank(d.getEmail())||blank(d.getSujet())||blank(d.getMessage())) throw new RuntimeException("Nom, email, sujet et message sont obligatoires");
  if(!d.getEmail().trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) throw new RuntimeException("Adresse email invalide");
  if(d.getNom().trim().length()>100||d.getEmail().trim().length()>150||d.getSujet().trim().length()>150||d.getMessage().trim().length()>5000) throw new RuntimeException("Un champ dépasse la longueur autorisée");
  if(!Boolean.TRUE.equals(d.getConsentement())) throw new RuntimeException("Le consentement à la politique de confidentialité est obligatoire");
  ContactMessage i=new ContactMessage(); i.setNom(d.getNom().trim()); i.setEmail(d.getEmail().trim().toLowerCase(Locale.ROOT));
  i.setTelephone(blank(d.getTelephone())?null:d.getTelephone().trim()); i.setSujet(d.getSujet().trim()); i.setMessage(d.getMessage().trim()); i.setConsentementAt(LocalDateTime.now());
  i=repository.save(i); return Map.of("id",i.getId(),"message","Votre message a bien été transmis à l'Équipe DriveMe.");
 } private boolean blank(String v){return v==null||v.isBlank();}
}
