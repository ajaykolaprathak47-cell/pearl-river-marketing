/**
 * Consultation form: shared validation (browser + server) and the server-side
 * submit handler. The handler takes env and fetch as arguments so it can be
 * tested without network access or real credentials.
 */

export const SERVICE_OPTIONS = [
  { value: 'advertising', label: 'Digital Advertising (Facebook & Instagram ads)' },
  { value: 'social-media', label: 'Social Media Content Creation & Posting' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const;

/** Minimum time a real person takes to fill the form, in milliseconds. */
export const MIN_FILL_MS = 3000;

/**
 * Resend's shared test sender. It only delivers to the email address that owns
 * the Resend account, so it is used only until a verified domain sender is set.
 */
export const TEST_SENDER = 'Pearl River Marketing <onboarding@resend.dev>';

export interface ConsultationInput {
  name: string;
  email: string;
  business: string;
  phone: string;
  website: string;
  services: string[];
  message: string;
  consent: boolean;
  /** Honeypot. Must be empty. */
  trap: string;
  /** Epoch ms when the form was rendered in the browser. */
  startedAt: number;
  /** Random id created once per form view; used to stop duplicate emails. */
  submissionId: string;
}

export type FieldErrors = Partial<Record<keyof ConsultationInput, string>>;

const EMAIL_RE = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;
const SUBMISSION_ID_RE = /^[A-Za-z0-9-]{16,64}$/;
export const LIMITS = { name: 100, business: 150, email: 200, phone: 30, website: 200, message: 3000 } as const;

const serviceValues = new Set<string>(SERVICE_OPTIONS.map((o) => o.value));

/** Remove control characters. Newlines and tabs survive only where `multiline` is set. */
function clean(v: unknown, multiline = false): string {
  if (typeof v !== 'string') return '';
  const pattern = multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return v.replace(/\r\n?/g, '\n').replace(pattern, multiline ? '' : ' ').replace(/[ \t]+/g, (s) => (multiline ? s : ' ')).trim();
}

/** Coerce an unknown JSON body into the input shape, without trusting it. */
export function normalize(raw: unknown): ConsultationInput {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const services = Array.isArray(r.services) ? r.services.filter((s): s is string => typeof s === 'string').slice(0, 20) : [];
  const started = Number(r.startedAt);
  return {
    name: clean(r.name),
    email: clean(r.email).toLowerCase(),
    business: clean(r.business),
    phone: clean(r.phone),
    website: clean(r.website),
    services: [...new Set(services.map((s) => clean(s)))],
    message: clean(r.message, true),
    consent: r.consent === true || r.consent === 'on' || r.consent === 'true',
    trap: clean(r.trap),
    startedAt: Number.isFinite(started) ? started : 0,
    submissionId: clean(r.submissionId),
  };
}

export function validate(input: ConsultationInput): FieldErrors {
  const e: FieldErrors = {};
  if (!input.name) e.name = 'Enter your name.';
  else if (input.name.length > LIMITS.name) e.name = 'Name is too long.';

  if (!input.email) e.email = 'Enter your email address.';
  else if (input.email.length > LIMITS.email || !EMAIL_RE.test(input.email)) e.email = 'Enter a valid email address, like name@business.com.';

  if (!input.business) e.business = 'Enter your business name.';
  else if (input.business.length > LIMITS.business) e.business = 'Business name is too long.';

  if (input.phone && !PHONE_RE.test(input.phone)) e.phone = 'Enter a valid phone number, or leave it blank.';

  if (input.website) {
    if (input.website.length > LIMITS.website) e.website = 'Website address is too long.';
    else if (!/^(https?:\/\/)?[^\s./]+(\.[^\s./]+)*\.[a-z]{2,}(\/\S*)?$/i.test(input.website)) e.website = 'Enter a valid web address, like facebook.com/yourbusiness, or leave it blank.';
  }

  if (input.services.length === 0) e.services = 'Choose at least one option. "Not sure yet" is fine.';
  else if (input.services.some((s) => !serviceValues.has(s))) e.services = 'Choose from the listed options.';

  if (!input.message) e.message = 'Tell us a little about your business and what you need.';
  else if (input.message.length > LIMITS.message) e.message = `Keep your message under ${LIMITS.message} characters.`;

  if (!input.consent) e.consent = 'Please agree so we can use these details to reply to you.';
  return e;
}

/** True when the submission looks automated. Real visitors never trip this. */
export function isLikelySpam(input: ConsultationInput, now = Date.now()): boolean {
  if (input.trap) return true;
  if (!input.startedAt || now - input.startedAt < MIN_FILL_MS) return true;
  if (now - input.startedAt > 1000 * 60 * 60 * 24) return true; // form left open over a day
  return false;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const labelFor = (v: string) => SERVICE_OPTIONS.find((o) => o.value === v)?.label ?? v;

export function buildEmail(input: ConsultationInput) {
  const services = input.services.map(labelFor).join(', ');
  const rows: [string, string][] = [
    ['Name', input.name],
    ['Business', input.business],
    ['Email', input.email],
    ['Phone', input.phone || 'Not provided'],
    ['Website', input.website || 'Not provided'],
    ['Services of interest', services],
  ];
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', 'Message:', input.message, '', 'Reply to this email to respond directly to the sender.'].join('\n');
  const html = `<h2 style="font-family:Georgia,serif;color:#10223a">New consultation request</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="color:#555;vertical-align:top"><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('\n')}
</table>
<p style="font-family:Arial,sans-serif;font-size:14px"><strong>Message</strong></p>
<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(input.message)}</p>
<p style="font-family:Arial,sans-serif;font-size:12px;color:#777">Reply to this email to respond directly to the sender.</p>`;
  // Subject is single-line by construction: clean() already removed CR/LF.
  const subject = `Consultation request: ${input.business}`.replace(/[\r\n]/g, ' ').slice(0, 150);
  return { subject, text, html };
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

export interface SubmitOptions {
  fetchImpl?: typeof fetch;
  now?: number;
  log?: (msg: string) => void;
}

export async function handleSubmission(raw: unknown, env: MailEnv, opts: SubmitOptions = {}): Promise<SubmitResult> {
  const { fetchImpl = fetch, now = Date.now(), log = () => {} } = opts;
  const input = normalize(raw);

  // Bots get a normal-looking reply so they do not retry. Nothing is sent.
  if (isLikelySpam(input, now)) {
    log('Submission dropped by spam checks.');
    return { status: 200, body: { ok: true } };
  }

  const fieldErrors = validate(input);
  if (Object.keys(fieldErrors).length) return { status: 400, body: { ok: false, error: 'validation', fieldErrors } };

  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !to) {
    log('Email delivery is not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL.');
    return { status: 503, body: { ok: false, error: 'not_configured' } };
  }
  const from = env.CONTACT_FROM_EMAIL?.trim() || TEST_SENDER;
  if (from === TEST_SENDER) log('CONTACT_FROM_EMAIL is not set; using the Resend test sender, which only delivers to the Resend account owner.');

  const headers: Record<string, string> = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
  if (SUBMISSION_ID_RE.test(input.submissionId)) headers['Idempotency-Key'] = `consultation/${input.submissionId}`;

  const mail = buildEmail(input);
  try {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({ from, to: [to], reply_to: input.email, subject: mail.subject, text: mail.text, html: mail.html }),
    });
    if (!res.ok) {
      // Log status only. Never log the API key or the visitor's details.
      log(`Resend rejected the request with status ${res.status}.`);
      return { status: 502, body: { ok: false, error: 'delivery_failed' } };
    }
  } catch {
    log('Could not reach Resend.');
    return { status: 502, body: { ok: false, error: 'delivery_failed' } };
  }
  return { status: 200, body: { ok: true } };
}
