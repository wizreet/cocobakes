import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://wizreet.github.io',
  base: '/cocobakes',
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
