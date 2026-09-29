import { describe, expect, it, vi } from 'vitest';
import { services } from '../src/data/site';
import {
  SERVICE_OPTIONS,
  TEST_SENDER,
  buildEmail,
  handleSubmission,
  isLikelySpam,
  normalize,
  validate,
} from '../src/lib/consultation';

const NOW = 1_800_000_000_000;
const good = {
  name: 'Jane Doe',
  email: 'Jane@Example.com',
  business: 'Doe Roofing',
  phone: '(601) 555-0100',
  website: 'doeroofing.com',
  services: ['advertising', 'social-media'],
  message: 'Looking for more roof repair calls.',
  consent: true,
  trap: '',
  startedAt: NOW - 30_000,
  submissionId: 'b3c1f2a4-5d6e-4f70-8a9b-0c1d2e3f4a5b',
};
const env = { RESEND_API_KEY: 're_test', CONTACT_TO_EMAIL: 'owner@example.com', CONTACT_FROM_EMAIL: 'Forms <forms@example.com>' };
const ok = () => vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
const asFetch = (f: unknown) => f as typeof fetch;

describe('validate', () => {
  it('accepts a complete submission and lowercases email', () => {
    const input = normalize(good);
    expect(input.email).toBe('jane@example.com');
    expect(validate(input)).toEqual({});
  });

  it('requires name, email, business, services, message and consent', () => {
    const errors = validate(normalize({}));
    expect(Object.keys(errors).sort()).toEqual(['business', 'consent', 'email', 'message', 'name', 'services']);
  });

  it('allows blank optional fields but rejects malformed ones', () => {
    expect(validate(normalize({ ...good, phone: '', website: '' }))).toEqual({});
    const e = validate(normalize({ ...good, phone: 'call me', website: 'not a site', email: 'nope' }));
    expect(e.phone).toBeTruthy();
    expect(e.website).toBeTruthy();
    expect(e.email).toBeTruthy();
  });

  it('accepts common website formats', () => {
    for (const website of ['doeroofing.com', 'https://www.doeroofing.com', 'http://doe-roofing.co/contact']) {
      expect(validate(normalize({ ...good, website })).website).toBeUndefined();
    }
  });

  it('rejects email addresses with display-name or header tricks', () => {
    for (const email of ['a@b', 'Jane <jane@example.com>', 'jane@example.com, evil@example.com']) {
      expect(validate(normalize({ ...good, email })).email).toBeTruthy();
    }
  });

  it('rejects unknown services', () => {
    expect(validate(normalize({ ...good, services: ['hacking'] })).services).toBeTruthy();
  });

  it('rejects services the agency no longer offers', () => {
    for (const old of ['websites', 'google-ads', 'local-seo', 'landing-pages', 'reporting', 'real-estate']) {
      expect(validate(normalize({ ...good, services: [old] })).services).toBeTruthy();
    }
  });

  it('accepts a Facebook page as the website field', () => {
    expect(validate(normalize({ ...good, website: 'facebook.com/doeroofing' })).website).toBeUndefined();
  });
});

describe('service options', () => {
  it('offer exactly the two core services plus "not sure"', () => {
    expect(SERVICE_OPTIONS.map((o) => o.value)).toEqual([...services.map((s) => s.id), 'not-sure']);
    expect(services.map((s) => s.id)).toEqual(['advertising', 'social-media']);
  });
});

describe('sanitizing', () => {
  it('strips line breaks and control characters from single-line fields', () => {
    const input = normalize({ ...good, business: 'Doe\r\nBcc: evil@example.com\u0000' });
    expect(input.business).not.toMatch(/[\r\n\u0000]/);
    expect(buildEmail(input).subject).not.toMatch(/[\r\n]/);
  });

  it('keeps line breaks in the message but removes other control characters', () => {
    const input = normalize({ ...good, message: 'Line one\r\nLine two\u0007' });
    expect(input.message).toBe('Line one\nLine two');
  });

  it('escapes HTML from user input in the email', () => {
    const mail = buildEmail(normalize({ ...good, message: '<script>alert(1)</script>' }));
    expect(mail.html).not.toContain('<script>');
    expect(mail.html).toContain('&lt;script&gt;');
    expect(mail.subject).toBe('Consultation request: Doe Roofing');
  });
});

describe('spam checks', () => {
  it('flags filled honeypot and instant submissions', () => {
    expect(isLikelySpam(normalize({ ...good, trap: 'http://spam' }), NOW)).toBe(true);
    expect(isLikelySpam(normalize({ ...good, startedAt: NOW - 500 }), NOW)).toBe(true);
    expect(isLikelySpam(normalize({ ...good, startedAt: undefined }), NOW)).toBe(true);
    expect(isLikelySpam(normalize(good), NOW)).toBe(false);
  });
});

describe('handleSubmission', () => {
  it('returns 503 and sends nothing when email is not configured', async () => {
    const f = vi.fn();
    const r = await handleSubmission(good, {}, { fetchImpl: asFetch(f), now: NOW });
    expect(r.status).toBe(503);
    expect(f).not.toHaveBeenCalled();
  });

  it('returns 400 with field errors for invalid input', async () => {
    const f = vi.fn();
    const r = await handleSubmission({ ...good, email: 'bad' }, env, { fetchImpl: asFetch(f), now: NOW });
    expect(r.status).toBe(400);
    expect(f).not.toHaveBeenCalled();
  });

  it('drops spam silently without sending', async () => {
    const f = vi.fn();
    const r = await handleSubmission({ ...good, trap: 'x' }, env, { fetchImpl: asFetch(f), now: NOW });
    expect(r.status).toBe(200);
    expect(f).not.toHaveBeenCalled();
  });

  it('sends through Resend with reply-to set to the visitor', async () => {
    const f = ok();
    const r = await handleSubmission(good, env, { fetchImpl: asFetch(f), now: NOW });
    expect(r.status).toBe(200);
    const [url, init] = f.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_test');
    const body = JSON.parse(init.body);
    expect(body.reply_to).toBe('jane@example.com');
    expect(body.to).toEqual(['owner@example.com']);
    expect(body.from).toBe('Forms <forms@example.com>');
  });

  it('sends an idempotency key so a retried submission cannot create a duplicate email', async () => {
    const f = ok();
    await handleSubmission(good, env, { fetchImpl: asFetch(f), now: NOW });
    expect(f.mock.calls[0][1].headers['Idempotency-Key']).toBe(`consultation/${good.submissionId}`);
  });

  it('omits the idempotency key when the id is malformed', async () => {
    const f = ok();
    await handleSubmission({ ...good, submissionId: 'short' }, env, { fetchImpl: asFetch(f), now: NOW });
    expect(f.mock.calls[0][1].headers['Idempotency-Key']).toBeUndefined();
  });

  it('falls back to the Resend test sender when no verified sender is configured', async () => {
    const f = ok();
    const log = vi.fn();
    await handleSubmission(good, { ...env, CONTACT_FROM_EMAIL: '' }, { fetchImpl: asFetch(f), now: NOW, log });
    expect(JSON.parse(f.mock.calls[0][1].body).from).toBe(TEST_SENDER);
    expect(log).toHaveBeenCalled();
  });

  it('reports delivery failure instead of fake success, without logging secrets', async () => {
    const log = vi.fn();
    const bad = vi.fn().mockResolvedValue(new Response('{}', { status: 422 }));
    expect((await handleSubmission(good, env, { fetchImpl: asFetch(bad), now: NOW, log })).status).toBe(502);
    const thrown = vi.fn().mockRejectedValue(new Error('network'));
    expect((await handleSubmission(good, env, { fetchImpl: asFetch(thrown), now: NOW, log })).status).toBe(502);
    const logged = log.mock.calls.flat().join(' ');
    expect(logged).not.toContain('re_test');
    expect(logged).not.toContain('jane@example.com');
  });
});
