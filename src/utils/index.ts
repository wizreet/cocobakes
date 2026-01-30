/**
 * Utility functions for the CocoBakes application
 * Following best practices for reusability and type safety
 */

import { PRICING, BUSINESS, SOCIAL_URLS } from '@/constants';

// ============================================================================
// Re-export validation utilities
// ============================================================================

export * from './validation';

// ============================================================================
// Re-export security utilities
// ============================================================================

export * from './security';

// ============================================================================
// Re-export logging utilities
// ============================================================================

export {
  logger,
  createLogger,
  measurePerformance,
  measureAsyncPerformance,
} from './logger';

// ============================================================================
// Re-export performance utilities
// ============================================================================

export {
  // Web Vitals
  initWebVitals,
  trackLCP,
  trackFCP,
  trackCLS,
  trackTTFB,
  getVitalRating,
  VITALS_THRESHOLDS,
  // Lazy Loading
  createLazyLoader,
  preloadImage,
  preloadImages,
  // Image Optimization
  generateSrcSet,
  getOptimalImageSize,
  generateBlurPlaceholder,
  // Idle Callbacks
  requestIdleCallbackPolyfill,
  cancelIdleCallbackPolyfill,
  deferToIdle,
  scheduleChunkedWork,
  // Device Detection
  isLowMemoryDevice,
  prefersReducedData,
  getConnectionType,
  // Resource Hints
  addPreconnect,
  addDnsPrefetch,
  addPreload,
  // Animation Frame
  rafThrottle,
  nextFrame,
  // Marks & Measures
  mark,
  measure,
  getPerformanceEntries,
  // Default export
  Performance,
} from './performance';

export type { WebVital, VitalCallback } from './performance';

// ============================================================================
// Number Utilities
// ============================================================================

/**
 * Normalize a number to a 0-1 range based on max value
 */
export function normalizeNumber(value: number, max: number): number {
  if (max === 0) return 0;
  const ratio = value / max;
  return Math.min(Math.max(0, ratio), 1);
}

/**
 * Get the base font size from the document root
 */
export function getBaseFontSize(): number {
  if (typeof document === 'undefined') return 16;
  const computedStyle = getComputedStyle(document.documentElement);
  return parseInt(computedStyle.fontSize, 10) || 16;
}

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number): string {
  return `${PRICING.CURRENCY} ${price.toLocaleString(PRICING.CURRENCY_LOCALE)}`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Simple formatting for Nepal numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('977') && cleaned.length === 13) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  return phone;
}

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Build WhatsApp message URL
 */
export function buildWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `${SOCIAL_URLS.WHATSAPP}?text=${encodedMessage}`;
}

/**
 * Build order message for WhatsApp
 */
export function buildOrderMessage(
  itemName: string,
  price: number,
  customMessage?: string,
): string {
  const baseMessage =
    customMessage ||
    `Hi! I'd like to order ${itemName} (${formatPrice(price)})`;
  return baseMessage;
}

/**
 * Generate full order summary for brownie builder
 */
export interface OrderDetails {
  baseName: string;
  toppings: string[];
  extras: string[];
  quantity: number;
  unitPrice: number;
  discount: number;
  finalPrice: number;
}

export function generateOrderMessage(details: OrderDetails): string {
  let message = `Hi! I would like to order from ${BUSINESS.NAME} 🍫\n\n`;
  message += `I'd like ${details.quantity} piece${details.quantity > 1 ? 's' : ''} of ${details.baseName}`;

  if (details.toppings.length > 0) {
    message += ` with ${details.toppings.join(', ')} as toppings`;
  }

  if (details.extras.length > 0) {
    message += `, and ${details.extras.join(', ')} as add-ons`;
  }

  message += `.\n\n`;
  message += `Order Summary:\n`;
  message += `- Base: ${details.baseName}\n`;

  if (details.toppings.length > 0) {
    message += `- Toppings: ${details.toppings.join(', ')}\n`;
  }

  if (details.extras.length > 0) {
    message += `- Add-ons: ${details.extras.join(', ')}\n`;
  }

  message += `- Quantity: ${details.quantity} pieces\n`;
  message += `- Price per piece: ${formatPrice(details.unitPrice)}\n`;

  if (details.discount > 0) {
    message += `- Discount: ${details.discount}% off\n`;
  }

  message += `- Total: ${formatPrice(details.finalPrice)}\n`;
  message += `\nDelivery to ${BUSINESS.LOCATION}.\n\nThank you! 😊`;

  return message;
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate string to specified length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Generate slug from string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// DOM Utilities (client-side only)
// ============================================================================

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if we're running on the client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if we're running on the server side
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

// ============================================================================
// Array Utilities
// ============================================================================

/**
 * Remove duplicates from array based on key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
