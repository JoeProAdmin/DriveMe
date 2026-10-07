package com.driveme.service;

import com.driveme.entity.PasswordResetToken;
import com.driveme.entity.Utilisateur;
import com.driveme.repository.PasswordResetTokenRepository;
import com.driveme.repository.UtilisateurRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;

@Service
public class PasswordResetService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PasswordResetService.class);
    private static final String INVALID_LINK = "Lien invalide, expiré ou déjà utilisé.";
    private final SecureRandom random = new SecureRandom();
    private final UtilisateurRepository users;
    private final PasswordResetTokenRepository tokens;
    private final PasswordEncoder encoder;
    private final ObjectProvider<JavaMailSender> mailProvider;
    private final String frontendUrl;
    private final String sender;

    public PasswordResetService(
            UtilisateurRepository users,
            PasswordResetTokenRepository tokens,
            PasswordEncoder encoder,
            ObjectProvider<JavaMailSender> mailProvider,
            @Value("${app.password-reset.frontend-url:http://localhost:8081}") String frontendUrl,
            @Value("${app.password-reset.sender:support@driveme.cloud}") String sender
    ) {
        this.users = users;
        this.tokens = tokens;
        this.encoder = encoder;
        this.mailProvider = mailProvider;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
        this.sender = sender;
    }

    @Async("passwordResetExecutor")
    @Transactional
    public void request(String email) {
        JavaMailSender mail = mailProvider.getIfAvailable();
        if (mail == null) {
            LOGGER.warn("Réinitialisation : envoi email non configuré.");
            return;
        }

        Long userId = users.findIdByEmailForPasswordReset(
                email.trim().toLowerCase(Locale.ROOT)
        ).orElse(null);
        if (userId == null) return;

        Utilisateur user = users.findByIdForPasswordReset(userId).orElse(null);
        if (user == null || user.getEmail() == null
                || !user.getEmail().equalsIgnoreCase(email.trim())
                || user.getEmail().toLowerCase(Locale.ROOT).endsWith("@deleted.invalid")) {
            return;
        }

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        PasswordResetToken stored = tokens.findByUtilisateurIdForUpdate(user.getId()).orElse(null);
        if (stored != null && stored.getDateCreation().isAfter(now.minusMinutes(1))) {
            return;
        }

        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        PasswordResetToken reset = stored == null ? new PasswordResetToken() : stored;
        reset.setUtilisateurId(user.getId());
        reset.setTokenHash(hash(rawToken));
        reset.setDateCreation(now);
        reset.setDateExpiration(now.plusMinutes(30));
        tokens.saveAndFlush(reset);

        String resetUrl = frontendUrl + "/reset-password#token=" + rawToken;
        String safeUrl = org.springframework.web.util.HtmlUtils.htmlEscape(resetUrl);
        String safeSender = org.springframework.web.util.HtmlUtils.htmlEscape(sender);

        String plainText =
                "Bonjour,\n\n"
                + "Une réinitialisation du mot de passe de votre compte DriveMe a été demandée.\n\n"
                + resetUrl + "\n\n"
                + "Ce lien est valable 30 minutes et utilisable une seule fois.\n"
                + "Si vous n'avez pas demandé ce changement, ignorez cet email. "
                + "Votre mot de passe reste inchangé.\n\n"
                + "Support DriveMe\n" + sender;

        String html = """
                <!doctype html>
                <html lang="fr">
                <head><meta charset="UTF-8"></head>
                <body style="margin:0;padding:24px;background:#f5f7fb;font-family:Arial,sans-serif;color:#0f172a;">
                  <table role="presentation" style="width:100%;max-width:600px;margin:auto;border-collapse:collapse;background:#ffffff;">
                    <tr>
                      <td style="padding:28px;background:#0f172a;">
                        <span style="font-size:28px;font-weight:bold;color:#ffffff;">Drive<span style="color:#10b981;">Me</span></span>
                        <p style="margin:10px 0 0;color:#cbd5e1;font-size:14px;">Sécurité de votre compte</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:32px;line-height:1.6;">
                        <h1 style="margin:0 0 20px;font-size:24px;">Réinitialiser votre mot de passe</h1>
                        <p>Bonjour,</p>
                        <p>Une demande de réinitialisation a été effectuée pour votre compte DriveMe.</p>
                        <p>Pour choisir un nouveau mot de passe, utilisez le bouton ci-dessous.</p>
                        <table role="presentation" style="margin:24px 0;border-collapse:collapse;">
                          <tr>
                            <td style="background:#047857;border-radius:8px;">
                              <a href="{{RESET_URL}}" style="display:inline-block;padding:15px 22px;color:#ffffff;font-weight:bold;text-decoration:none;">Choisir mon nouveau mot de passe</a>
                            </td>
                          </tr>
                        </table>
                        <p><strong>Ce lien expire dans 30 minutes et ne peut être utilisé qu’une seule fois.</strong></p>
                        <p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet email. Votre mot de passe reste inchangé.</p>
                        <p style="margin-top:24px;font-size:13px;color:#475569;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
                        <p style="font-size:12px;overflow-wrap:anywhere;"><a href="{{RESET_URL}}" style="color:#047857;">{{RESET_URL}}</a></p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:24px 32px;background:#f1f5f9;font-size:13px;line-height:1.6;">
                        <strong>Support DriveMe</strong><br>
                        <a href="mailto:{{SENDER}}" style="color:#047857;">{{SENDER}}</a><br>
                        Ne communiquez jamais votre mot de passe ou ce lien à un tiers.
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.replace("{{RESET_URL}}", safeUrl).replace("{{SENDER}}", safeSender);

        try {
            jakarta.mail.internet.MimeMessage message = mail.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper =
                    new org.springframework.mail.javamail.MimeMessageHelper(
                            message, true, StandardCharsets.UTF_8.name()
                    );
            helper.setFrom(sender, "Support DriveMe");
            helper.setTo(user.getEmail());
            helper.setSubject("DriveMe — Réinitialisation de votre mot de passe");
            helper.setText(plainText, html);
            mail.send(message);
        } catch (jakarta.mail.MessagingException | java.io.UnsupportedEncodingException exception) {
            throw new IllegalStateException("Impossible de préparer l'email de réinitialisation.");
        }
    }

    @Transactional
    public void reset(String rawToken, String password) {
        if (rawToken == null || !rawToken.matches("[A-Za-z0-9_-]{43}")) {
            throw new IllegalArgumentException(INVALID_LINK);
        }
        validatePassword(password);

        String tokenHash = hash(rawToken);
        Long userId = tokens.findUtilisateurIdByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException(INVALID_LINK));

        Utilisateur user = users.findByIdForPasswordReset(userId)
                .orElseThrow(() -> new IllegalArgumentException(INVALID_LINK));

        // Relit le jeton après acquisition du verrou du compte.
        PasswordResetToken reset = tokens.findByUtilisateurIdForUpdate(user.getId())
                .orElseThrow(() -> new IllegalArgumentException(INVALID_LINK));

        if (!tokenHash.equals(reset.getTokenHash())
                || !reset.getDateExpiration().isAfter(LocalDateTime.now(ZoneOffset.UTC))
                || user.getEmail() == null
                || user.getEmail().toLowerCase(Locale.ROOT).endsWith("@deleted.invalid")) {
            throw new IllegalArgumentException(INVALID_LINK);
        }

        user.setMotDePasse(encoder.encode(password));
        user.setAuthVersion(Math.addExact(user.getAuthVersion(), 1L));
        users.save(user);
        tokens.delete(reset);
        tokens.flush();
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 12
                || password.getBytes(StandardCharsets.UTF_8).length > 72
                || !password.matches("(?s).*[A-Za-z].*")
                || !password.matches("(?s).*\\d.*")) {
            throw new IllegalArgumentException(
                    "Le mot de passe doit contenir au moins 12 caractères, "
                    + "une lettre et un chiffre, sans dépasser 72 octets."
            );
        }
    }

    private String hash(String value) {
        try {
            return HexFormat.of().formatHex(
                    MessageDigest.getInstance("SHA-256")
                            .digest(value.getBytes(StandardCharsets.UTF_8))
            );
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 indisponible", exception);
        }
    }
}
