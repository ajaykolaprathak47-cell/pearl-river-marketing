import { services, type Service } from './site';

export interface ServiceDetail extends Service {
  problem: string;
  summary: string;
  whoFor: string;
  included: string[];
  howItWorks: string[];
  youProvide: string[];
}

type DetailFields = Omit<ServiceDetail, keyof Service>;

const details: Record<string, DetailFields> = {
  websites: {
    problem:
      "Customers check your website before they call. If it's outdated, slow on a phone, or hides your number, many of them move on to the next result.",
    summary:
      'We design and build clear, fast small-business websites, or fix the one you have, so visitors quickly understand what you do, trust you, and can call or request a quote in a tap.',
    whoFor:
      "Contractors, home-service companies, real estate agents and other local businesses with no website, an outdated one, or a site that doesn't bring in calls.",
    included: [
      'Pages for your services, service area, about and contact',
      'Mobile-first design with click-to-call and a short quote-request form',
      'Written copy based on what you tell us about your business',
      'Page titles, descriptions and structure that help local search',
      'Form delivery to your email, and basic call and form tracking',
      'Help connecting your domain, with the site set up in your name',
    ],
    howItWorks: [
      'We talk through your services, customers and what you want the site to do.',
      'We send a written quote with the pages, timeline and cost.',
      'We write and design the pages and send them for your review and changes.',
      'We launch, test every form and link, and hand over access.',
    ],
    youProvide: [
      'Your services, service area and any licensing or warranty details you want shown',
      'Photos of your real work, team or properties (phone photos are fine to start)',
      'Your logo, if you have one',
      'Access to your domain, or permission to register one in your business name',
      'Feedback on drafts so we can finish on schedule',
    ],
  },
  'google-ads': {
    problem:
      "People search Google when they need a roofer, a plumber or a home in a specific town. If you don't appear, those calls go to a competitor.",
    summary:
      'Search ads show your business to people at the moment they look for what you offer, such as "roof repair near me" or "homes for sale in Picayune". You pay when someone clicks.',
    whoFor:
      'Businesses whose customers search before they buy, especially home services and real estate, where one new job or client can cover a lot of ad spend.',
    included: [
      'Account setup, or a cleanup of your existing account',
      'Keyword research for your services and service area',
      'Search campaigns, ad copy and call ads',
      'Negative keywords to keep out irrelevant searches',
      'Call and form conversion tracking',
      'Ongoing budget, bid and keyword management',
    ],
    howItWorks: [
      'We review your services, margins and service area and agree on what a good lead looks like.',
      'We build campaigns in your account and send them for your approval.',
      'After launch we review search terms and results regularly and adjust.',
      'You get a monthly report and a short review call.',
    ],
    youProvide: [
      'Admin access to your Google Ads account, or permission to create one in your business name',
      'A payment method on the account for ad spend (billed to you by Google)',
      'Your services, service area, and any offers customers should know about',
      'Feedback on lead quality, so we can tune toward the inquiries you actually want',
    ],
  },
  'meta-ads': {
    problem:
      "Plenty of people who will need your service soon aren't searching yet. Facebook and Instagram let you get in front of them in your area first.",
    summary:
      'Meta ads reach people nearby while they scroll. They work well for seasonal offers, new listings, open houses, lead forms and staying in front of people who already visited your website.',
    whoFor:
      'Businesses with a clear offer or visual work to show, and real estate professionals promoting listings or home valuations.',
    included: [
      'Business Manager, ad account and Pixel setup or review',
      'Campaign structure and audience planning within platform rules',
      'Ad creative: copy, images and simple video edits from your photos',
      'Instant lead forms, or traffic to a landing page',
      'Retargeting of website visitors and page engagers',
      'Creative testing and refreshes to keep costs in check',
    ],
    howItWorks: [
      'We agree on the offer and the action we want people to take.',
      'We prepare ads and audiences and send them for your approval.',
      'We launch, watch cost per lead and lead quality, and rotate creative.',
      'You get a monthly report and a review call.',
    ],
    youProvide: [
      'Access to your Facebook Page and Meta business account, or permission to set them up in your name',
      'A payment method for ad spend (billed to you by Meta)',
      'Photos of your real work, team or properties when available',
      'A quick follow-up process for new leads',
    ],
  },
  'local-seo': {
    problem:
      'When someone searches "near me", Google Maps results often come first. A missing or incomplete Google Business Profile means fewer people see you there.',
    summary:
      'We set up or clean up your Google Business Profile and make sure your business details are correct and consistent, so you show up properly in Maps and local search. Rankings build over time and are never guaranteed.',
    whoFor:
      'Local businesses that want to be found in Google Maps and local searches, especially those with an incomplete or unclaimed profile.',
    included: [
      'Google Business Profile setup, verification help and cleanup',
      'Categories, services, service area, hours and photos',
      'A consistency check of your name and phone number across major listings',
      'On-page basics for your website\'s service pages',
      "A simple plan for asking real customers for reviews (we never write or buy reviews)",
    ],
    howItWorks: [
      'We review your profile and listings and list what needs fixing.',
      'We make the updates with your approval.',
      'We check in on progress and suggest next steps.',
    ],
    youProvide: [
      'Owner or manager access to your Google Business Profile, or help verifying a new one',
      'Accurate business details and a few good photos',
    ],
  },
  'landing-pages': {
    problem:
      'Sending ad clicks to a busy homepage wastes money. Visitors have to hunt for what they came for, and many leave.',
    summary:
      'A landing page is a single page built for one offer and one action, like "request a free estimate" or "get your home value". It gives ad visitors a clear next step.',
    whoFor:
      'Anyone running ads, and real estate agents promoting a specific listing, open house or home valuation offer.',
    included: [
      'Page copy written around one offer',
      'Mobile-first design with click-to-call and a short form',
      'Form delivery to your email or CRM',
      'Conversion tracking connected to your ad accounts',
      'Adjustments as we learn what visitors respond to',
    ],
    howItWorks: [
      'We agree on the offer, the audience and the action.',
      'We draft the copy and design and send it for your review.',
      'We connect the form and tracking, test them, and publish.',
      'We adjust the page based on how real visitors use it.',
    ],
    youProvide: [
      'Details of your offer and anything you want customers to know',
      'Real photos where possible',
      'Where leads should be delivered (email, CRM or text)',
      'Access to your domain if the page will live on it',
    ],
  },
  reporting: {
    problem:
      "Many business owners have paid for ads before and still can't say what they got for the money.",
    summary:
      'We set up tracking for calls and form submissions and report in plain English every month, so you can see what your website and ads actually produced.',
    whoFor:
      "Every client running ads with us, and businesses already running ads who aren't sure what they're getting.",
    included: [
      'Call and form conversion tracking',
      'Google Analytics and Google Tag Manager setup or review',
      'Monthly report: spend, inquiries, cost per inquiry and what changed',
      'A short monthly review call',
      'A simple way to note which leads became customers',
    ],
    howItWorks: [
      "We check what's tracked today and fix the gaps.",
      'We test every conversion before relying on it.',
      'Each month we report the numbers and what we plan to do next.',
    ],
    youProvide: [
      'Access to your website, analytics and ad accounts',
      'Rough feedback on which inquiries turned into business',
    ],
  },
};

export const serviceDetails: ServiceDetail[] = services.map((s) => {
  const d = details[s.id];
  if (!d) throw new Error(`Missing service details for "${s.id}" in src/data/serviceDetails.ts`);
  return { ...s, ...d };
});
