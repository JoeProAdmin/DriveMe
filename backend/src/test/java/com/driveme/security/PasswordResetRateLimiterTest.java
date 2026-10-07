package com.driveme.security;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PasswordResetRateLimiterTest {
    @Test
    void emailLimitAlsoAppliesToCaseAndWhitespaceVariants() {
        PasswordResetRateLimiter limiter = new PasswordResetRateLimiter();

        assertTrue(limiter.allowForgot("Test@example.test"));
        assertTrue(limiter.allowForgot("test@example.test"));
        assertTrue(limiter.allowForgot(" TEST@example.test "));
        assertFalse(limiter.allowForgot("test@example.test"));
    }

    @Test
    void globalLimitAppliesAcrossDifferentAddresses() {
        PasswordResetRateLimiter limiter = new PasswordResetRateLimiter();

        for (int i = 0; i < 30; i++) {
            assertTrue(limiter.allowForgot("test" + i + "@example.test"));
        }
        assertFalse(limiter.allowForgot("autre@example.test"));
    }
}
