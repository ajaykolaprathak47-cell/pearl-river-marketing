import { describe, expect, it, vi } from 'vitest';
import { buildEmail, handleSubmission, isLikelySpam, normalize, validate } from '../src/lib/consultation';

const NOW = 1_800_000_000_000;
const good = {
  name: 'Jane Doe',
  business: 'Doe Roofing',
  email: 'Jane@Example.com',
  phone: '(601) 555-0100',
  website: 'doeroofing.com',
  services: ['google-ads', 'landing-pages'],
  budget: '1000-2500',
  message: 'Looking for more roof repair calls.',
  consent: true,
  trap: '',
  startedAt: NOW - 30_000,
};
const env = { RESEND_API_KEY: 're_test', CONTACT_TO_EMAIL: 'owner@example.com', CONTACT_FROM_EMAIL: 'Forms <forms@example.com>' };

describe('validate', () => {
  it('accepts a complete submission and lowercases email', () => {
    const input = normalize(good);
    expect(input.email).toBe('jane@example.com');
    expect(validate(input)).toEqual({});
  });

  it('requires name, business, email, services, budget, message and consent', () => {
    const errors = validate(normalize({}));
    expect(Object.keys(errors).sort()).toEqual(['budget', 'business', 'consent', 'email', 'message', 'name', 'services']);
  });

  it('allows blank optional fields but rejects malformed ones', () => {
    expect(validate(normalize({ ...good, phone: '', website: '' }))).toEqual({});
    const e = validate(normalize({ ...good, phone: 'call me', website: 'not a site', email: 'nope' }));
    expect(e.phone).toBeTruthy();
    expect(e.website).toBeTruthy();
    expect(e.email).toBeTruthy();
  });

  it('rejects unknown services and budgets', () => {
    const e = validate(normalize({ ...good, services: ['hacking'], budget: 'a million' }));
    expect(e.services).toBeTruthy();
    expect(e.budget).toBeTruthy();
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

describe('buildEmail', () => {
  it('escapes HTML from user input', () => {
    const mail = buildEmail(normalize({ ...good, message: '<script>alert(1)</script>' }));
    expect(mail.html).not.toContain('<script>');
    expect(mail.html).toContain('&lt;script&gt;');
    expect(mail.subject).toBe('Consultation request: Doe Roofing');
  });
});

describe('handleSubmission', () => {
  it('returns 503 and sends nothing when email is not configured', async () => {
    const f = vi.fn();
    const r = await handleSubmission(good, {}, f as unknown as typeof fetch, NOW);
    expect(r.status).toBe(503);
    expect(f).not.toHaveBeenCalled();
  });

  it('returns 400 with field errors for invalid input', async () => {
    const f = vi.fn();
    const r = await handleSubmission({ ...good, email: 'bad' }, env, f as unknown as typeof fetch, NOW);
    expect(r.status).toBe(400);
    expect(f).not.toHaveBeenCalled();
  });

  it('drops spam silently without sending', async () => {
    const f = vi.fn();
    const r = await handleSubmission({ ...good, trap: 'x' }, env, f as unknown as typeof fetch, NOW);
    expect(r.status).toBe(200);
    expect(f).not.toHaveBeenCalled();
  });

  it('sends through Resend with reply-to set to the visitor', async () => {
    const f = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    const r = await handleSubmission(good, env, f as unknown as typeof fetch, NOW);
    expect(r.status).toBe(200);
    const [url, init] = f.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_test');
    const body = JSON.parse(init.body);
    expect(body.reply_to).toBe('jane@example.com');
    expect(body.to).toEqual(['owner@example.com']);
  });

  it('reports delivery failure instead of fake success', async () => {
    const bad = vi.fn().mockResolvedValue(new Response('{}', { status: 422 }));
    expect((await handleSubmission(good, env, bad as unknown as typeof fetch, NOW)).status).toBe(502);
    const thrown = vi.fn().mockRejectedValue(new Error('network'));
    expect((await handleSubmission(good, env, thrown as unknown as typeof fetch, NOW)).status).toBe(502);
  });
});
