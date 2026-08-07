package com.driveme.service.impl;

import com.driveme.dto.*;
import com.driveme.entity.*;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.*;
import com.driveme.service.PortefeuilleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PortefeuilleServiceImpl implements PortefeuilleService {
    private static final BigDecimal BONUS = new BigDecimal("100.00");
    private static final BigDecimal TAUX = new BigDecimal("0.10");
    private final ChauffeurRepository chauffeurs; private final CourseRepository courses;
    private final TransactionPortefeuilleRepository transactions; private final UtilisateurRepository utilisateurs;
    public PortefeuilleServiceImpl(ChauffeurRepository c, CourseRepository cr, TransactionPortefeuilleRepository t, UtilisateurRepository u){chauffeurs=c;courses=cr;transactions=t;utilisateurs=u;}

    @Override @Transactional
    public void attribuerBonusBienvenue(Long chauffeurId){
        Chauffeur c=chauffeurs.findByIdForUpdate(chauffeurId).orElseThrow(()->new ResourceNotFoundException("Chauffeur introuvable"));
        BigDecimal avant=solde(c); c.setSoldeCredit(avant.add(BONUS)); chauffeurs.save(c);
        TransactionPortefeuille t=base(c,PortefeuilleTransactionType.BONUS_BIENVENUE,BONUS,RechargeMethode.PROMOTION,"Crédit promotionnel offert au lancement de DriveMe");
        t.setStatut(PortefeuilleTransactionStatut.VALIDEE); t.setSoldeAvant(avant); t.setSoldeApres(c.getSoldeCredit()); t.setDateValidation(LocalDateTime.now()); transactions.save(t);
    }
    @Override @Transactional(readOnly=true)
    public void verifierCreditPourCourse(Long chauffeurId, BigDecimal prix){BigDecimal commission=commission(prix); Chauffeur c=chauffeurs.findById(chauffeurId).orElseThrow(); if(solde(c).compareTo(commission)<0) throw new IllegalStateException("Crédit DriveMe insuffisant. Rechargez votre portefeuille pour accepter cette course.");}
    @Override @Transactional
    public void debiterCommissionCourse(Long courseId){
        Course course=courses.findByIdForUpdate(courseId).orElseThrow(()->new ResourceNotFoundException("Course introuvable"));
        Chauffeur c=chauffeurs.findByIdForUpdate(course.getChauffeur().getId()).orElseThrow(); BigDecimal montant=commission(course.getPrixFinal()!=null?course.getPrixFinal():course.getPrix());
        if(transactions.existsByCourseIdAndTypeTransaction(courseId,PortefeuilleTransactionType.COMMISSION_COURSE)) return;
        BigDecimal avant=solde(c); if(avant.compareTo(montant)<0) throw new IllegalStateException("Crédit DriveMe insuffisant pour terminer la course.");
        c.setSoldeCredit(avant.subtract(montant)); chauffeurs.save(c);
        TransactionPortefeuille t=base(c,PortefeuilleTransactionType.COMMISSION_COURSE,montant,RechargeMethode.ONLINE,"Commission DriveMe de 10 % réservée pour la course #"+courseId);
        t.setCourse(course); t.setStatut(PortefeuilleTransactionStatut.VALIDEE); t.setSoldeAvant(avant); t.setSoldeApres(c.getSoldeCredit()); t.setDateValidation(LocalDateTime.now());
        transactions.save(t);
    }
    @Override @Transactional
    public TransactionPortefeuilleDTO demanderRecharge(String email, RechargeCreateDTO dto){
        Chauffeur profil=chauffeurs.findByUtilisateurEmail(email).orElseThrow(()->new ResourceNotFoundException("Chauffeur introuvable"));
        Chauffeur c=chauffeurs.findByIdForUpdate(profil.getId()).orElseThrow(); RechargeMethode m=parse(dto.getMethode()); validatePack(dto);
        TransactionPortefeuille t=base(c,PortefeuilleTransactionType.RECHARGE,BigDecimal.valueOf(dto.getCredits()).setScale(2,RoundingMode.HALF_UP),m,"Recharge prépayée DriveMe");
        t.setReferenceExterne(dto.getReference()==null?null:dto.getReference().trim());
        if(m!=RechargeMethode.CARTE && m!=RechargeMethode.ONLINE && (t.getReferenceExterne()==null || t.getReferenceExterne().isBlank())) throw new IllegalArgumentException("La référence du transfert est obligatoire.");
        if(m==RechargeMethode.CARTE||m==RechargeMethode.ONLINE){crediter(c,t,null);} else t.setStatut(PortefeuilleTransactionStatut.EN_ATTENTE);
        return map(transactions.save(t));
    }
    @Override @Transactional(readOnly=true) public List<TransactionPortefeuilleDTO> historique(String email){Chauffeur c=chauffeurs.findByUtilisateurEmail(email).orElseThrow();return transactions.findByChauffeurIdOrderByDateCreationDesc(c.getId()).stream().map(this::map).toList();}
    @Override @Transactional(readOnly=true) public List<TransactionPortefeuilleDTO> rechargesEnAttente(){return transactions.findByStatutOrderByDateCreationAsc(PortefeuilleTransactionStatut.EN_ATTENTE).stream().map(this::map).toList();}
    @Override @Transactional public TransactionPortefeuilleDTO validerRecharge(Long id,String adminEmail,boolean approuver){TransactionPortefeuille t=transactions.findByIdForUpdate(id).orElseThrow(()->new ResourceNotFoundException("Recharge introuvable")); if(t.getTypeTransaction()!=PortefeuilleTransactionType.RECHARGE||t.getStatut()!=PortefeuilleTransactionStatut.EN_ATTENTE) throw new IllegalStateException("Cette recharge a déjà été traitée."); Utilisateur a=utilisateurs.findByEmailIgnoreCase(adminEmail).orElseThrow(); if(approuver){Chauffeur c=chauffeurs.findByIdForUpdate(t.getChauffeur().getId()).orElseThrow();crediter(c,t,a);}else{t.setStatut(PortefeuilleTransactionStatut.REFUSEE);t.setDateValidation(LocalDateTime.now());t.setValideePar(a);}return map(transactions.save(t));}
    private void crediter(Chauffeur c,TransactionPortefeuille t,Utilisateur a){BigDecimal avant=solde(c);c.setSoldeCredit(avant.add(t.getMontant()));chauffeurs.save(c);t.setStatut(PortefeuilleTransactionStatut.VALIDEE);t.setSoldeAvant(avant);t.setSoldeApres(c.getSoldeCredit());t.setDateValidation(LocalDateTime.now());t.setValideePar(a);}
    private TransactionPortefeuille base(Chauffeur c,PortefeuilleTransactionType type,BigDecimal m,RechargeMethode methode,String d){TransactionPortefeuille t=new TransactionPortefeuille();t.setChauffeur(c);t.setTypeTransaction(type);t.setMontant(m);t.setMethode(methode);t.setDescription(d);return t;}
    private BigDecimal commission(BigDecimal prix){if(prix==null||prix.signum()<=0)throw new IllegalStateException("Prix final invalide");return prix.multiply(TAUX).setScale(2,RoundingMode.HALF_UP);}
    private BigDecimal solde(Chauffeur c){return c.getSoldeCredit()==null?BigDecimal.ZERO:c.getSoldeCredit();}
    private RechargeMethode parse(String v){try{RechargeMethode m=RechargeMethode.valueOf(v.trim().toUpperCase());if(m==RechargeMethode.PROMOTION)throw new Exception();return m;}catch(Exception e){throw new IllegalArgumentException("Méthode de recharge invalide");}}
    private void validatePack(RechargeCreateDTO d){BigDecimal p=BigDecimal.valueOf(d.getMontantPaye()).setScale(2,RoundingMode.HALF_UP),c=BigDecimal.valueOf(d.getCredits()).setScale(2,RoundingMode.HALF_UP);boolean ok=p.equals(new BigDecimal("100.00"))&&c.equals(new BigDecimal("100.00"))||p.equals(new BigDecimal("250.00"))&&c.equals(new BigDecimal("275.00"))||p.equals(new BigDecimal("500.00"))&&c.equals(new BigDecimal("600.00"));if(!ok)throw new IllegalArgumentException("Pack de recharge invalide");}
    private TransactionPortefeuilleDTO map(TransactionPortefeuille t){return new TransactionPortefeuilleDTO(t.getId(),t.getChauffeur().getId(),t.getChauffeur().getUtilisateur().getNom()+" "+t.getChauffeur().getUtilisateur().getPrenom(),t.getCourse()==null?null:t.getCourse().getId(),t.getTypeTransaction().name(),t.getStatut().name(),t.getMontant(),t.getSoldeAvant(),t.getSoldeApres(),t.getMethode().name(),t.getReferenceExterne(),t.getDescription(),t.getDateCreation(),t.getDateValidation());}
}
