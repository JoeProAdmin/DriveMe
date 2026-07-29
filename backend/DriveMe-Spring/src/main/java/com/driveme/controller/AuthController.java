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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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

    public AuthController(
            UtilisateurRepository utilisateurRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            PassagerRepository passagerRepository,
            ChauffeurRepository chauffeurRepository
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.passagerRepository = passagerRepository;
        this.chauffeurRepository = chauffeurRepository;
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

        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom().trim());
        user.setPrenom(request.getPrenom().trim());
        user.setEmail(email);
        user.setTelephone(telephone);
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setRole(role);
        user.setDateCreation(LocalDateTime.now());
        utilisateurRepository.save(user);

        if (role == Role.PASSAGER) {
            Passager passager = new Passager();
            passager.setUtilisateur(user);
            passagerRepository.save(passager);
        } else {
            Chauffeur chauffeur = new Chauffeur();
            chauffeur.setUtilisateur(user);
            chauffeur.setStatutValidation((byte) 0);
            chauffeur.setNoteMoyenne(BigDecimal.ZERO);
            chauffeur.setSoldeCredit(BigDecimal.ZERO);
            chauffeurRepository.save(chauffeur);
        }

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
        if (!phone.matches("\\+212[5-7]\\d{8}")) {
            throw new RuntimeException("Le téléphone doit être un numéro marocain valide, par exemple +212612345678");
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
    }

    private String normalizeIdentifier(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.contains("@") ? trimmed.toLowerCase(Locale.ROOT) : normalizePhone(trimmed);
    }

    private String normalizePhone(String value) {
        if (value == null) return null;
        String digits = value.replaceAll("[^0-9+]", "");
        if (digits.startsWith("00212")) digits = "+212" + digits.substring(5);
        if (digits.startsWith("0") && digits.length() == 10) digits = "+212" + digits.substring(1);
        if (digits.startsWith("212")) digits = "+" + digits;
        return digits;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
