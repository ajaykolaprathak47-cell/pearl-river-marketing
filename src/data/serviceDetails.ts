import type { ServiceStatus } from './site';

export interface ServiceDetail {
  id: string;
  name: string;
  status: ServiceStatus;
  summary: string;
  whoFor: string;
  included: string[];
  howItWorks: string[];
  youProvide: string[];
}

export const serviceDetails: ServiceDetail[] = [
  {
    id: 'google-ads',
    name: 'Google Ads management',
    status: 'available',
    summary:
      'Search ads show your business to people at the moment they look for what you offer: "roof repair near me", "homes for sale in Picayune", "emergency plumber". You pay when someone clicks.',
    whoFor:
      'Businesses whose customers search before they buy, especially home services and real estate, where one new job or client covers a lot of ad spend.',
    included: [
      'Account setup or cleanup of your existing account',
      'Keyword research for your services and service area',
      'Search campaigns, ad copy and call ads',
      'Negative keywords to keep out irrelevant searches',
      'Call and form conversion tracking',
      'Ongoing bid, budget and keyword management',
    ],
    howItWorks: [
      'We review your services, margins and service area and agree on what a good lead looks like.',
      'We build campaigns in your account and send them to you for approval.',
      'After launch we check search terms and results regularly and adjust.',
      'You get a monthly report and a short review call.',
    ],
    youProvide: [
      'Admin access to your Google Ads account, or permission to create one in your business name',
      'A payment method on the account for ad spend (billed to you by Google)',
      'Your services, service area, and any offers or details customers should know',
      'Feedback on lead quality, so we can tune toward the inquiries you actually want',
    ],
  },
  {
    id: 'meta-ads',
    name: 'Facebook & Instagram ads',
    status: 'available',
    summary:
      'Meta ads reach people in your area while they scroll Facebook and Instagram, before they are actively searching. They work well for offers, seasonal services, lead forms and staying in front of past website visitors.',
    whoFor:
      'Businesses with a clear offer or visual work to show, and anyone who wants to reach local customers before they start comparing competitors.',
    included: [
      'Business Manager, ad account and Pixel setup or review',
      'Campaign structure and audience planning within platform rules',
      'Ad creative: copy, image and simple video edits from your photos',
      'Instant lead forms or traffic to a landing page',
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
      'Access to your Facebook Page and Meta Business account, or permission to set them up in your name',
      'A payment method for ad spend (billed to you by Meta)',
      'Photos of your real work, team or properties when available',
      'A fast follow-up process for new leads',
    ],
  },
  {
    id: 'landing-pages',
    name: 'Lead generation & landing pages',
    status: 'available',
    summary:
      'A landing page is a single page built for one offer and one action. Sending ad clicks to a focused page, instead of a busy homepage, usually makes it easier for visitors to call or fill out a form.',
    whoFor:
      'Anyone running ads, and businesses whose current website makes it hard to find the phone number or request a quote.',
    included: [
      'Page copy written around one offer',
      'Mobile-first design with click-to-call and a short form',
      'Form delivery to your email or CRM',
      'Conversion tracking connected to your ad accounts',
      'Updates as we learn what visitors respond to',
    ],
    howItWorks: [
      'We agree on the offer, the audience and the action.',
      'We draft the copy and design and send it for your review.',
      'We connect the form and tracking, test them, and publish.',
      'We adjust the page based on real visitor behavior.',
    ],
    youProvide: [
      'Details of your offer, service area, licensing or credentials you want shown',
      'Real photos where possible',
      'Where leads should be delivered (email, CRM, text)',
      'Access to your domain if the page will live on it',
    ],
  },
  {
    id: 'reporting',
    name: 'Tracking & reporting',
    status: 'available',
    summary:
      'Advertising is only useful if you can see what it produced. We set up conversion tracking for calls and forms and report in plain English every month.',
    whoFor:
      'Every client running ads with us, and businesses already running ads who are not sure what they are getting for the money.',
    included: [
      'Call and form conversion tracking',
      'Google Analytics and Google Tag Manager setup or review',
      'Monthly report: spend, inquiries, cost per inquiry and what changed',
      'Short monthly review call',
      'A simple way to mark which leads became customers',
    ],
    howItWorks: [
      'We audit what is tracked today and fix gaps.',
      'We test every conversion before relying on it.',
      'Each month we report the numbers and what we plan to do next.',
    ],
    youProvide: [
      'Access to your website, analytics and ad accounts',
      'Rough feedback on which inquiries turned into business',
    ],
  },
  {
    id: 'websites',
    name: 'Website design & conversion fixes',
    status: 'limited',
    summary:
      'A clear, fast, mobile-friendly website helps visitors trust you and contact you. We build small-business sites and fix existing ones so it is easier to call or request a quote.',
    whoFor:
      'Businesses without a website, or with one that is slow, outdated or hard to use on a phone.',
    included: [
      'Small business websites, typically a few core pages',
      'Contact forms, click-to-call and clear calls to action',
      'Basic on-page SEO: titles, descriptions and page structure',
      'Speed and mobile usability fixes on existing sites',
    ],
    howItWorks: [
      'We review your current site or plan a new one around your services.',
      'We write and design the pages and send them for review.',
      'We launch, test forms and tracking, and hand over access.',
    ],
    youProvide: [
      'Your domain login, or permission to register one in your name',
      'Business details, photos and any existing branding',
      'Timely feedback on drafts',
    ],
  },
  {
    id: 'local-seo',
    name: 'Local SEO & Google Business Profile',
    status: 'limited',
    summary:
      'Your Google Business Profile is often the first thing local customers see in Maps and search. We help set it up correctly and keep your business information consistent online.',
    whoFor:
      'Local businesses that want to show up better in Maps and "near me" searches. Rankings are never guaranteed, and results build over time.',
    included: [
      'Google Business Profile setup, verification help and cleanup',
      'Categories, services, hours and photos',
      'Consistency check of your name, phone and address across major listings',
      'On-page basics for your service and location pages',
      'Guidance on asking real customers for reviews (we never write or buy reviews)',
    ],
    howItWorks: [
      'We review your profile and listings and list what needs fixing.',
      'We make the updates with your approval.',
      'We check in on progress and suggest next steps.',
    ],
    youProvide: [
      'Owner or manager access to your Google Business Profile',
      'Accurate business details and photos',
    ],
  },
];
