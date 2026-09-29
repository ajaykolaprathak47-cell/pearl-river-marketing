# Pearl River Marketing website

Marketing site for Pearl River Marketing (Picayune, MS), a digital marketing agency with exactly two services: digital advertising (Facebook & Instagram) and social media content creation & posting. Built with [Astro](https://astro.build): every page is static HTML, and one serverless function (`/api/consultation`) handles the consultation form on Vercel.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, problems, the two services, who we help, why us, 3 steps, demo plan, FAQ |
| `/services` | The two core services (Digital Advertising; Social Media Content Creation & Posting): problem, what's included, who it's for, how it works, what we need, notes, quote button |
| `/real-estate-marketing` | An example of how the two services work for real estate agents (not a separate service), demo listing plan, Fair Housing rules |
| `/about` | Owner card (fills in from `owner` in `site.ts`) and how we work |
| `/contact` | Consultation form: validation, spam protection, duplicate-send protection, success and error states |
| `/privacy`, `/terms` | **Drafts**, marked noindex and left out of the sitemap until reviewed |
| `/404` | Not-found page |

`docs/legacy-single-page.html` is the earlier one-page version, kept for reference.

Step-by-step launch instructions: **LAUNCH.md**.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # unit tests for form validation and submission
npm run check    # Astro + TypeScript type-check
npm run build    # production build (outputs .vercel/output for Vercel)
```

## Business facts

All business details live in `src/data/site.ts`. Only verified facts go there; `null` fields are left off the site and out of the structured data. See **LAUNCH.md** for the full list of what to fill in.

- `site.email`: business inbox (turns on mailto links and schema email)
- `owner`: name, photo, bio for the About page
- `site.sameAs`: social profile URLs
- `cta`: button wording, changed once for the whole site
- `services`: the two core services. Their ids also drive the contact form options (see `SERVICE_OPTIONS` in `src/lib/consultation.ts`; a test checks the two stay in sync)

Never add a street address, hours, ratings or coordinates unless they are real.

## Environment variables

See `.env.example`. Set these in Vercel (Project → Settings → Environment Variables):

| Variable | Needed for |
| --- | --- |
| `PUBLIC_SITE_URL` | Canonical URLs, Open Graph, sitemap (your real domain) |
| `RESEND_API_KEY` | Sending form submissions by email |
| `CONTACT_TO_EMAIL` | Inbox that receives requests |
| `CONTACT_FROM_EMAIL` | Sender on a domain verified in Resend (if empty, Resend's test sender is used, which only delivers to your Resend account email) |

The production domain is set **only** in `PUBLIC_SITE_URL`. Until `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set, the form shows a clear "online requests aren't switched on yet, please call" message. Nothing is faked or silently dropped. Each form view sends a unique id as a Resend `Idempotency-Key`, so a retried submission can't create a duplicate email.

## Analytics

None installed, and no cookies are set. Buttons and links carry `data-track` attributes, and `src/lib/analytics.ts` is the single place to wire up a tool later. Update the Privacy Policy and add consent handling first. Never send form contents to analytics.
