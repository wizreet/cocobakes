/**
 * Validation utilities for form inputs and data sanitization
 * Security-focused with proper error handling
 */

import { VALIDATION } from '@/constants';

// ============================================================================
// Validation Result Types
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// String Sanitization
// ============================================================================

/**
 * Sanitize string input to prevent XSS attacks
 * Removes potentially dangerous HTML/script content
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return (
    input
      .trim()
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Escape special characters
      .replace(/[&<>"']/g, (char) => {
        const escapeMap: Record<string, string> = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
        };
        return escapeMap[char] || char;
      })
  );
}

/**
 * Sanitize user input for display purposes
 * Less aggressive than sanitizeString, preserves more formatting
 */
export function sanitizeForDisplay(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return (
    input
      .trim()
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove event handlers
      .replace(/\s*on\w+="[^"]*"/gi, '')
      .replace(/\s*on\w+='[^']*'/gi, '')
  );
}

// ============================================================================
// Email Validation
// ============================================================================

/**
 * Validate email address format
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!VALIDATION.EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Check if email is valid (simple boolean check)
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email.trim());
}

// ============================================================================
// Name Validation
// ============================================================================

/**
 * Validate name input
 */
export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Name is required' };
  }

  if (trimmed.length < VALIDATION.NAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`,
    };
  }

  if (trimmed.length > VALIDATION.NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`,
    };
  }

  // Check for potentially malicious content
  if (/<script|javascript:|data:/i.test(trimmed)) {
    return { isValid: false, error: 'Invalid characters in name' };
  }

  return { isValid: true };
}

// ============================================================================
// Message Validation
// ============================================================================

/**
 * Validate message input
 */
export function validateMessage(message: string): ValidationResult {
  const trimmed = message.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Message is required' };
  }

  if (trimmed.length < VALIDATION.MESSAGE_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Message must be at least ${VALIDATION.MESSAGE_MIN_LENGTH} characters`,
    };
  }

  if (trimmed.length > VALIDATION.MESSAGE_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Message must be less than ${VALIDATION.MESSAGE_MAX_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

// ============================================================================
// Phone Validation
// ============================================================================

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): ValidationResult {
  const trimmed = phone.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Phone number is required' };
  }

  if (!VALIDATION.PHONE_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true };
}

// ============================================================================
// Contact Form Validation
// ============================================================================

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

/**
 * Validate entire contact form
 */
export function validateContactForm(
  data: ContactFormInput,
): FormValidationResult {
  const errors: Record<string, string> = {};

  const nameResult = validateName(data.name);
  if (!nameResult.isValid && nameResult.error) {
    errors.name = nameResult.error;
  }

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid && emailResult.error) {
    errors.email = emailResult.error;
  }

  const messageResult = validateMessage(data.message);
  if (!messageResult.isValid && messageResult.error) {
    errors.message = messageResult.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// URL Validation & Sanitization
// ============================================================================

/**
 * Validate URL format (only allows http/https)
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize URL to prevent javascript: and data: attacks
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();

  // Allow relative URLs
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return trimmed;
  }

  // Only allow http/https protocols
  if (isValidUrl(trimmed)) {
    return trimmed;
  }

  // Return empty string for invalid URLs
  return '';
}

// ============================================================================
// Number Validation
// ============================================================================

/**
 * Validate and clamp a number within a range
 */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Validate that a value is a positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value > 0;
}

/**
 * Validate that a value is a non-negative integer
 */
export function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}
