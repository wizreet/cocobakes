/**
 * ═══════════════════════════════════════════════════════════════════════════
 * OFFERS CONFIGURATION - CocoBakes
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This file controls ALL promotional offers and banners on the website.
 * Edit this file to add, modify, or remove seasonal offers.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * HOW TO EDIT OFFERS:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. ADDING A NEW OFFER:
 *    - Copy one of the existing offer objects
 *    - Change the id to a unique value
 *    - Update the title, description, discount, etc.
 *    - Set the startDate and endDate for when the offer should appear
 *
 * 2. EDITING AN EXISTING OFFER:
 *    - Find the offer by its id
 *    - Modify any fields you need
 *    - Save the file
 *
 * 3. REMOVING AN OFFER:
 *    - Set isActive: false, OR
 *    - Delete the entire offer object from the array
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE - Valentine's Day Offer:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * {
 *   id: 'valentines-2026',
 *   emoji: '💕',
 *   title: "Valentine's Special",
 *   shortText: '20% OFF on Heart-Shaped Brownies!',
 *   description: 'Celebrate love with our special heart-shaped brownies...',
 *   discount: '20% OFF',
 *   ctaText: 'Order Now',
 *   startDate: '2026-02-01',
 *   endDate: '2026-02-15',
 *   isActive: true,
 *   highlight: true,
 * }
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BASE_PATH, SOCIAL_URLS, BUSINESS } from '@/constants';

// ============================================================================
// Types
// ============================================================================

export interface Offer {
  /** Unique identifier for the offer */
  id: string;
  /** Emoji to display before the title (optional) */
  emoji?: string;
  /** Short title shown in banner */
  title: string;
  /** Short text for scrolling banner */
  shortText: string;
  /** Full description shown on offers page */
  description: string;
  /** Discount text (e.g., "20% OFF", "Free Delivery") */
  discount?: string;
  /** Call-to-action button text */
  ctaText: string;
  /** Link for CTA (defaults to contact) */
  ctaLink?: string;
  /** Start date (YYYY-MM-DD format) */
  startDate: string;
  /** End date (YYYY-MM-DD format) */
  endDate: string;
  /** Whether offer is currently active */
  isActive: boolean;
  /** Whether to highlight this offer specially */
  highlight?: boolean;
  /** Terms and conditions */
  terms?: string[];
  /** Image URL (optional) */
  image?: string;
}

export interface BannerConfig {
  /** Background color class */
  bgClass: string;
  /** Text color class */
  textClass: string;
  /** Animation speed in seconds */
  scrollSpeed: number;
  /** Whether to show the banner */
  showBanner: boolean;
  /** Pause on hover */
  pauseOnHover: boolean;
}

// ============================================================================
// Banner Configuration
// ============================================================================

/**
 * Configure the scrolling banner appearance
 * - bgClass: Pink background from logo (#e77896)
 * - textClass: Cream text for contrast
 */
export const bannerConfig: BannerConfig = {
  bgClass: 'bg-fill', // Pink from Tailwind config
  textClass: 'text-on-bg-fill', // Cream text
  scrollSpeed: 60, // seconds for one complete scroll (slower for less dizziness)
  showBanner: true,
  pauseOnHover: true,
};

// ============================================================================
// OFFERS - EDIT THIS SECTION
// ============================================================================

/**
 * 📌 MAIN OFFERS ARRAY
 * Add, edit, or remove offers here.
 * Offers outside their date range won't show automatically.
 */
export const offers: Offer[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // 💕 VALENTINE'S DAY OFFER (February 1-15)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'valentines-2026',
    emoji: '💕',
    title: "Valentine's Special",
    shortText: '20% OFF on Heart-Shaped Brownies!',
    description: `Celebrate love with our special heart-shaped brownies! Made with premium Belgian chocolate and decorated with love, these brownies are perfect for your Valentine.

Each brownie is handcrafted with care and can be customized with your personal message. Available in boxes of 4, 6, or 12.`,
    discount: '20% OFF',
    ctaText: 'View Details',
    ctaLink: `${BASE_PATH}offers`,
    startDate: '2026-02-01',
    endDate: '2026-02-15',
    isActive: true,
    highlight: true,
    image: '/images/offers/valentines-special.jpg',
    terms: [
      'Valid from February 1-15, 2026',
      'Minimum order: Box of 4 brownies',
      'Pre-order 24 hours in advance',
      'Delivery available in Lalitpur',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🎉 GRAND OPENING OFFER (Always Active - Set dates as needed)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'grand-opening-2026',
    emoji: '🎉',
    title: 'Grand Opening Special',
    shortText: 'Free Delivery on Orders Above Rs. 500!',
    description: `To celebrate our opening, we're offering FREE DELIVERY on all orders above Rs. 500!

Whether you're craving our signature fudge brownies or want to try our new seasonal flavors, now is the perfect time to order.`,
    discount: 'FREE DELIVERY',
    ctaText: 'View Details',
    ctaLink: `${BASE_PATH}offers`,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    highlight: false,
    image: '/images/offers/grand-opening.jpg',
    terms: [
      'Minimum order: Rs. 500',
      'Valid for Lalitpur deliveries',
      'Cannot be combined with other offers',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🍫 BROWNIE BUNDLE OFFER
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'brownie-bundle-2026',
    emoji: '🍫',
    title: 'Brownie Bundle Deal',
    shortText: 'Buy 6, Get 1 FREE!',
    description: `Get more brownies for less! Order any 6 brownies and get 1 absolutely FREE.

Mix and match from our entire selection including:
- Classic Fudge Brownie
- Walnut Crunch Brownie
- Salted Caramel Brownie
- Dark Chocolate Brownie
- White Chocolate Brownie`,
    discount: 'BUY 6 GET 1 FREE',
    ctaText: 'View Details',
    ctaLink: `${BASE_PATH}offers`,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    highlight: false,
    image: '/images/offers/brownie-bundle.jpg',
    terms: [
      'Mix and match any flavors',
      'Free brownie of equal or lesser value',
      'Valid for pickup and delivery',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 📝 TEMPLATE - Copy this for new offers
  // ══════════════════════════════════════════════════════════════════════════
  // {
  //   id: 'offer-template',
  //   emoji: '🎁',
  //   title: 'Offer Title',
  //   shortText: 'Short text for banner',
  //   description: 'Full description for offers page...',
  //   discount: 'XX% OFF',
  //   ctaText: 'Order Now',
  //   ctaLink: SOCIAL_URLS.WHATSAPP,
  //   startDate: '2026-01-01',
  //   endDate: '2026-01-31',
  //   isActive: false,
  //   highlight: false,
  //   terms: ['Term 1', 'Term 2'],
  // },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if an offer is currently valid (within date range)
 */
export function isOfferValid(offer: Offer): boolean {
  if (!offer.isActive) return false;

  const now = new Date();
  const start = new Date(offer.startDate);
  const end = new Date(offer.endDate);

  // Set end date to end of day
  end.setHours(23, 59, 59, 999);

  return now >= start && now <= end;
}

/**
 * Get all currently active and valid offers
 */
export function getActiveOffers(): Offer[] {
  return offers.filter(isOfferValid);
}

/**
 * Get highlighted offers (for special display)
 */
export function getHighlightedOffers(): Offer[] {
  return getActiveOffers().filter((offer) => offer.highlight);
}

/**
 * Get offers for the scrolling banner
 */
export function getBannerOffers(): Offer[] {
  return getActiveOffers();
}

/**
 * Get a specific offer by ID
 */
export function getOfferById(id: string): Offer | undefined {
  return offers.find((offer) => offer.id === id);
}

/**
 * Check if any offers are currently active
 */
export function hasActiveOffers(): boolean {
  return getActiveOffers().length > 0;
}

// ============================================================================
// Contact Information for Offers
// ============================================================================

export const offerContact = {
  whatsapp: SOCIAL_URLS.WHATSAPP,
  phone: BUSINESS.PHONE,
  instagram: SOCIAL_URLS.INSTAGRAM_DM,
  message: `Hi! I'm interested in your offer: `,
};

export default offers;
