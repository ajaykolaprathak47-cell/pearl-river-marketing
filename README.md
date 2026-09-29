# Pearl River Marketing website

Marketing site for Pearl River Marketing (Picayune, MS). Built with [Astro](https://astro.build): every page is static HTML, and one serverless function (`/api/consultation`) handles the consultation form on Vercel.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, audiences, services, Discover/Build/Optimize, local partner, sample campaign plan, FAQ |
| `/services` | One section per service: who it's for, what's included, how it works, what the client provides |
| `/real-estate-marketing` | Brokerage/agent page with Fair Housing and housing-ad rules |
| `/about` | Agency intro (owner details are placeholders) |
| `/contact` | Consultation form with validation, spam protection, success and error states |
| `/privacy`, `/terms` | **Drafts**, marked noindex and left out of the sitemap until reviewed |
| `/404` | Not-found page |

`docs/legacy-single-page.html` is the earlier one-page version, kept for reference.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # unit tests for form validation and submission
npm run check    # Astro + TypeScript type-check
npm run build    # production build (outputs .vercel/output for Vercel)
```

## Business facts

All business details live in `src/data/site.ts`. Only verified facts go there; `null` fields are left off the site and out of the structured data. Update:

- `email` – business inbox (turns on mailto links and schema email)
- `ownerName` – shows on the About page and removes the placeholder note
- `sameAs` – social profile URLs
- `services[].status` – switch "limited" services to "available" when ready

Never add a street address, hours, ratings or coordinates unless they are real.

## Environment variables

See `.env.example`. Set these in Vercel (Project → Settings → Environment Variables):

| Variable | Needed for |
| --- | --- |
| `PUBLIC_SITE_URL` | Canonical URLs, Open Graph, sitemap (your real domain) |
| `RESEND_API_KEY` | Sending form submissions by email |
| `CONTACT_TO_EMAIL` | Inbox that receives requests |
| `CONTACT_FROM_EMAIL` | Sender on a domain verified in Resend |

Until the three email variables are set, the form returns a clear "online requests are not switched on yet, please call" message. Nothing is faked or silently dropped.

## Analytics

None installed, and no cookies are set. Buttons and links carry `data-track` attributes, and `src/lib/analytics.ts` is the single place to wire up a tool later. Update the Privacy Policy and add consent handling first. Never send form contents to analytics.
