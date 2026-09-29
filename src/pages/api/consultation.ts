import type { APIRoute } from 'astro';
import { handleSubmission, type MailEnv } from '../../lib/consultation';

// Runs on demand as a Vercel Function. Secrets are read at request time from the
// server environment and are never sent to the browser.
export const prerender = false;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const POST: APIRoute = async ({ request }) => {
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
    return json(415, { ok: false, error: 'unsupported_media_type' });
  }
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 20_000) return json(413, { ok: false, error: 'too_large' });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(400, { ok: false, error: 'bad_json' });
  }

  const env: MailEnv = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  };

  const result = await handleSubmission(raw, env);
  if (result.status === 503) console.error('[consultation] Email delivery is not configured. Set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.');
  if (result.status === 502) console.error('[consultation] Email provider rejected or failed the request.');
  return json(result.status, result.body);
};

export const ALL: APIRoute = () => json(405, { ok: false, error: 'method_not_allowed' });
