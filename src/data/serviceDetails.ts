import { services, type Service } from './site';

export interface ServiceDetail extends Service {
  problem: string;
  summary: string;
  whoFor: string;
  included: string[];
  howItWorks: string[];
  youProvide: string[];
  /** Important boundaries or cost notes shown with the service. */
  notes: string[];
}

type DetailFields = Omit<ServiceDetail, keyof Service>;

const details: Record<string, DetailFields> = {
  advertising: {
    problem:
      "Posting on your own page only reaches people who already follow you. \"Boosting\" posts without a plan often spends money without reaching the right people or producing inquiries.",
    summary:
      'We create and manage Facebook and Instagram ad campaigns that put your business in front of potential customers in your area, with ads built around a clear offer and a clear next step, like calling, messaging or requesting a quote.',
    whoFor:
      'Local businesses that want to reach new customers nearby: contractors, home-service companies, real estate agents, shops, restaurants and other small businesses in South Mississippi.',
    included: [
      'Campaign setup in your Meta (Facebook and Instagram) ad account',
      'Audience targeting based on your service area and customers, within platform rules',
      'Ad creative: images, graphics and ad copy',
      'Ongoing monitoring, adjustments and creative refreshes',
      'Regular performance reports with plain-English recommendations',
    ],
    howItWorks: [
      'We learn your business, service area, offers and the customers you want more of.',
      'We plan the campaign and create the ads, then send everything for your approval.',
      'After launch we monitor results, adjust targeting and budget, and refresh ads as needed.',
      'You get a clear report on what was spent, what the ads did, and what we recommend next.',
    ],
    youProvide: [
      'Access to your Facebook Page and Meta business account, or permission to set them up in your business name',
      'A payment method on the ad account for ad spend (billed to you directly by Meta)',
      'Photos of your real work, team, products or properties when available',
      'Details of any offers, and quick follow-up when new inquiries come in',
    ],
    notes: [
      "Ad spend is separate from our fees. The money for ads is paid directly by you to Meta (or any other ad platform), not to Pearl River Marketing. Our management fee covers the work of creating and managing the campaigns.",
      "We don't guarantee leads, sales or revenue. Results depend on your market, offer, budget, competition and how quickly inquiries are followed up.",
    ],
  },
  'social-media': {
    problem:
      "Customers check your Facebook and Instagram before they call. A page that hasn't posted in months makes a business look closed or careless, but finding time to create good posts every week is hard when you're running the business.",
    summary:
      'We create professional social media content for your business and post it on a consistent schedule, so your pages stay active, look professional, and keep your services and offers in front of local customers.',
    whoFor:
      'Busy local business owners who know they should be posting regularly but don\'t have the time, and businesses whose pages look outdated or inconsistent.',
    included: [
      'Branded social media graphics in your colors and style',
      'Captions and post copy written for your business',
      'Promotional posts for your products, services and special offers',
      'A monthly content calendar planned with you',
      'Scheduling and publishing approved posts to Facebook and Instagram',
    ],
    howItWorks: [
      'We learn your business, your customers, your voice and what you want to promote.',
      'Each month we plan a content calendar and create the posts.',
      'You review and approve the posts before anything is published.',
      'We schedule and publish the approved posts on Facebook and Instagram.',
    ],
    youProvide: [
      'Access to your Facebook Page and Instagram account (as a manager or partner)',
      'Your logo, colors and any existing branding',
      'Photos and short videos of your work, team or products when you can',
      'Upcoming offers, events or news you want to share, and timely approval of each month\'s posts',
    ],
    notes: [
      "This service covers creating and posting content. It doesn't include website design, search engine optimization or other marketing services.",
      'Replying to comments and messages stays with you unless we agree otherwise in writing.',
    ],
  },
};

export const serviceDetails: ServiceDetail[] = services.map((s) => {
  const d = details[s.id];
  if (!d) throw new Error(`Missing service details for "${s.id}" in src/data/serviceDetails.ts`);
  return { ...s, ...d };
});
