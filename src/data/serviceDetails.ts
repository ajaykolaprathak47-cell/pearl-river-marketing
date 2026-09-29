import { services, type Service } from './site';

export interface ServiceDetail extends Service {
  /** Headline shown on the Services page. */
  title: string;
  /** One or two plain-English sentences. */
  lead: string;
  /** Four short "what you get" items. */
  items: string[];
  /** One line of fine print. */
  note: string;
}

type DetailFields = Omit<ServiceDetail, keyof Service>;

const details: Record<string, DetailFields> = {
  advertising: {
    title: 'Digital Advertising',
    lead: "Reach people nearby who don't know you yet. We create and manage Facebook and Instagram ads built around a clear offer and a clear next step.",
    items: [
      'Campaign setup and audience targeting',
      'Ad images, graphics and copy',
      'Ongoing monitoring and optimization',
      'Simple, plain-English reports',
    ],
    note: "Ad spend is paid directly to Meta and is separate from our fee. Results aren't guaranteed; they depend on your market, offer and budget.",
  },
  'social-media': {
    title: 'Social Media Content Creation & Posting',
    lead: 'Stay visible without finding time to post. We create professional posts for your business and publish them on a steady schedule.',
    items: [
      'Branded graphics and captions',
      'Posts for your services and offers',
      'A monthly content calendar',
      'Scheduled posting, after your approval',
    ],
    note: 'Covers Facebook and Instagram. Replying to comments and messages stays with you unless we agree otherwise.',
  },
};

export const serviceDetails: ServiceDetail[] = services.map((s) => {
  const d = details[s.id];
  if (!d) throw new Error(`Missing service details for "${s.id}" in src/data/serviceDetails.ts`);
  return { ...s, ...d };
});
