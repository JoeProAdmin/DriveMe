package com.driveme.controller;

import com.driveme.service.PasswordResetService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.core.task.TaskRejectedException;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {
    private final PasswordResetService service;
    private final com.driveme.security.PasswordResetRateLimiter limiter;

    public PasswordResetController(
            PasswordResetService service,
            com.driveme.security.PasswordResetRateLimiter limiter
    ) {
        this.service = service;
        this.limiter = limiter;
    }

    public record ForgotRequest(
            @NotBlank @Email @Size(max = 150) String email
    ) {}

    public record ResetRequest(
            @NotBlank @Size(max = 100) String token,
            @NotBlank @Size(max = 72) String motDePasse
    ) {}

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgot(@Valid @RequestBody ForgotRequest request) {
        try {
            if (limiter.allowForgot(request.email())) {
                service.request(request.email());
            }
        } catch (TaskRejectedException ignored) {
            // Même réponse si la file d'envoi est temporairement saturée.
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(
                Map.of("message", "Si un compte correspond à cette adresse, "
                        + "un lien de réinitialisation vous sera envoyé.")
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> reset(@Valid @RequestBody ResetRequest request) {
        if (!limiter.allowReset()) {
            return ResponseEntity.status(429).cacheControl(CacheControl.noStore()).body(
                    Map.of("message", "Trop de tentatives. Réessayez plus tard.")
            );
        }
        service.reset(request.token(), request.motDePasse());
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(
                Map.of("message", "Votre mot de passe a été modifié. Vous pouvez vous reconnecter.")
        );
    }
}
