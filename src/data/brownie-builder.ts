// Brownie Builder Configuration & Pricing

export interface BuilderOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface BuilderCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  maxSelections: number;
  options: BuilderOption[];
}

// Base options
export const bases: BuilderCategory = {
  id: 'base',
  name: 'Choose Your Base',
  description: 'Start with your favorite brownie base',
  required: true,
  maxSelections: 1,
  options: [
    { id: 'classic', name: 'Classic Fudge Brownie', price: 150, description: 'Rich, dense chocolate brownie' },
    { id: 'walnut', name: 'Walnut Brownie', price: 180, description: 'Classic brownie with crunchy walnuts' },
    { id: 'blondie', name: 'Blondie', price: 140, description: 'Vanilla-based butterscotch brownie' },
    { id: 'cheesecake', name: 'Cheesecake Brownie', price: 200, description: 'Swirled cream cheese layer' },
    { id: 'redvelvet', name: 'Red Velvet Brownie', price: 190, description: 'Velvety red with cream cheese' },
  ],
};

// Toppings
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
};

// Extras
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
};

// Quantity options
export const quantityOptions = {
  min: 1,
  max: 24,
  presets: [
    { quantity: 4, label: 'Box of 4', discount: 0 },
    { quantity: 6, label: 'Box of 6', discount: 5 },
    { quantity: 12, label: 'Dozen', discount: 10 },
    { quantity: 24, label: 'Party Pack (24)', discount: 15 },
  ],
};

// All categories
export const builderCategories: BuilderCategory[] = [bases, toppings, extras];

// Helper to format price in NPR
export const formatPrice = (price: number): string => {
  return `NPR ${price.toLocaleString('en-NP')}`;
};

export default {
  bases,
  toppings,
  extras,
  quantityOptions,
  builderCategories,
  formatPrice,
};
