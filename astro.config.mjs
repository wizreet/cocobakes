import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

/**
 * Astro Configuration
 * Optimized for production performance, SEO, and developer experience
 *
 * @see https://docs.astro.build/en/reference/configuration-reference/
 */
export default defineConfig({
  // =========================================================================
  // Site Configuration
  // =========================================================================
  site: 'https://wizreet.github.io',
  base: '/cocobakes/',
  trailingSlash: 'ignore',

  // =========================================================================
  // Build Optimization
  // =========================================================================
  build: {
    // Inline small assets to reduce HTTP requests
    inlineStylesheets: 'auto',
    // Split vendor chunks for better caching
    // assets: '_assets',
  },

  // =========================================================================
  // Vite Configuration (Build Tool)
  // =========================================================================
  vite: {
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Minify output
      minify: 'esbuild',
      // Target modern browsers for smaller bundles
      target: 'es2020',
      // Rollup options for chunking
      rollupOptions: {
        output: {
          // Manual chunk splitting for optimal caching
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['class-variance-authority', '@iconify/react'],
          },
          // Asset file naming with hash for cache busting
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'chunks/[name].[hash].js',
          entryFileNames: 'entries/[name].[hash].js',
        },
      },
      // Report compressed size
      reportCompressedSize: true,
      // Chunk size warning limit
      chunkSizeWarningLimit: 500,
    },
    // Optimize deps
    optimizeDeps: {
      include: ['react', 'react-dom', 'class-variance-authority'],
    },
    // Enable source maps in development only
    css: {
      devSourcemap: true,
    },
  },

  // =========================================================================
  // Prefetch Configuration
  // =========================================================================
  prefetch: {
    // Prefetch links on hover for faster navigation
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  // =========================================================================
  // Integrations
  // =========================================================================
  integrations: [
    tailwind({
      // Apply Tailwind's base styles
      applyBaseStyles: true,
    }),
    react({
      // Include React components
      include: ['**/react/**/*.tsx'],
    }),
  ],

  // =========================================================================
  // Image Configuration
  // =========================================================================
  image: {
    // Disable image optimization for static builds
    // Images are pre-optimized or served as-is
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },

  // =========================================================================
  // Output Configuration
  // =========================================================================
  output: 'static',

  // =========================================================================
  // Compression (handled by hosting provider, but configured here)
  // =========================================================================
  compressHTML: true,
});
