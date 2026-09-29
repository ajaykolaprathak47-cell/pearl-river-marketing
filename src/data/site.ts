/**
 * Single source of truth for business facts shown on the site and in structured data.
 *
 * Only put VERIFIED facts here. Anything set to null is intentionally left out of the
 * page, the footer and the structured data until the owner supplies it.
 * See LAUNCH.md for the list of details still needed.
 */
export const site = {
  name: 'Pearl River Marketing',
  tagline: 'Turn Attention Into Growth.',
  description:
    'Pearl River Marketing is a hands-on marketing agency in Picayune, Mississippi. We build websites, run Google and Facebook ads, and set up local search for small businesses and real estate professionals in Pearl River County and South Mississippi.',
  city: 'Picayune',
  county: 'Pearl River County',
  region: 'MS',
  regionName: 'Mississippi',
  serviceArea: 'Picayune, Pearl River County and surrounding South Mississippi communities',

  // Supplied by the owner (business card). Displayed and linked.
  phone: {
    display: '228-209-2431',
    e164: '+12282092431',
  },

  // TO SUPPLY: business email. When set, mailto links and the schema "email" field
  // turn on automatically. Example: 'hello@yourdomain.com'
  email: null as string | null,

  // Leave null unless you want a public street address. Never invent one.
  streetAddress: null as string | null,

  // TO SUPPLY (optional): social profiles, e.g. 'https://www.facebook.com/...'
  sameAs: [] as string[],
};

/**
 * TO SUPPLY: owner details for the About page.
 * While `name` is null, the About page shows a neutral "the owner" introduction
 * (and, in local development only, a reminder box listing what to add).
 * For `photo`, put the image in /public (e.g. /public/owner.jpg) and set '/owner.jpg'.
 */
export const owner = {
  name: null as string | null,
  title: 'Owner',
  photo: null as string | null,
  photoAlt: null as string | null,
  /** 2–4 short paragraphs in your own words. */
  bio: [] as string[],
};

/** Calls to action. Change the wording here and it updates everywhere. */
export const cta = {
  primary: 'Get a Free Consultation',
  website: 'Request a Website Quote',
} as const;

export type ServiceStatus = 'available' | 'limited';

export interface Service {
  id: string;
  name: string;
  short: string;
  status: ServiceStatus;
  ctaLabel: string;
}

/**
 * Services shown on the home page, services page, footer and contact form.
 * Set `status: 'limited'` on anything you are not ready to take on yet; it will
 * show a "Limited availability" badge instead of being presented as fully open.
 */
export const services: Service[] = [
  {
    id: 'websites',
    name: 'Website design',
    short: 'Clear, fast, mobile-friendly websites that make it easy for customers to call you or request a quote.',
    status: 'available',
    ctaLabel: cta.website,
  },
  {
    id: 'google-ads',
    name: 'Google Ads management',
    short: 'Search ads that put you in front of local people already looking for what you do.',
    status: 'available',
    ctaLabel: cta.primary,
  },
  {
    id: 'meta-ads',
    name: 'Facebook & Instagram ads',
    short: 'Ads and creative that reach people in your area while they scroll, for offers, seasons and listings.',
    status: 'available',
    ctaLabel: cta.primary,
  },
  {
    id: 'local-seo',
    name: 'Local SEO & Google Business Profile',
    short: 'Profile setup and cleanup so you show up correctly in Google Maps and local searches.',
    status: 'available',
    ctaLabel: cta.primary,
  },
  {
    id: 'landing-pages',
    name: 'Landing pages & lead capture',
    short: 'Focused pages built for one offer, with forms and click-to-call, so ad clicks turn into inquiries.',
    status: 'available',
    ctaLabel: cta.primary,
  },
  {
    id: 'reporting',
    name: 'Tracking & reporting',
    short: 'Call and form tracking, plus a plain-English monthly report on what your marketing produced.',
    status: 'available',
    ctaLabel: cta.primary,
  },
];

export const statusLabel: Record<ServiceStatus, string> = {
  available: 'Available now',
  limited: 'Limited availability',
};

export const nav = [
  { href: '/services', label: 'Services' },
  { href: '/real-estate-marketing', label: 'Real Estate' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
