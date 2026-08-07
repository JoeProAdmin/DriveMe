package com.driveme.controller;

import com.driveme.dto.AuthRequest;
import com.driveme.dto.AuthResponse;
import com.driveme.dto.RegisterRequest;
import com.driveme.dto.UserProfileDTO;
import com.driveme.entity.Chauffeur;
import com.driveme.entity.Passager;
import com.driveme.entity.Role;
import com.driveme.entity.Utilisateur;
import com.driveme.repository.ChauffeurRepository;
import com.driveme.repository.PassagerRepository;
import com.driveme.repository.UtilisateurRepository;
import com.driveme.security.JwtService;
import com.driveme.service.ChauffeurDocumentService;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final PassagerRepository passagerRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final ChauffeurDocumentService chauffeurDocumentService;

    public AuthController(
            UtilisateurRepository utilisateurRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            PassagerRepository passagerRepository,
            ChauffeurRepository chauffeurRepository,
            ChauffeurDocumentService chauffeurDocumentService
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.passagerRepository = passagerRepository;
        this.chauffeurRepository = chauffeurRepository;
        this.chauffeurDocumentService = chauffeurDocumentService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        String identifiant = normalizeIdentifier(request.resolveIdentifiant());
        String motDePasse = request.getMotDePasse();

        if (identifiant == null || identifiant.isBlank()) {
            throw new RuntimeException("Veuillez saisir votre email ou votre numéro de téléphone");
        }
        if (motDePasse == null || motDePasse.isBlank()) {
            throw new RuntimeException("Veuillez saisir votre mot de passe");
        }

        Utilisateur user = identifiant.contains("@")
                ? utilisateurRepository.findByEmailIgnoreCase(identifiant)
                    .orElseThrow(() -> new RuntimeException("Identifiants incorrects"))
                : utilisateurRepository.findByTelephone(identifiant)
                    .orElseThrow(() -> new RuntimeException("Identifiants incorrects"));

        if (user.getMotDePasse() == null || !passwordEncoder.matches(motDePasse, user.getMotDePasse())) {
            throw new RuntimeException("Identifiants incorrects");
        }

        return new AuthResponse(jwtService.generateToken(user.getEmail(), user.getRole().name()));
    }

    @PostMapping("/register")
    @Transactional
    public AuthResponse register(@RequestBody RegisterRequest request) {
        validateRegisterRequest(request);

        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        String telephone = normalizePhone(request.getTelephone());

        if (utilisateurRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Cette adresse email est déjà utilisée");
        }
        if (utilisateurRepository.existsByTelephone(telephone)) {
            throw new RuntimeException("Ce numéro de téléphone est déjà utilisé");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new RuntimeException("Rôle utilisateur invalide");
        }
        if (role != Role.PASSAGER && role != Role.CHAUFFEUR) {
            throw new RuntimeException("Seuls les profils passager et chauffeur peuvent s'inscrire");
        }
        if (role == Role.CHAUFFEUR) {
            throw new RuntimeException("L'inscription chauffeur nécessite le dossier documentaire complet");
        }

        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom().trim());
        user.setPrenom(request.getPrenom().trim());
        user.setEmail(email);
        user.setTelephone(telephone);
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setRole(role);
        user.setDateCreation(LocalDateTime.now());
        recordTermsAcceptance(user, request);
        utilisateurRepository.save(user);

        Passager passager = new Passager();
        passager.setUtilisateur(user);
        passagerRepository.save(passager);

        return new AuthResponse(jwtService.generateToken(user.getEmail(), user.getRole().name()));
    }

    @PostMapping(value = "/register/chauffeur", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public AuthResponse registerChauffeur(
            @RequestPart("data") RegisterRequest request,
            @RequestPart("cin") MultipartFile cin,
            @RequestPart("permis") MultipartFile permis,
            @RequestPart("carteGrise") MultipartFile carteGrise,
            @RequestPart("assurance") MultipartFile assurance,
            @RequestPart("selfie") MultipartFile selfie,
            @RequestPart(value = "photoAvant", required = false) MultipartFile photoAvant,
            @RequestPart(value = "photoArriere", required = false) MultipartFile photoArriere
    ) {
        validateRegisterRequest(request);
        if (!"CHAUFFEUR".equalsIgnoreCase(request.getRole())) {
            throw new RuntimeException("Le dossier multipart est réservé à l'inscription chauffeur");
        }
        validateDriverRequest(request);

        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        String telephone = normalizePhone(request.getTelephone());
        if (utilisateurRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Cette adresse email est déjà utilisée");
        }
        if (utilisateurRepository.existsByTelephone(telephone)) {
            throw new RuntimeException("Ce numéro de téléphone est déjà utilisé");
        }

        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom().trim());
        user.setPrenom(request.getPrenom().trim());
        user.setEmail(email);
        user.setTelephone(telephone);
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setRole(Role.CHAUFFEUR);
        user.setDateCreation(LocalDateTime.now());
        recordTermsAcceptance(user, request);
        utilisateurRepository.save(user);

        Chauffeur chauffeur = new Chauffeur();
        chauffeur.setUtilisateur(user);
        chauffeur.setStatutValidation((byte) 0);
        chauffeur.setNoteMoyenne(BigDecimal.ZERO);
        chauffeur.setSoldeCredit(BigDecimal.ZERO);
        chauffeur.setDisponible(false);
        chauffeur.setMarqueVehicule(request.getMarque().trim());
        chauffeur.setModeleVehicule(request.getModele().trim());
        chauffeur.setAnneeVehicule(request.getAnnee());
        chauffeur.setImmatriculation(request.getImmatriculation().trim().toUpperCase(Locale.ROOT));
        chauffeurRepository.save(chauffeur);

        chauffeurDocumentService.saveInitialDocuments(
                chauffeur, cin, permis, carteGrise, assurance, selfie, photoAvant, photoArriere
        );

        return new AuthResponse(jwtService.generateToken(user.getEmail(), user.getRole().name()));
    }

    @GetMapping("/me")
    public UserProfileDTO getCurrentUser(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Utilisateur non authentifié");
        }
        Utilisateur user = utilisateurRepository.findByEmailIgnoreCase(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return new UserProfileDTO(
                user.getNom(), user.getPrenom(), user.getEmail(),
                user.getTelephone(), user.getRole().name()
        );
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null) throw new RuntimeException("Données d'inscription manquantes");
        if (isBlank(request.getNom()) || isBlank(request.getPrenom())) {
            throw new RuntimeException("Le nom et le prénom sont obligatoires");
        }
        if (isBlank(request.getEmail()) || !request.getEmail().contains("@")) {
            throw new RuntimeException("Veuillez saisir une adresse email valide");
        }
        if (isBlank(request.getTelephone())) {
            throw new RuntimeException("Le numéro de téléphone est obligatoire");
        }
        String phone = normalizePhone(request.getTelephone());
        if (!phone.matches("\\+[1-9]\\d{7,14}")) {
            throw new RuntimeException("Le téléphone doit respecter le format international E.164, par exemple +212612345678 ou +33612345678");
        }
        if (isBlank(request.getMotDePasse()) || request.getMotDePasse().length() < 8) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 8 caractères");
        }
        if (!request.getMotDePasse().matches(".*[A-Za-z].*") || !request.getMotDePasse().matches(".*\\d.*")) {
            throw new RuntimeException("Le mot de passe doit contenir au moins une lettre et un chiffre");
        }
        if (isBlank(request.getRole())) {
            throw new RuntimeException("Le profil utilisateur est obligatoire");
        }
        if (!Boolean.TRUE.equals(request.getConditionsAcceptees()) || isBlank(request.getVersionConditions())) {
            throw new RuntimeException("Vous devez accepter les conditions générales et la politique de confidentialité");
        }
    }

    private void recordTermsAcceptance(Utilisateur user, RegisterRequest request) {
        user.setConditionsAccepteesAt(LocalDateTime.now());
        user.setVersionConditions(request.getVersionConditions().trim());
    }

    private void validateDriverRequest(RegisterRequest request) {
        if (isBlank(request.getMarque()) || isBlank(request.getModele()) || isBlank(request.getImmatriculation())) {
            throw new RuntimeException("La marque, le modèle et l'immatriculation du véhicule sont obligatoires");
        }
        if (request.getAnnee() == null || request.getAnnee() < 1990 || request.getAnnee() > 2030) {
            throw new RuntimeException("L'année du véhicule doit être comprise entre 1990 et 2030");
        }
    }

    private String normalizeIdentifier(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.contains("@") ? trimmed.toLowerCase(Locale.ROOT) : normalizePhone(trimmed);
    }

    private String normalizePhone(String value) {
        if (value == null) return null;
        String phone = value.trim().replaceAll("[\\s().-]", "");
        if (phone.startsWith("00")) phone = "+" + phone.substring(2);
        // Compatibilité avec les numéros nationaux marocains déjà utilisés.
        if (phone.matches("0\\d{9}")) phone = "+212" + phone.substring(1);
        return phone;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
