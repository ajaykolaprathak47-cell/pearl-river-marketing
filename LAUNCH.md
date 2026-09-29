# Launch checklist: Pearl River Marketing website

Everything that needs you, in order. Items marked **(required)** must be done before you share the site publicly.

## 1. Business details → `src/data/site.ts`

- [ ] **(required)** `site.email`: your business email (e.g. `hello@yourdomain.com`). Turns on email links and adds it to search-engine data.
- [ ] **(required)** `owner.name`: your name as you want clients to see it.
- [ ] `owner.photo` + `owner.photoAlt`: save a square photo as `public/owner.jpg`, then set `photo: '/owner.jpg'` and a short description like `'Jane Doe, owner of Pearl River Marketing'`.
- [ ] `owner.bio`: 2–4 short paragraphs in your own words (why you started, how you work, your connection to the area). Only include facts you're comfortable standing behind.
- [ ] `site.sameAs`: links to your own Facebook and Instagram pages. Recommended: as a social media agency, prospects will look for them.
- [ ] Decide pricing (see section 8). The site intentionally shows no prices until you do.

While the owner fields are empty, the About page shows a neutral "the owner" introduction. When you run the site locally (`npm run dev`), a dashed reminder box on the About page lists what's missing. It never appears on the live site.

## 2. Domain

- [ ] Buy your domain (any registrar, e.g. Namecheap, Cloudflare, Porkbun, or directly in Vercel).
- [ ] Decide on `www.yourdomain.com` or `yourdomain.com` as the main address.

## 3. Resend (form email delivery)

1. Create a free account at https://resend.com.
2. **Domains → Add Domain** → enter your domain → add the DNS records Resend shows (at your registrar) → wait until it shows **Verified**.
3. **API Keys → Create API Key** → permission "Sending access" → copy it (starts with `re_`). Keep it private.

**Testing before your domain is ready:** you can set only `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (using the same email you signed up to Resend with) and leave `CONTACT_FROM_EMAIL` empty. The site then uses Resend's test sender, which only delivers to your own Resend account email. Set `CONTACT_FROM_EMAIL` before launch.

## 4. Deploy to Vercel

1. Put the project on GitHub: create a new **private** repository, then from the project folder:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/pearl-river-marketing.git
   git push -u origin main
   ```
2. At https://vercel.com → **Add New… → Project** → import the repository. Vercel detects Astro automatically; leave the build settings as they are.
3. Before clicking Deploy, open **Environment Variables** and add:

   | Name | Value |
   | --- | --- |
   | `PUBLIC_SITE_URL` | `https://www.yourdomain.com` (your real address, no trailing slash) |
   | `RESEND_API_KEY` | your Resend key |
   | `CONTACT_TO_EMAIL` | the inbox that should receive requests |
   | `CONTACT_FROM_EMAIL` | `Pearl River Marketing <forms@yourdomain.com>` (verified domain) |

4. Click **Deploy**.
5. **Settings → Domains** → add your domain → add the DNS records Vercel shows at your registrar → wait for the check marks.
6. If you change any environment variable later, go to **Deployments → ⋯ → Redeploy** so it takes effect.

## 5. Test the live site

- [ ] **(required)** Submit the consultation form on the live site with your own details. Confirm the email arrives, and that hitting **Reply** addresses the sender.
- [ ] Check the email isn't in spam. If it is, confirm the Resend domain shows Verified.
- [ ] Tap the phone number on your phone: it should open the dialer.
- [ ] Open `https://yourdomain.com/sitemap-index.xml` and `/robots.txt`: both should show your real domain.
- [ ] Paste your homepage link into a Facebook post draft or text message to check the share preview.
- [ ] If anything fails: Vercel → your project → **Logs**, filter for `[consultation]`. Messages say what's wrong without showing your key.

## 6. Legal pages

- [ ] **(required)** Have `/privacy` and `/terms` reviewed (ideally by an attorney). Fill in the bracketed items: last-updated date, retention period, limitation of liability, governing law.
- [ ] Then remove the "Draft for review" notice from each page, remove `noindex` from each page's `<Base … noindex>`, and remove `/privacy` and `/terms` from the sitemap filter in `astro.config.mjs`.

## 7. After launch (recommended)

- [ ] Submit your sitemap in Google Search Console (free).
- [ ] If you ever add analytics (e.g. Google Analytics), update the Privacy Policy first and wire events in `src/lib/analytics.ts`.
- [ ] Replace the demonstration examples with real client work, with written permission, as projects are completed.

## 8. Business decisions still open

The site shows no prices or packages. Decide these, then tell me and I can add a pricing section:
- [ ] Monthly management fee for **Digital Advertising** (and any one-time setup fee).
- [ ] What's in **Social Media Content & Posting**: posts per week or month, platforms (Facebook, Instagram), and price.
- [ ] Whether you offer a discount or bundle when a client uses both services.
- [ ] Contract terms: month-to-month or a minimum term.
- [ ] Whether you'll reply to comments and messages on clients' pages. The site currently says this stays with the client unless agreed otherwise in writing.
