/**
 * Brownie Builder Configuration & Pricing
 * Type-safe configuration for the custom brownie builder feature
 */

import { formatPrice as formatPriceUtil } from '@/utils';
import type { BuilderOption, BuilderCategory, QuantityOptions } from '@/types';

// ============================================================================
// Base Options
// ============================================================================

export const bases: BuilderCategory = {
  id: 'base',
  name: 'Choose Your Base',
  description: 'Start with your favorite brownie base',
  required: true,
  maxSelections: 1,
  options: [
    {
      id: 'classic',
      name: 'Classic Fudge Brownie',
      price: 150,
      description: 'Rich, dense chocolate brownie',
    },
    {
      id: 'walnut',
      name: 'Walnut Brownie',
      price: 180,
      description: 'Classic brownie with crunchy walnuts',
    },
    {
      id: 'blondie',
      name: 'Blondie',
      price: 140,
      description: 'Vanilla-based butterscotch brownie',
    },
    {
      id: 'cheesecake',
      name: 'Cheesecake Brownie',
      price: 200,
      description: 'Swirled cream cheese layer',
    },
    {
      id: 'redvelvet',
      name: 'Red Velvet Brownie',
      price: 190,
      description: 'Velvety red with cream cheese',
    },
  ],
} as const;

// ============================================================================
// Toppings
// ============================================================================

export const toppings: BuilderCategory = {
  id: 'toppings',
  name: 'Add Toppings',
  description: 'Choose up to 3 toppings',
  required: false,
  maxSelections: 3,
  options: [
    { id: 'chocochips', name: 'Chocolate Chips', price: 30 },
    { id: 'caramel', name: 'Caramel Drizzle', price: 40 },
    { id: 'seaSalt', name: 'Sea Salt Flakes', price: 20 },
    { id: 'oreo', name: 'Oreo Crumble', price: 35 },
    { id: 'nutella', name: 'Nutella Swirl', price: 50 },
    { id: 'peanutButter', name: 'Peanut Butter Drizzle', price: 45 },
    { id: 'coconut', name: 'Toasted Coconut', price: 25 },
    { id: 'sprinkles', name: 'Rainbow Sprinkles', price: 20 },
  ],
} as const;

// ============================================================================
// Extras
// ============================================================================

export const extras: BuilderCategory = {
  id: 'extras',
  name: 'Special Add-ons',
  description: 'Make it extra special (max 2)',
  required: false,
  maxSelections: 2,
  options: [
    { id: 'icecream', name: 'Vanilla Ice Cream Scoop', price: 80 },
    { id: 'whippedcream', name: 'Whipped Cream', price: 40 },
    { id: 'hotfudge', name: 'Hot Fudge Sauce', price: 50 },
    { id: 'berries', name: 'Fresh Berries', price: 70 },
    { id: 'giftbox', name: 'Gift Box Packaging', price: 100 },
  ],
} as const;

// ============================================================================
// Quantity Options
// ============================================================================

export const quantityOptions: QuantityOptions = {
  min: 1,
  max: 24,
  presets: [
    { quantity: 4, label: 'Box of 4', discount: 0 },
    { quantity: 6, label: 'Box of 6', discount: 5 },
    { quantity: 12, label: 'Dozen', discount: 10 },
    { quantity: 24, label: 'Party Pack (24)', discount: 15 },
  ],
} as const;

// ============================================================================
// All Categories
// ============================================================================

export const builderCategories: readonly BuilderCategory[] = [
  bases,
  toppings,
  extras,
];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format price in NPR currency
 * @deprecated Use formatPrice from @/utils instead
 */
export const formatPrice = formatPriceUtil;

// ============================================================================
// Type Re-exports for convenience
// ============================================================================

export type { BuilderOption, BuilderCategory, QuantityOptions };

// ============================================================================
// Default Export
// ============================================================================

export default {
  bases,
  toppings,
  extras,
  quantityOptions,
  builderCategories,
  formatPrice,
} as const;
