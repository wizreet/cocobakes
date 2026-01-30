/**
 * Menu Items Configuration
 * Full menu with categories, pricing, and product information
 */

import cinnamonRollsImage from '@/assets/cinnamon-rolls.jpg';
import artisanalBreadImage from '@/assets/artisanal-bread.jpg';
import sugarCookiesImage from '@/assets/sugar-cookies.jpg';
import { formatPrice as formatPriceUtil } from '@/utils';
import type { MenuItem as MenuItemType, MenuCategoryInfo } from '@/types';

// Re-export the type for backwards compatibility
export type MenuItem = MenuItemType;

// ============================================================================
// Menu Categories
// ============================================================================

export const menuCategories: readonly MenuCategoryInfo[] = [
  { id: 'all', name: 'All Items' },
  { id: 'signature', name: 'Signature Brownies' },
  { id: 'premium', name: 'Premium Collection' },
  { id: 'specialty', name: 'Specialty Treats' },
  { id: 'seasonal', name: 'Seasonal Specials' },
] as const;

// ============================================================================
// Menu Items
// ============================================================================

const menuItems: readonly MenuItem[] = [
  // Signature Brownies
  {
    id: 'classic-fudge',
    name: 'Classic Fudge Brownie',
    description:
      'Our bestseller! Rich, dense, and irresistibly gooey chocolate brownies made with premium cocoa.',
    price: 150,
    image: cinnamonRollsImage,
    category: 'signature',
    isPopular: true,
  },
  {
    id: 'walnut-crunch',
    name: 'Walnut Crunch Brownie',
    description:
      'Classic fudgy brownies loaded with crunchy roasted walnuts for the perfect texture.',
    price: 180,
    image: artisanalBreadImage,
    category: 'signature',
  },
  {
    id: 'cream-cheese-swirl',
    name: 'Cream Cheese Swirl',
    description: 'Beautiful marbled brownies with a tangy cream cheese swirl.',
    price: 200,
    image: sugarCookiesImage,
    category: 'signature',
    isPopular: true,
  },

  // Premium Collection
  {
    id: 'double-chocolate',
    name: 'Double Chocolate Chunk',
    description:
      'Loaded with dark and white chocolate chunks for ultimate chocolate lovers.',
    price: 220,
    image: cinnamonRollsImage,
    category: 'premium',
  },
  {
    id: 'salted-caramel',
    name: 'Salted Caramel Brownie',
    description:
      'Gooey caramel ribbons with sea salt flakes on rich chocolate base.',
    price: 250,
    image: artisanalBreadImage,
    category: 'premium',
    isPopular: true,
  },
  {
    id: 'nutella-stuffed',
    name: 'Nutella Stuffed Brownie',
    description:
      'Decadent brownies with a molten Nutella center that oozes with every bite.',
    price: 280,
    image: sugarCookiesImage,
    category: 'premium',
    isNew: true,
  },

  // Specialty Treats
  {
    id: 'red-velvet',
    name: 'Red Velvet Brownie',
    description:
      'Stunning red velvet brownies topped with cream cheese frosting.',
    price: 200,
    image: cinnamonRollsImage,
    category: 'specialty',
  },
  {
    id: 'blondie',
    name: 'Classic Blondie',
    description:
      'Buttery vanilla brownies with brown sugar and white chocolate chips.',
    price: 160,
    image: artisanalBreadImage,
    category: 'specialty',
  },
  {
    id: 'peanut-butter',
    name: 'Peanut Butter Swirl',
    description:
      'Chocolate brownies swirled with creamy peanut butter for a perfect combo.',
    price: 190,
    image: sugarCookiesImage,
    category: 'specialty',
  },

  // Seasonal Specials
  {
    id: 'matcha-white-choc',
    name: 'Matcha White Chocolate',
    description:
      'Japanese matcha brownies with white chocolate drizzle. Limited edition!',
    price: 300,
    image: cinnamonRollsImage,
    category: 'seasonal',
    isNew: true,
  },
  {
    id: 'festive-brownie',
    name: 'Festive Brownie Box',
    description: 'Assorted mini brownies perfect for gifting during festivals.',
    price: 500,
    image: artisanalBreadImage,
    category: 'seasonal',
  },
  {
    id: 'brownie-cake',
    name: 'Brownie Layer Cake',
    description:
      'Three layers of brownie with chocolate ganache. Perfect for celebrations!',
    price: 1500,
    image: sugarCookiesImage,
    category: 'seasonal',
    isPopular: true,
  },
] as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format price in NPR currency
 * @deprecated Use formatPrice from @/utils instead
 */
export const formatPrice = formatPriceUtil;

export default menuItems;
