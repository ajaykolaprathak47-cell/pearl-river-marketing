/**
 * Consultation form: shared validation (browser + server) and the server-side
 * submit handler. The handler takes env and fetch as arguments so it can be
 * tested without network access or real credentials.
 */

export const SERVICE_OPTIONS = [
  { value: 'google-ads', label: 'Google Ads' },
  { value: 'meta-ads', label: 'Facebook & Instagram ads' },
  { value: 'landing-pages', label: 'Lead generation & landing pages' },
  { value: 'websites', label: 'Website design' },
  { value: 'local-seo', label: 'Local SEO & Google Business Profile' },
  { value: 'reporting', label: 'Tracking & reporting' },
  { value: 'real-estate', label: 'Real estate marketing' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const;

export const BUDGET_OPTIONS = [
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'under-500', label: 'Under $500 / month' },
  { value: '500-1000', label: '$500 to $1,000 / month' },
  { value: '1000-2500', label: '$1,000 to $2,500 / month' },
  { value: '2500-5000', label: '$2,500 to $5,000 / month' },
  { value: '5000-plus', label: 'More than $5,000 / month' },
] as const;

/** Minimum time a real person takes to fill the form, in milliseconds. */
export const MIN_FILL_MS = 3000;

export interface ConsultationInput {
  name: string;
  business: string;
  email: string;
  phone: string;
  website: string;
  services: string[];
  budget: string;
  message: string;
  consent: boolean;
  /** Honeypot. Must be empty. */
  trap: string;
  /** Epoch ms when the form was rendered in the browser. */
  startedAt: number;
}

export type FieldErrors = Partial<Record<keyof ConsultationInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;
const LIMITS = { name: 100, business: 150, email: 200, phone: 30, website: 200, message: 3000 };

const serviceValues = new Set<string>(SERVICE_OPTIONS.map((o) => o.value));
const budgetValues = new Set<string>(BUDGET_OPTIONS.map((o) => o.value));

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Coerce an unknown JSON body into the input shape, without trusting it. */
export function normalize(raw: unknown): ConsultationInput {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const services = Array.isArray(r.services) ? r.services.filter((s): s is string => typeof s === 'string') : [];
  const started = Number(r.startedAt);
  return {
    name: str(r.name),
    business: str(r.business),
    email: str(r.email).toLowerCase(),
    phone: str(r.phone),
    website: str(r.website),
    services: [...new Set(services)],
    budget: str(r.budget),
    message: str(r.message),
    consent: r.consent === true || r.consent === 'on' || r.consent === 'true',
    trap: str(r.trap),
    startedAt: Number.isFinite(started) ? started : 0,
  };
}

export function validate(input: ConsultationInput): FieldErrors {
  const e: FieldErrors = {};
  if (!input.name) e.name = 'Enter your name.';
  else if (input.name.length > LIMITS.name) e.name = 'Name is too long.';

  if (!input.business) e.business = 'Enter your business name.';
  else if (input.business.length > LIMITS.business) e.business = 'Business name is too long.';

  if (!input.email) e.email = 'Enter your email address.';
  else if (input.email.length > LIMITS.email || !EMAIL_RE.test(input.email)) e.email = 'Enter a valid email address, like name@business.com.';

  if (input.phone && !PHONE_RE.test(input.phone)) e.phone = 'Enter a valid phone number, or leave it blank.';

  if (input.website) {
    if (input.website.length > LIMITS.website) e.website = 'Website address is too long.';
    else if (!/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(input.website)) e.website = 'Enter a valid website, like yourbusiness.com, or leave it blank.';
  }

  if (input.services.length === 0) e.services = 'Choose at least one option. "Not sure yet" is fine.';
  else if (input.services.some((s) => !serviceValues.has(s))) e.services = 'Choose from the listed options.';

  if (!budgetValues.has(input.budget)) e.budget = 'Choose an approximate budget. "Not sure yet" is fine.';

  if (!input.message) e.message = 'Tell us a little about your business and goals.';
  else if (input.message.length > LIMITS.message) e.message = `Keep your message under ${LIMITS.message} characters.`;

  if (!input.consent) e.consent = 'Please agree so we can use these details to reply to you.';
  return e;
}

/** True when the submission looks automated. Real visitors never trip this. */
export function isLikelySpam(input: ConsultationInput, now = Date.now()): boolean {
  if (input.trap) return true;
  if (!input.startedAt || now - input.startedAt < MIN_FILL_MS) return true;
  if (now - input.startedAt > 1000 * 60 * 60 * 24) return true; // form open over a day
  return false;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const labelFor = (list: readonly { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label ?? v;

export function buildEmail(input: ConsultationInput) {
  const services = input.services.map((s) => labelFor(SERVICE_OPTIONS, s)).join(', ');
  const rows: [string, string][] = [
    ['Name', input.name],
    ['Business', input.business],
    ['Email', input.email],
    ['Phone', input.phone || 'Not provided'],
    ['Website', input.website || 'Not provided'],
    ['Services of interest', services],
    ['Monthly ad budget', labelFor(BUDGET_OPTIONS, input.budget)],
  ];
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', 'Message:', input.message].join('\n');
  const html = `<h2 style="font-family:Georgia,serif">New consultation request</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="color:#555"><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('\n')}
</table>
<p style="font-family:Arial,sans-serif;font-size:14px"><strong>Message</strong></p>
<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(input.message)}</p>`;
  return {
    subject: `Consultation request: ${input.business}`.slice(0, 150),
    text,
    html,
  };
}

export interface MailEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

export type SubmitResult =
  | { status: 200; body: { ok: true } }
  | { status: 400; body: { ok: false; error: 'validation'; fieldErrors: FieldErrors } }
  | { status: 503; body: { ok: false; error: 'not_configured' } }
  | { status: 502; body: { ok: false; error: 'delivery_failed' } };

export async function handleSubmission(
  raw: unknown,
  env: MailEnv,
  fetchImpl: typeof fetch = fetch,
  now = Date.now(),
): Promise<SubmitResult> {
  const input = normalize(raw);

  // Bots get a normal-looking reply so they do not retry. Nothing is sent.
  if (isLikelySpam(input, now)) return { status: 200, body: { ok: true } };

  const fieldErrors = validate(input);
  if (Object.keys(fieldErrors).length) return { status: 400, body: { ok: false, error: 'validation', fieldErrors } };

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return { status: 503, body: { ok: false, error: 'not_configured' } };
  }

  const mail = buildEmail(input);
  try {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: input.email,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      }),
    });
    if (!res.ok) return { status: 502, body: { ok: false, error: 'delivery_failed' } };
  } catch {
    return { status: 502, body: { ok: false, error: 'delivery_failed' } };
  }
  return { status: 200, body: { ok: true } };
}
