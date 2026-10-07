package com.driveme.service;

import com.driveme.entity.PasswordResetToken;
import com.driveme.entity.Utilisateur;
import com.driveme.repository.PasswordResetTokenRepository;
import com.driveme.repository.UtilisateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HexFormat;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {
    @Mock UtilisateurRepository users;
    @Mock PasswordResetTokenRepository tokens;
    @Mock PasswordEncoder encoder;
    @Mock ObjectProvider<JavaMailSender> provider;
    @Mock JavaMailSender mail;

    PasswordResetService service;
    final String raw = "A".repeat(43);
    final String password = "NouveauMotDePasse123!";
    Utilisateur user;
    PasswordResetToken token;

    @BeforeEach
    void setup() throws Exception {
        service = new PasswordResetService(
                users, tokens, encoder, provider,
                "https://driveme.cloud", "support@driveme.cloud"
        );
        user = new Utilisateur();
        user.setId(19L);
        user.setEmail("test@example.test");
        user.setMotDePasse("ancien-hash");
        user.setAuthVersion(2L);

        token = new PasswordResetToken();
        token.setUtilisateurId(19L);
        token.setTokenHash(hash(raw));
        token.setDateCreation(LocalDateTime.now(ZoneOffset.UTC));
        token.setDateExpiration(LocalDateTime.now(ZoneOffset.UTC).plusMinutes(30));
    }

    private String hash(String value) throws Exception {
        return HexFormat.of().formatHex(
                MessageDigest.getInstance("SHA-256")
                        .digest(value.getBytes(StandardCharsets.UTF_8))
        );
    }

    private void existingToken() {
        when(tokens.findUtilisateurIdByTokenHash(token.getTokenHash())).thenReturn(Optional.of(19L));
        when(users.findByIdForPasswordReset(19L)).thenReturn(Optional.of(user));
        when(tokens.findByUtilisateurIdForUpdate(19L)).thenReturn(Optional.of(token));
    }

    @Test
    void validLinkChangesPasswordRevokesSessionsAndConsumesToken() {
        existingToken();
        when(encoder.encode(password)).thenReturn("nouveau-hash");

        service.reset(raw, password);

        assertEquals("nouveau-hash", user.getMotDePasse());
        assertEquals(3L, user.getAuthVersion());
        verify(users).save(user);
        verify(tokens).delete(token);
        verify(tokens).flush();
    }

    @Test
    void expiredLinkDoesNotChangePassword() {
        token.setDateExpiration(LocalDateTime.now(ZoneOffset.UTC).minusMinutes(1));
        existingToken();

        assertThrows(IllegalArgumentException.class, () -> service.reset(raw, password));

        assertEquals("ancien-hash", user.getMotDePasse());
        assertEquals(2L, user.getAuthVersion());
        verifyNoInteractions(encoder);
        verify(tokens, never()).delete(any());
    }

    @Test
    void consumedLinkIsRejected() {
        when(tokens.findUtilisateurIdByTokenHash(token.getTokenHash())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.reset(raw, password));

        verifyNoInteractions(encoder, users);
        verify(tokens, never()).delete(any());
    }

    @Test
    void replacedLinkIsRejectedAfterAccountLock() {
        String originalHash = token.getTokenHash();
        when(tokens.findUtilisateurIdByTokenHash(originalHash)).thenReturn(Optional.of(19L));
        when(users.findByIdForPasswordReset(19L)).thenReturn(Optional.of(user));

        PasswordResetToken replacement = new PasswordResetToken();
        replacement.setUtilisateurId(19L);
        replacement.setTokenHash("b".repeat(64));
        replacement.setDateExpiration(LocalDateTime.now(ZoneOffset.UTC).plusMinutes(30));
        when(tokens.findByUtilisateurIdForUpdate(19L)).thenReturn(Optional.of(replacement));

        assertThrows(IllegalArgumentException.class, () -> service.reset(raw, password));

        verifyNoInteractions(encoder);
        verify(users, never()).save(any());
    }

    @Test
    void tokenConsumedWhileWaitingForAccountLockIsRejected() {
        when(tokens.findUtilisateurIdByTokenHash(token.getTokenHash()))
                .thenReturn(Optional.of(19L));
        when(users.findByIdForPasswordReset(19L)).thenReturn(Optional.of(user));
        when(tokens.findByUtilisateurIdForUpdate(19L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.reset(raw, password));

        assertEquals("ancien-hash", user.getMotDePasse());
        assertEquals(2L, user.getAuthVersion());
        verifyNoInteractions(encoder);
        verify(users, never()).save(any());
        verify(tokens, never()).delete(any());
    }

    @Test
    void weakPasswordIsRejectedBeforeDatabaseAccess() {
        assertThrows(IllegalArgumentException.class, () -> service.reset(raw, "court1"));

        verifyNoInteractions(tokens, users, encoder);
    }

    @Test
    void unknownEmailCreatesNoTokenAndSendsNoMail() {
        when(provider.getIfAvailable()).thenReturn(mail);
        when(users.findIdByEmailForPasswordReset("inconnu@example.test")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> service.request("inconnu@example.test"));

        verifyNoInteractions(tokens, mail);
    }
}
