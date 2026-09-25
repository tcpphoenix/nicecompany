import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL / BASE_PATH can be overridden at build time until the real domain exists.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://nisekompani.ge',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
