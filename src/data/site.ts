/**
 * Single source of truth for business facts shown on the site and in structured data.
 *
 * Only put VERIFIED facts here. Anything set to null is intentionally left out of the
 * page, the footer and the LocalBusiness schema until the owner supplies it.
 */
export const site = {
  name: 'Pearl River Marketing',
  tagline: 'Turn Attention Into Growth.',
  description:
    'Pearl River Marketing is a hands-on marketing agency in Picayune, Mississippi. We run Google Ads and Meta ads, build lead-focused landing pages, and report clearly on what your budget is doing.',
  city: 'Picayune',
  region: 'MS',
  regionName: 'Mississippi',
  serviceArea: 'Pearl River County and surrounding South Mississippi communities',

  // Supplied by the owner (business card). Displayed and linked.
  phone: {
    display: '228-209-2431',
    e164: '+12282092431',
  },

  // PLACEHOLDER: no business email confirmed yet. When set, mailto links and the
  // schema "email" field turn on automatically.
  email: null as string | null,

  // PLACEHOLDER: no street address supplied. Leave null. Never invent one.
  streetAddress: null as string | null,

  // PLACEHOLDER: social profiles, e.g. 'https://www.facebook.com/...'
  sameAs: [] as string[],

  // PLACEHOLDER: owner's name for the About page. Leave null to show a neutral intro.
  ownerName: null as string | null,
};

export type ServiceStatus = 'available' | 'limited';

export interface Service {
  id: string;
  name: string;
  short: string;
  status: ServiceStatus;
}

/**
 * Service availability.
 * ASSUMPTION for owner review: paid ads, landing pages and reporting are the core
 * offer today. Website builds and local SEO are offered on a limited basis while
 * those services are being developed. Change `status` to 'available' when ready.
 */
export const services: Service[] = [
  {
    id: 'google-ads',
    name: 'Google Ads management',
    short: 'Search campaigns that put your business in front of people already looking for what you do.',
    status: 'available',
  },
  {
    id: 'meta-ads',
    name: 'Facebook & Instagram ads',
    short: 'Meta campaigns and ad creative that reach local customers where they spend their time.',
    status: 'available',
  },
  {
    id: 'landing-pages',
    name: 'Lead generation & landing pages',
    short: 'Focused pages built for one offer and one action, so ad clicks have somewhere good to land.',
    status: 'available',
  },
  {
    id: 'reporting',
    name: 'Tracking & reporting',
    short: 'Conversion tracking and a plain-English monthly report on spend, leads and next steps.',
    status: 'available',
  },
  {
    id: 'websites',
    name: 'Website design & conversion fixes',
    short: 'Clear, fast small-business websites and fixes that make existing sites easier to contact you from.',
    status: 'limited',
  },
  {
    id: 'local-seo',
    name: 'Local SEO & Google Business Profile',
    short: 'Profile setup, cleanup and on-page basics that help you show up in local search and Maps.',
    status: 'limited',
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
