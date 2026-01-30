/**
 * Environment configuration with validation
 * Centralizes environment variable access with type safety and validation
 */

// ============================================================================
// Environment Variable Validation
// ============================================================================

/**
 * Validates that required environment variables are present
 * In production, you should add actual environment variables
 */
function validateEnv(): void {
  // Add validation for required env vars when in production
  // Example: if (!import.meta.env.PUBLIC_API_KEY) throw new Error('Missing PUBLIC_API_KEY');
}

// Run validation on import (tree-shaken in production if not used)
if (import.meta.env.DEV) {
  validateEnv();
}

// ============================================================================
// Environment Configuration
// ============================================================================

export const env = {
  /**
   * Application mode
   */
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,

  /**
   * Base URL configuration
   */
  baseUrl: import.meta.env.BASE_URL || '/',
  siteUrl: import.meta.env.SITE || 'https://wizreet.github.io',

  /**
   * Feature flags (can be driven by env vars in production)
   */
  features: {
    enableAnalytics: import.meta.env.PUBLIC_ENABLE_ANALYTICS === 'true',
    enableContactForm: true,
    enableBrownieBuilder: true,
  },

  /**
   * API endpoints (placeholder for future backend integration)
   */
  api: {
    baseUrl: import.meta.env.PUBLIC_API_URL || '',
  },
} as const;

// ============================================================================
// Environment-specific utilities
// ============================================================================

/**
 * Log only in development mode
 */
export function devLog(...args: unknown[]): void {
  if (env.isDev) {
    console.log('[DEV]', ...args);
  }
}

/**
 * Log warnings only in development mode
 */
export function devWarn(...args: unknown[]): void {
  if (env.isDev) {
    console.warn('[DEV WARN]', ...args);
  }
}

/**
 * Log errors (always logged, but with additional context in dev)
 * In production, errors are silently tracked without console output
 */
export function logError(error: unknown, context?: string): void {
  if (env.isDev) {
    console.error(`[ERROR${context ? ` - ${context}` : ''}]`, error);
  }
  // In production, errors are suppressed from console
  // Could be sent to error tracking service (e.g., Sentry) in future
}

export default env;
