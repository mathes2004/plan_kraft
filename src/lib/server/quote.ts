import 'server-only';
import { createHash } from 'node:crypto';
import { quoteSchema } from '@/lib/validation/quote';
import { services } from '@/data/services';
import { quoteConfig } from '@/data/quote-config';
const QUOTE_RECIPIENT = quoteConfig.recipient;
const LIMIT = 16 * 1024;
function reply(
  status: number,
  code: string,
  message: string,
  extra: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) {
  return Response.json(
    { ok: status === 200, code, message, ...extra },
    { status, headers: { 'Cache-Control': 'no-store', ...headers } },
  );
}
async function readLimited(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > LIMIT) {
        await reader.cancel();
        throw new Error('too_large');
      }
      chunks.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }
  const merged = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(merged);
}
export async function handleQuote(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json')
    return reply(415, 'unsupported_media_type', 'Please send your enquiry as JSON.');
  if (Number(request.headers.get('content-length')) > LIMIT)
    return reply(413, 'payload_too_large', 'Your enquiry is too long.');
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  let allowed: string;
  try {
    allowed = new URL(site).origin;
  } catch {
    return reply(
      503,
      'email_unavailable',
      'Enquiries are temporarily unavailable. Please contact us on WhatsApp.',
    );
  }
  if (request.headers.get('origin') !== allowed)
    return reply(
      403,
      'request_rejected',
      'This request could not be verified. Please use the website enquiry form.',
    );
  let raw: unknown;
  try {
    raw = JSON.parse(await readLimited(request));
  } catch (e) {
    return e instanceof Error && e.message === 'too_large'
      ? reply(413, 'payload_too_large', 'Your enquiry is too long.')
      : reply(400, 'validation_error', 'Please check your enquiry and try again.');
  }
  if (raw && typeof raw === 'object' && 'website' in raw && raw.website)
    return reply(403, 'request_rejected', 'This request could not be verified.');
  const checked = quoteSchema.safeParse(raw);
  if (!checked.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of checked.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return reply(400, 'validation_error', 'Please check the highlighted fields.', { fieldErrors });
  }
  const key = process.env.RESEND_API_KEY,
    from = process.env.QUOTE_FROM_EMAIL,
    redis = process.env.RATE_LIMIT_REST_URL,
    redisToken = process.env.RATE_LIMIT_REST_TOKEN;
  const challengeSecret = process.env.TURNSTILE_SECRET_KEY,
    challengeSite = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (
    !key ||
    !from ||
    !redis ||
    !redis.startsWith('https://') ||
    !redisToken ||
    (process.env.QUOTE_TO_EMAIL && process.env.QUOTE_TO_EMAIL !== QUOTE_RECIPIENT) ||
    Boolean(challengeSecret) !== Boolean(challengeSite)
  )
    return reply(
      503,
      'email_unavailable',
      'Online enquiries are not configured yet. Please call or WhatsApp us for your free quotation.',
    );
  // Vercel overwrites this header. Never use arbitrary x-forwarded-for values.
  const trustedIp =
    process.env.VERCEL === '1'
      ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim()
      : process.env.NODE_ENV !== 'production'
        ? 'local-development'
        : null;
  if (!trustedIp)
    return reply(
      503,
      'email_unavailable',
      'Enquiries are temporarily unavailable. Please contact us directly.',
    );
  try {
    const hash = createHash('sha256').update(trustedIp).digest('hex');
    const script =
      "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return n";
    const limited = await fetch(redis, {
      method: 'POST',
      headers: { Authorization: `Bearer ${redisToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', script, '1', `quote-rate:${hash}`]),
      signal: AbortSignal.timeout(5000),
    });
    if (!limited.ok) throw new Error('limiter');
    const rate = await limited.json();
    if (rate.error || typeof rate.result !== 'number') throw new Error('limiter');
    if (rate.result > 5)
      return reply(
        429,
        'rate_limited',
        'Too many attempts. Please try again in 15 minutes or contact us directly.',
        {},
        { 'Retry-After': '900' },
      );
    if (challengeSecret) {
      if (!checked.data.challengeToken)
        return reply(403, 'request_rejected', 'Please complete the security check.');
      const verification = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          body: new URLSearchParams({
            secret: challengeSecret,
            response: checked.data.challengeToken,
            remoteip: trustedIp,
          }),
          signal: AbortSignal.timeout(8000),
        },
      );
      if (!verification.ok)
        return reply(
          403,
          'request_rejected',
          'The security check could not be verified. Please try again.',
        );
      const challenge = await verification.json();
      if (!challenge.success || challenge.hostname !== new URL(site).hostname)
        return reply(
          403,
          'request_rejected',
          'The security check expired or could not be verified. Please try again.',
        );
    }
  } catch {
    return reply(
      503,
      'email_unavailable',
      'We could not verify this enquiry. Please try again or contact us directly.',
    );
  }
  const d = checked.data;
  const reference = d.submissionId;
  const service = services.find((s) => s.id === d.serviceId)!.title;
  // Keep message content stable on retry for provider idempotency.
  const text = `PLAN KRAFT — New quotation enquiry\nReference: ${reference}\nName: ${d.name}\nPhone: ${d.phone}\nLocation: ${d.location}\nService: ${service}\n\n${d.description}`;
  const escape = (value: string) =>
    value.replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
    );
  const html = `<h1>New quotation enquiry</h1><p>Reference: ${reference}</p><dl><dt>Name</dt><dd>${escape(d.name)}</dd><dt>Phone</dt><dd>${escape(d.phone)}</dd><dt>Location</dt><dd>${escape(d.location)}</dd><dt>Service</dt><dd>${escape(service)}</dd></dl><p>${escape(d.description).replace(/\n/g, '<br>')}</p>`;
  const digest = createHash('sha256')
    .update(JSON.stringify([d.name, d.phone, d.location, d.serviceId, d.description]))
    .digest('hex');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `quote-${reference}-${digest}`,
      },
      body: JSON.stringify({
        from,
        to: [QUOTE_RECIPIENT],
        subject: 'PLAN KRAFT — New quotation enquiry',
        text,
        html,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok)
      return reply(
        502,
        'email_provider_error',
        'Your enquiry could not be accepted. Please retry or contact us on WhatsApp.',
      );
    return reply(
      200,
      'accepted',
      'Your enquiry has been accepted by our email service. If you need immediate help, please call or WhatsApp us.',
      { reference },
    );
  } catch {
    return reply(
      502,
      'email_provider_error',
      'We could not confirm acceptance of your enquiry. Retry with the same details or contact us directly.',
    );
  }
}
