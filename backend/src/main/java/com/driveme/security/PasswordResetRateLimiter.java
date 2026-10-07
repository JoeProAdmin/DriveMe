package com.driveme.security;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Map;

@Component
public class PasswordResetRateLimiter {
    private static final long MINUTE = 60_000L;
    private static final long EMAIL_WINDOW = 15 * MINUTE;
    private final Map<String, Window> emails = new HashMap<>();
    private Window forgot = new Window();
    private Window reset = new Window();

    public synchronized boolean allowForgot(String email) {
        long now = System.currentTimeMillis();
        if (!take(forgot, now, MINUTE, 30)) return false;

        emails.entrySet().removeIf(
                entry -> now - entry.getValue().start >= EMAIL_WINDOW
        );
        String key = hash(email.trim().toLowerCase(Locale.ROOT));
        Window window = emails.get(key);
        if (window == null) {
            if (emails.size() >= 2000) return false;
            window = new Window();
            emails.put(key, window);
        }
        return take(window, now, EMAIL_WINDOW, 3);
    }

    public synchronized boolean allowReset() {
        return take(reset, System.currentTimeMillis(), MINUTE, 120);
    }

    private boolean take(Window window, long now, long duration, int maximum) {
        if (window.start == 0 || now - window.start >= duration) {
            window.start = now;
            window.count = 0;
        }
        if (window.count >= maximum) return false;
        window.count++;
        return true;
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

    private static class Window {
        long start;
        int count;
    }
}
