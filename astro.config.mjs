// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// The production domain is not confirmed yet. Set PUBLIC_SITE_URL in Vercel
// (e.g. https://www.yourdomain.com) so canonical URLs, Open Graph URLs and the
// sitemap point at the real domain.
const site = process.env.PUBLIC_SITE_URL || 'https://pearl-river-marketing.vercel.app';

export default defineConfig({
  site,
  // Every page is prerendered to static HTML. Only /api/consultation runs on demand.
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  integrations: [
    sitemap({
      // 404 is never listed. Privacy and Terms are drafts marked noindex; remove
      // them from this list (and the noindex prop) once they are finalized.
      filter: (page) => !['/404', '/privacy', '/terms'].some((p) => new URL(page).pathname.startsWith(p)),
    }),
  ],
});
