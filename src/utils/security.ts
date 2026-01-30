/**
 * Security utilities for the application
 * Following OWASP best practices
 */

// ============================================================================
// Rate Limiting (Client-side)
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Client-side rate limiting for form submissions
 * Prevents spam submissions from the same user
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000,
): { allowed: boolean; remainingAttempts: number; resetInMs: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    rateLimitStore.delete(key);
  }

  const currentEntry = rateLimitStore.get(key);

  if (!currentEntry) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return {
      allowed: true,
      remainingAttempts: maxAttempts - 1,
      resetInMs: windowMs,
    };
  }

  if (currentEntry.count >= maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetInMs: currentEntry.resetTime - now,
    };
  }

  currentEntry.count++;
  return {
    allowed: true,
    remainingAttempts: maxAttempts - currentEntry.count,
    resetInMs: currentEntry.resetTime - now,
  };
}

/**
 * Reset rate limit for a key (e.g., after successful submission)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

// ============================================================================
// CSRF Protection (for future backend integration)
// ============================================================================

/**
 * Generate a CSRF token for forms
 * In production, this should come from the server
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for SSR
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

// ============================================================================
// Secure Headers Configuration
// ============================================================================

/**
 * Recommended security headers for the application
 * These should be configured server-side for production
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for React
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://wa.me https://ig.me",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
} as const;

// ============================================================================
// Honeypot Field (Anti-bot)
// ============================================================================

/**
 * Check if honeypot field is filled (indicates bot)
 */
export function isHoneypotFilled(
  formData: FormData,
  fieldName: string = 'website',
): boolean {
  const value = formData.get(fieldName);
  return value !== null && value !== '';
}

// ============================================================================
// Input Length Limits (DoS Prevention)
// ============================================================================

export const INPUT_LIMITS = {
  NAME_MAX: 100,
  EMAIL_MAX: 254, // RFC 5321
  MESSAGE_MAX: 5000,
  PHONE_MAX: 20,
  URL_MAX: 2048,
} as const;

/**
 * Truncate input to prevent DoS attacks
 */
export function truncateInput(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength);
}

// ============================================================================
// Secure External Links
// ============================================================================

/**
 * Generate secure attributes for external links
 */
export function getExternalLinkAttrs(url: string): Record<string, string> {
  const isExternal = url.startsWith('http://') || url.startsWith('https://');

  if (!isExternal) {
    return {};
  }

  return {
    target: '_blank',
    rel: 'noopener noreferrer',
  };
}

/**
 * Check if URL is from a trusted domain
 */
export function isTrustedDomain(
  url: string,
  trustedDomains: string[],
): boolean {
  try {
    const parsed = new URL(url);
    return trustedDomains.some(
      (domain) =>
        parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

// Trusted domains for this application
export const TRUSTED_DOMAINS = [
  'instagram.com',
  'facebook.com',
  'wa.me',
  'ig.me',
  'maps.google.com',
  'google.com',
] as const;
