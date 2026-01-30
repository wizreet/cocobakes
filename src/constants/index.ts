/**
 * Application-wide constants
 * Centralized configuration for maintainability and security
 */

// ============================================================================
// Environment & URLs
// ============================================================================

/**
 * Get the base path for the application
 * Ensures consistent URL handling across the app
 */
export const getBasePath = (): string => {
  const rawBase = import.meta.env.BASE_URL || '/';
  return rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
};

export const BASE_PATH = getBasePath();

// ============================================================================
// Business Constants
// ============================================================================

/**
 * Business contact information
 * NOTE: Email is displayed with obfuscation to prevent scraping
 * Phone numbers are publicly visible for customer contact
 */
export const BUSINESS = {
  NAME: 'CocoBakes',
  TAGLINE: 'Handcrafted Brownies from Nepal',
  LOCATION: 'Lalitpur, Nepal',
  PHONE: '+977 9849805290',
  PHONE_RAW: '9779849805290',
  EMAIL: 'cocobakesnp@gmail.com',
  WHATSAPP_NUMBER: '9779849805290',
} as const;

// ============================================================================
// Social Media URLs
// ============================================================================

export const SOCIAL_URLS = {
  INSTAGRAM: 'https://instagram.com/cocobakes.np',
  INSTAGRAM_DM: 'https://ig.me/m/cocobakes.np',
  FACEBOOK: 'https://facebook.com/cocobakes.np',
  WHATSAPP: `https://wa.me/${BUSINESS.WHATSAPP_NUMBER}`,
  GOOGLE_MAPS: 'https://maps.google.com/?q=Lalitpur,Nepal',
} as const;

// ============================================================================
// Navigation Configuration
// ============================================================================

export const NAV_LINKS = [
  { href: BASE_PATH, text: 'Home', icon: 'heroicons:home-solid' },
  { href: `${BASE_PATH}menu`, text: 'Menu', icon: 'heroicons:cake-solid' },
  {
    href: `${BASE_PATH}craft`,
    text: 'Craft',
    icon: 'heroicons:sparkles-solid',
  },
  {
    href: `${BASE_PATH}gallery`,
    text: 'Gallery',
    icon: 'heroicons:photo-solid',
  },
  {
    href: `${BASE_PATH}offers`,
    text: 'Offers',
    icon: 'heroicons:gift-solid',
    isSpecial: true,
  },
] as const;

// ============================================================================
// SEO & Meta Configuration
// ============================================================================

export const SEO = {
  DEFAULT_TITLE: `${BUSINESS.NAME} - ${BUSINESS.TAGLINE}`,
  DEFAULT_DESCRIPTION: `Welcome to ${BUSINESS.NAME}, your artisan brownie bakery in ${BUSINESS.LOCATION}. Discover our handcrafted brownies made with love and premium ingredients. Order your favorites today!`,
  OG_IMAGE: '/LogoVertical.jpeg',
  FAVICON: '/LogoCircular.jpeg',
} as const;

// ============================================================================
// UI Configuration
// ============================================================================

export const UI = {
  /** Scroll threshold for header style change */
  HEADER_SCROLL_THRESHOLD: 100,
  /** Animation durations in milliseconds */
  ANIMATION: {
    FAST: 150,
    NORMAL: 200,
    SLOW: 300,
  },
  /** Form submission feedback duration */
  FORM_SUCCESS_TIMEOUT: 3000,
} as const;

// ============================================================================
// Pricing Configuration
// ============================================================================

export const PRICING = {
  CURRENCY: 'NPR',
  CURRENCY_LOCALE: 'en-NP',
} as const;

// ============================================================================
// Icons
// ============================================================================

export const ICONS = {
  // Navigation
  HOME: 'heroicons:home-solid',
  CAKE: 'heroicons:cake-solid',
  SPARKLES: 'heroicons:sparkles-solid',
  PHOTO: 'heroicons:photo-solid',
  INFO: 'heroicons:information-circle-solid',
  GIFT: 'heroicons:gift-solid',
  ARROW_RIGHT: 'heroicons:arrow-long-right-20-solid',
  SEARCH: 'heroicons:magnifying-glass-20-solid',
  CLOSE: 'heroicons:x-mark-24-solid',
  MENU: 'heroicons:bars-3-24-solid',
  CHECK: 'heroicons:check-circle-solid',
  MINUS: 'heroicons:minus-20-solid',
  PLUS: 'heroicons:plus-20-solid',

  // Social
  INSTAGRAM: 'mdi:instagram',
  FACEBOOK: 'mdi:facebook',
  WHATSAPP: 'mdi:whatsapp',
} as const;

// ============================================================================
// Validation Constants
// ============================================================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-()]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
} as const;

// ============================================================================
// Type Exports for Constants
// ============================================================================

export type NavLinkType = (typeof NAV_LINKS)[number];
export type IconKey = keyof typeof ICONS;
