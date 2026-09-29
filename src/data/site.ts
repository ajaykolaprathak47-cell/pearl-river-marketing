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
    'Pearl River Marketing is a local digital marketing agency in Picayune, Mississippi. We run Facebook and Instagram advertising and create and post social media content for small businesses in Pearl River County and South Mississippi.',
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

  // TO SUPPLY (optional): your own Facebook and Instagram pages,
  // e.g. 'https://www.facebook.com/...'. Recommended for a social media agency.
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
  short: 'Free Consultation',
  secondary: 'Explore Our Services',
} as const;

export type ServiceStatus = 'available' | 'limited';

export interface Service {
  id: string;
  name: string;
  /** One-line summary for cards. */
  short: string;
  /** Short list for home page cards. */
  highlights: string[];
  status: ServiceStatus;
  ctaLabel: string;
}

/**
 * The agency's two core services. These drive the home page, services page,
 * footer, structured data and the contact form's options.
 */
export const services: Service[] = [
  {
    id: 'advertising',
    name: 'Digital Advertising',
    short: 'Facebook and Instagram ad campaigns that put your business in front of potential customers in your area.',
    highlights: [
      'Campaign setup and audience targeting',
      'Ad images, graphics and copy',
      'Ongoing monitoring and optimization',
      'Plain-English performance reports',
    ],
    status: 'available',
    ctaLabel: 'Request an Advertising Quote',
  },
  {
    id: 'social-media',
    name: 'Social Media Content Creation & Posting',
    short: 'Professional posts, created and published on a consistent schedule, so your business stays visible on Facebook and Instagram.',
    highlights: [
      'Branded graphics and captions',
      'Promotional posts for services and offers',
      'A monthly content calendar',
      'Scheduling and publishing approved posts',
    ],
    status: 'available',
    ctaLabel: 'Request a Social Media Quote',
  },
];

export const statusLabel: Record<ServiceStatus, string> = {
  available: 'Available now',
  limited: 'Limited availability',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

/** The real estate page applies the two services to agents. Linked from Services and the footer, not the main menu. */
export const realEstateLink = { href: '/real-estate-marketing', label: 'For Real Estate Agents' };
