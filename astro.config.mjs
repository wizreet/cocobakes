import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/astro-bakery',
  integrations: [
    tailwind(),
    react(),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
});
