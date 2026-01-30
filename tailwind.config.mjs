import { fontFamily } from 'tailwindcss/defaultTheme';

/**
 * Tailwind CSS Configuration
 * Optimized for CocoBakes brand with performance considerations
 *
 * @see https://tailwindcss.com/docs/configuration
 */

// ============================================================================
// Typography Scale
// ============================================================================

const FONT_SIZE = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
};

const LINE_HEIGHT = {
  heading: 1.25,
  body: 1.6,
};

// ============================================================================
// CocoBakes Brand Colors
// ============================================================================

/**
 * Brand Color Palette:
 * - Cream (#fafad6): Primary background - warm, inviting
 * - Pink (#e77896): Accent/Brand color - playful, sweet
 * - Dark Brown (#684339): Primary text/Brand - rich, chocolatey
 * - Light Brown (#c59775): Secondary elements - caramel, warm
 */

const BRAND_COLOR = '13deg 29% 32%'; // Dark Brown #684339
const BRAND_HOVER_COLOR = '26deg 41% 62%'; // Light Brown #c59775
const BG_COLOR = '60deg 78% 91%'; // Cream #fafad6
const FILL_COLOR = '344deg 70% 69%'; // Pink #e77896
const FILL_HOVER_COLOR = '13deg 29% 32%'; // Dark Brown #684339

// ============================================================================
// Design Tokens
// ============================================================================

const SHADOW = '0 0 1rem 0';

// Noise textures for brand aesthetic (optimized SVGs)
const NOISE_URL_DENSE =
  "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

const NOISE_URL_LOOSE =
  "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

// ============================================================================
// Configuration Export
// ============================================================================

/** @type {import('tailwindcss').Config} */
export default {
  // Content paths for tree-shaking unused styles
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

  // Enable JIT mode features (default in Tailwind v3)
  // safelist: [], // Add classes that might be dynamically generated

  theme: {
    // ========================================================================
    // Typography
    // ========================================================================
    fontFamily: {
      primary: ['Fredoka', ...fontFamily.sans],
      secondary: ['Fredoka', ...fontFamily.sans],
      brand: ['Dancing Script', ...fontFamily.serif],
    },
    fontWeight: {
      regular: 400,
      bold: 700,
    },
    fontSize: {
      ...FONT_SIZE,
      // Semantic font sizes with line heights
      'body-xs': [FONT_SIZE['xs'], LINE_HEIGHT['body']],
      'body-sm': [FONT_SIZE['sm'], LINE_HEIGHT['body']],
      'body-md': [FONT_SIZE['md'], LINE_HEIGHT['body']],
      'body-lg': [FONT_SIZE['lg'], LINE_HEIGHT['body']],
      'body-xl': [FONT_SIZE['xl'], LINE_HEIGHT['body']],
      'heading-xl': [FONT_SIZE['xl'], LINE_HEIGHT['heading']],
      'heading-2xl': [FONT_SIZE['2xl'], LINE_HEIGHT['heading']],
      'heading-3xl': [FONT_SIZE['3xl'], LINE_HEIGHT['heading']],
      'heading-4xl': [FONT_SIZE['4xl'], LINE_HEIGHT['heading']],
      'heading-5xl': [FONT_SIZE['5xl'], LINE_HEIGHT['heading']],
      'heading-6xl': [FONT_SIZE['6xl'], LINE_HEIGHT['heading']],
    },
    lineHeight: LINE_HEIGHT,

    // ========================================================================
    // Colors (Optimized for brand consistency)
    // ========================================================================
    colors: {
      bg: `hsl(${BG_COLOR} / <alpha-value>)`,
      white: '#ffffff',
      transparent: 'transparent',
      current: 'currentColor',
    },
    backgroundColor: {
      DEFAULT: `hsl(${BG_COLOR} / <alpha-value>)`,
      surface: 'hsl(60deg 50% 85% / <alpha-value>)', // Slightly darker cream
      fill: `hsl(${FILL_COLOR} / <alpha-value>)`,
      'fill-hover': `hsl(${FILL_HOVER_COLOR} / <alpha-value>)`,
      'fill-brand': `hsl(${BRAND_COLOR} / <alpha-value>)`,
      'fill-brand-hover': `hsl(${BRAND_HOVER_COLOR} / <alpha-value>)`,
    },
    textColor: {
      DEFAULT: 'hsl(13deg 29% 25% / <alpha-value>)', // Darker brown
      secondary: 'hsl(13deg 20% 45% / <alpha-value>)', // Medium brown
      brand: `hsl(${BRAND_COLOR} / <alpha-value>)`,
      'brand-hover': `hsl(${BRAND_HOVER_COLOR} / <alpha-value>)`,
      fill: `hsl(${FILL_COLOR} / <alpha-value>)`,
      'on-bg-fill': 'hsl(60deg 78% 91% / <alpha-value>)', // Cream text
      'on-bg-fill-brand': 'hsl(60deg 78% 91% / <alpha-value>)',
      'on-bg-fill-brand-secondary': `hsl(${BG_COLOR} / <alpha-value>)`,
    },
    borderColor: {
      primary: 'hsl(26deg 41% 72% / <alpha-value>)', // Light brown
      secondary: 'hsl(26deg 41% 80% / <alpha-value>)', // Lighter brown
      brand: `hsl(${BRAND_COLOR} / <alpha-value>)`,
      'brand-hover': `hsl(${BRAND_HOVER_COLOR} / <alpha-value>)`,
      bg: `hsl(${BG_COLOR} / <alpha-value>)`,
    },
    ringColor: {
      brand: `hsl(${BRAND_COLOR} / <alpha-value>)`,
      'brand-hover': `hsl(${BRAND_HOVER_COLOR} / <alpha-value>)`,
      fill: `hsl(${FILL_COLOR} / <alpha-value>)`,
      'fill-hover': `hsl(${FILL_HOVER_COLOR} / <alpha-value>)`,
    },

    // ========================================================================
    // Effects
    // ========================================================================
    boxShadow: {
      'of-bg-surface': `${SHADOW} hsl(26deg 30% 70% / 0.5)`,
      'of-bg-fill': `${SHADOW} hsl(${FILL_COLOR} / 0.15)`,
      'of-bg-fill-brand': `${SHADOW} hsl(${BRAND_COLOR} / 0.15)`,
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      none: '0 0 #0000',
    },
    dropShadow: {
      DEFAULT: '0 0 1rem hsl(45deg 12% 80% / 0.75)',
    },

    // ========================================================================
    // Layout
    // ========================================================================
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        lg: '2rem',
      },
    },

    // ========================================================================
    // Extensions (additional utilities)
    // ========================================================================
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
        '3/4': '3 / 4',
      },
      backgroundImage: {
        'noise-dense': `url("${NOISE_URL_DENSE}")`,
        'noise-loose': `url("${NOISE_URL_LOOSE}")`,
      },
      // Animation utilities for micro-interactions
      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },
      // Scale utilities for hover effects
      scale: {
        102: '1.02',
        103: '1.03',
        98: '0.98',
      },
      // Z-index scale
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
      // Keyframes for animations
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.33%)' },
        },
        'banner-scroll': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.33%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      // Animation utilities
      animation: {
        marquee: 'marquee linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'banner-scroll': 'banner-scroll 60s linear infinite',
        shimmer: 'shimmer 4s ease-in-out infinite',
      },
    },
  },

  // ========================================================================
  // Plugins
  // ========================================================================
  plugins: [
    // Add plugins as needed:
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],

  // ========================================================================
  // Future flags for upcoming features
  // ========================================================================
  future: {
    hoverOnlyWhenSupported: true, // Optimize hover for touch devices
  },
};
