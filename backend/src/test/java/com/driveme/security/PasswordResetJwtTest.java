package com.driveme.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import java.util.Base64;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class PasswordResetJwtTest {
    private final byte[] key = "0123456789abcdef0123456789abcdef".getBytes();
    private final JwtService jwt =
            new JwtService(Base64.getEncoder().encodeToString(key), 60_000L);

    @Test
    void tokenIsRejectedAfterSessionVersionChanges() {
        String token = jwt.generateToken("test@example.test", "PASSAGER", 19L, 2L);

        assertTrue(jwt.isTokenForUser(token, 19L));
        assertFalse(jwt.isTokenForUser(token, 20L));
        assertTrue(jwt.isTokenAtAuthVersion(token, 2L));
        assertFalse(jwt.isTokenAtAuthVersion(token, 3L));
    }

    @Test
    void legacyTokenWorksOnlyBeforeFirstVersionChange() {
        String token = Jwts.builder()
                .subject("test@example.test")
                .claim("userId", "19")
                .expiration(new Date(System.currentTimeMillis() + 60_000L))
                .signWith(Keys.hmacShaKeyFor(key))
                .compact();

        assertTrue(jwt.isTokenAtAuthVersion(token, 0L));
        assertFalse(jwt.isTokenAtAuthVersion(token, 1L));
    }
}
