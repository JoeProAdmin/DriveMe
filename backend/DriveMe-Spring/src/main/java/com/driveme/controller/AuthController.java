package com.driveme.controller;

import com.driveme.dto.AuthRequest;
import com.driveme.dto.AuthResponse;
import com.driveme.dto.RegisterRequest;
import com.driveme.entity.Role;
import com.driveme.entity.Utilisateur;
import com.driveme.repository.UtilisateurRepository;
import com.driveme.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UtilisateurRepository utilisateurRepository,
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {

        Utilisateur user = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (request.getMotDePasse() == null || request.getMotDePasse().isBlank()) {
            throw new RuntimeException("Mot de passe manquant");
        }

        if (user.getMotDePasse() == null || user.getMotDePasse().isBlank()) {
            throw new RuntimeException("Mot de passe utilisateur absent en base");
        }

        if (!user.getMotDePasse().startsWith("$2a$")
                && !user.getMotDePasse().startsWith("$2b$")
                && !user.getMotDePasse().startsWith("$2y$")) {
            throw new RuntimeException("Mot de passe non sécurisé en base (BCrypt requis)");
        }

        boolean passwordOk = passwordEncoder.matches(request.getMotDePasse(), user.getMotDePasse());

        if (!passwordOk) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(token);
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {

        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        if (utilisateurRepository.existsByTelephone(request.getTelephone())) {
            throw new RuntimeException("Téléphone déjà utilisé");
        }

        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setTelephone(request.getTelephone());
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        user.setDateCreation(LocalDateTime.now());

        utilisateurRepository.save(user);

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(token);
    }
}