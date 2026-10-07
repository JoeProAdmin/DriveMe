package com.driveme.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final String secretKey;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secretKey,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException(
                    "La configuration app.jwt.secret est obligatoire."
            );
        }

        this.secretKey = secretKey;
        this.expirationMs = expirationMs;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenForUser(String token, Long userId) {
        String tokenUserId = extractClaim(token, claims -> claims.get("userId", String.class));
        return userId != null && userId.toString().equals(tokenUserId);
    }

        public boolean isTokenAtAuthVersion(String token, long currentVersion) {
        Number version = extractClaim(
                token, claims -> claims.get("authVersion", Number.class)
        );
        long tokenVersion = version == null ? 0L : version.longValue();
        return currentVersion >= 0L && tokenVersion == currentVersion;
    }

    public String generateToken(String username, String role, Long userId, long authVersion) {
        if (userId == null) {
            throw new IllegalArgumentException("Identifiant utilisateur obligatoire");
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId.toString());
        claims.put("authVersion", authVersion);
        claims.put("role", role);

        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + expirationMs);

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isTokenValid(String token, String username) {
        String extractedUsername = extractUsername(token);

        return extractedUsername.equals(username)
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration)
                .before(new Date());
    }

    private <T> T extractClaim(
            String token,
            Function<Claims, T> resolver
    ) {
        return resolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
