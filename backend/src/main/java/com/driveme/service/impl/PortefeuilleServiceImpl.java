package com.driveme.service.impl;

import com.driveme.dto.RechargeCreateDTO;
import com.driveme.dto.TransactionPortefeuilleDTO;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.Course;
import com.driveme.entity.PortefeuilleTransactionStatut;
import com.driveme.entity.PortefeuilleTransactionType;
import com.driveme.entity.RechargeMethode;
import com.driveme.entity.TransactionPortefeuille;
import com.driveme.entity.Utilisateur;
import com.driveme.exception.ResourceNotFoundException;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.CourseRepository;
import com.driveme.repository.TransactionPortefeuilleRepository;
import com.driveme.repository.UtilisateurRepository;
import com.driveme.service.PortefeuilleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PortefeuilleServiceImpl implements PortefeuilleService {

    private static final BigDecimal BONUS = new BigDecimal("100.00");
    private static final BigDecimal TAUX = new BigDecimal("0.10");

    private final ChauffeurRepository chauffeurs;
    private final CourseRepository courses;
    private final TransactionPortefeuilleRepository transactions;
    private final UtilisateurRepository utilisateurs;

    public PortefeuilleServiceImpl(
            ChauffeurRepository chauffeurs,
            CourseRepository courses,
            TransactionPortefeuilleRepository transactions,
            UtilisateurRepository utilisateurs
    ) {
        this.chauffeurs = chauffeurs;
        this.courses = courses;
        this.transactions = transactions;
        this.utilisateurs = utilisateurs;
    }

    @Override
    @Transactional
    public void attribuerBonusBienvenue(Long chauffeurId) {
        Chauffeur chauffeur = chauffeurs.findByIdForUpdate(chauffeurId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chauffeur introuvable"));

        boolean bonusDejaAttribue =
                transactions.existsByChauffeurIdAndTypeTransaction(
                        chauffeurId,
                        PortefeuilleTransactionType.BONUS_BIENVENUE
                );

        if (bonusDejaAttribue) {
            return;
        }

        BigDecimal soldeAvant = solde(chauffeur);
        chauffeur.setSoldeCredit(soldeAvant.add(BONUS));
        chauffeurs.save(chauffeur);

        TransactionPortefeuille transaction = base(
                chauffeur,
                PortefeuilleTransactionType.BONUS_BIENVENUE,
                BONUS,
                RechargeMethode.PROMOTION,
                "Crédit promotionnel offert au lancement de DriveMe"
        );

        transaction.setStatut(PortefeuilleTransactionStatut.VALIDEE);
        transaction.setSoldeAvant(soldeAvant);
        transaction.setSoldeApres(chauffeur.getSoldeCredit());
        transaction.setDateValidation(LocalDateTime.now());

        transactions.save(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public void verifierCreditPourCourse(Long chauffeurId, BigDecimal prix) {
        BigDecimal montantCommission = commission(prix);

        Chauffeur chauffeur = chauffeurs.findById(chauffeurId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chauffeur introuvable"));

        if (solde(chauffeur).compareTo(montantCommission) < 0) {
            throw new IllegalStateException(
                    "Crédit DriveMe insuffisant. " +
                            "Rechargez votre portefeuille pour accepter cette course."
            );
        }
    }

    @Override
    @Transactional
    public void debiterCommissionCourse(Long courseId) {
        Course course = courses.findByIdForUpdate(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable"));

        Chauffeur chauffeur = chauffeurs
                .findByIdForUpdate(course.getChauffeur().getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chauffeur introuvable"));

        BigDecimal prix = course.getPrixFinal() != null
                ? course.getPrixFinal()
                : course.getPrix();

        BigDecimal montantCommission = commission(prix);

        boolean commissionDejaDebitee =
                transactions.existsByCourseIdAndTypeTransaction(
                        courseId,
                        PortefeuilleTransactionType.COMMISSION_COURSE
                );

        if (commissionDejaDebitee) {
            return;
        }

        BigDecimal soldeAvant = solde(chauffeur);

        if (soldeAvant.compareTo(montantCommission) < 0) {
            throw new IllegalStateException(
                    "Crédit DriveMe insuffisant pour terminer la course."
            );
        }

        chauffeur.setSoldeCredit(soldeAvant.subtract(montantCommission));
        chauffeurs.save(chauffeur);

        TransactionPortefeuille transaction = base(
                chauffeur,
                PortefeuilleTransactionType.COMMISSION_COURSE,
                montantCommission,
                RechargeMethode.ONLINE,
                "Commission DriveMe de 10 % débitée pour la course #" + courseId
        );

        transaction.setCourse(course);
        transaction.setStatut(PortefeuilleTransactionStatut.VALIDEE);
        transaction.setSoldeAvant(soldeAvant);
        transaction.setSoldeApres(chauffeur.getSoldeCredit());
        transaction.setDateValidation(LocalDateTime.now());

        transactions.save(transaction);
    }

    @Override
    @Transactional
    public TransactionPortefeuilleDTO demanderRecharge(
            String email,
            RechargeCreateDTO dto
    ) {
        Chauffeur profil = chauffeurs.findByUtilisateurEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chauffeur introuvable"));

        Chauffeur chauffeur = chauffeurs.findByIdForUpdate(profil.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chauffeur introuvable"));

        RechargeMethode methode = parse(dto.getMethode());
        validatePack(dto);

        TransactionPortefeuille transaction = base(
                chauffeur,
                PortefeuilleTransactionType.RECHARGE,
                BigDecimal.valueOf(dto.getCredits())
                        .setScale(2, RoundingMode.HALF_UP),
                methode,
                "Recharge prépayée DriveMe"
        );

        transaction.setReferenceExterne(
                dto.getReference() == null
                        ? null
                        : dto.getReference().trim()
        );

        if (methode != RechargeMethode.CARTE
                && methode != RechargeMethode.ONLINE
                && (transaction.getReferenceExterne() == null
                || transaction.getReferenceExterne().isBlank())) {
            throw new IllegalArgumentException(
                    "La référence du transfert est obligatoire."
            );
        }

        if (methode == RechargeMethode.CARTE
                || methode == RechargeMethode.ONLINE) {
            crediter(chauffeur, transaction, null);
        } else {
            transaction.setStatut(
                    PortefeuilleTransactionStatut.EN_ATTENTE
            );
        }

        return map(transactions.save(transaction));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionPortefeuilleDTO> historique(String email) {
        Chauffeur chauffeur = chauffeurs.findByUtilisateurEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chauffeur introuvable"));

        return transactions
                .findByChauffeurIdOrderByDateCreationDesc(chauffeur.getId())
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionPortefeuilleDTO> rechargesEnAttente() {
        return transactions
                .findByStatutOrderByDateCreationAsc(
                        PortefeuilleTransactionStatut.EN_ATTENTE
                )
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional
    public TransactionPortefeuilleDTO validerRecharge(
            Long id,
            String adminEmail,
            boolean approuver
    ) {
        TransactionPortefeuille transaction =
                transactions.findByIdForUpdate(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Recharge introuvable"
                                ));

        if (transaction.getTypeTransaction()
                != PortefeuilleTransactionType.RECHARGE
                || transaction.getStatut()
                != PortefeuilleTransactionStatut.EN_ATTENTE) {
            throw new IllegalStateException(
                    "Cette recharge a déjà été traitée."
            );
        }

        Utilisateur administrateur =
                utilisateurs.findByEmailIgnoreCase(adminEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Administrateur introuvable"
                                ));

        if (approuver) {
            Chauffeur chauffeur = chauffeurs
                    .findByIdForUpdate(transaction.getChauffeur().getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Chauffeur introuvable"
                            ));

            crediter(chauffeur, transaction, administrateur);
        } else {
            transaction.setStatut(
                    PortefeuilleTransactionStatut.REFUSEE
            );
            transaction.setDateValidation(LocalDateTime.now());
            transaction.setValideePar(administrateur);
        }

        return map(transactions.save(transaction));
    }

    private void crediter(
            Chauffeur chauffeur,
            TransactionPortefeuille transaction,
            Utilisateur administrateur
    ) {
        BigDecimal soldeAvant = solde(chauffeur);

        chauffeur.setSoldeCredit(
                soldeAvant.add(transaction.getMontant())
        );

        chauffeurs.save(chauffeur);

        transaction.setStatut(
                PortefeuilleTransactionStatut.VALIDEE
        );
        transaction.setSoldeAvant(soldeAvant);
        transaction.setSoldeApres(chauffeur.getSoldeCredit());
        transaction.setDateValidation(LocalDateTime.now());
        transaction.setValideePar(administrateur);
    }

    private TransactionPortefeuille base(
            Chauffeur chauffeur,
            PortefeuilleTransactionType type,
            BigDecimal montant,
            RechargeMethode methode,
            String description
    ) {
        TransactionPortefeuille transaction =
                new TransactionPortefeuille();

        transaction.setChauffeur(chauffeur);
        transaction.setTypeTransaction(type);
        transaction.setMontant(montant);
        transaction.setMethode(methode);
        transaction.setDescription(description);

        return transaction;
    }

    private BigDecimal commission(BigDecimal prix) {
        if (prix == null || prix.signum() <= 0) {
            throw new IllegalStateException("Prix final invalide");
        }

        return prix.multiply(TAUX)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal solde(Chauffeur chauffeur) {
        return chauffeur.getSoldeCredit() == null
                ? BigDecimal.ZERO
                : chauffeur.getSoldeCredit();
    }

    private RechargeMethode parse(String valeur) {
        try {
            RechargeMethode methode = RechargeMethode.valueOf(
                    valeur.trim().toUpperCase()
            );

            if (methode == RechargeMethode.PROMOTION) {
                throw new IllegalArgumentException();
            }

            return methode;
        } catch (Exception exception) {
            throw new IllegalArgumentException(
                    "Méthode de recharge invalide"
            );
        }
    }

    private void validatePack(RechargeCreateDTO dto) {
        BigDecimal montantPaye =
                BigDecimal.valueOf(dto.getMontantPaye())
                        .setScale(2, RoundingMode.HALF_UP);

        BigDecimal credits =
                BigDecimal.valueOf(dto.getCredits())
                        .setScale(2, RoundingMode.HALF_UP);

        boolean packValide =
                montantPaye.equals(new BigDecimal("200.00"))
                        && credits.equals(new BigDecimal("200.00"))
                        || montantPaye.equals(new BigDecimal("250.00"))
                        && credits.equals(new BigDecimal("275.00"))
                        || montantPaye.equals(new BigDecimal("500.00"))
                        && credits.equals(new BigDecimal("600.00"));

        if (!packValide) {
            throw new IllegalArgumentException(
                    "Pack de recharge invalide"
            );
        }
    }

    private TransactionPortefeuilleDTO map(
            TransactionPortefeuille transaction
    ) {
        return new TransactionPortefeuilleDTO(
                transaction.getId(),
                transaction.getChauffeur().getId(),
                transaction.getChauffeur().getUtilisateur().getNom()
                        + " "
                        + transaction.getChauffeur()
                        .getUtilisateur()
                        .getPrenom(),
                transaction.getCourse() == null
                        ? null
                        : transaction.getCourse().getId(),
                transaction.getTypeTransaction().name(),
                transaction.getStatut().name(),
                transaction.getMontant(),
                transaction.getSoldeAvant(),
                transaction.getSoldeApres(),
                transaction.getMethode().name(),
                transaction.getReferenceExterne(),
                transaction.getDescription(),
                transaction.getDateCreation(),
                transaction.getDateValidation()
        );
    }
}
