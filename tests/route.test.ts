import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { handleQuote } from '@/lib/server/quote';
const body = {
  name: 'Test Customer',
  phone: '0771234567',
  location: 'Batticaloa',
  serviceId: 'roof',
  description: 'Water is entering through the roof.',
  website: '',
  submissionId: '38db91a6-a261-45c8-b011-47b622825ecc',
};
function request(data: unknown = body, headers: Record<string, string> = {}) {
  return new Request('http://localhost:3000/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', ...headers },
    body: typeof data === 'string' ? data : JSON.stringify(data),
  });
}
beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000');
  vi.stubEnv('RESEND_API_KEY', 'test-key');
  vi.stubEnv('QUOTE_FROM_EMAIL', 'Plan Kraft <quote@example.com>');
  vi.stubEnv('QUOTE_TO_EMAIL', 'Plankraftwaterproofing@gmail.com');
  vi.stubEnv('RATE_LIMIT_REST_URL', 'https://redis.example.com');
  vi.stubEnv('RATE_LIMIT_REST_TOKEN', 'test-token');
  vi.stubEnv('VERCEL', '1');
  vi.stubEnv('TURNSTILE_SECRET_KEY', '');
  vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', '');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe('quote endpoint', () => {
  it('rejects other content types', async () =>
    expect((await handleQuote(request(body, { 'Content-Type': 'text/plain' }))).status).toBe(415));
  it('rejects untrusted origins', async () =>
    expect((await handleQuote(request(body, { Origin: 'https://wrong.example' }))).status).toBe(
      403,
    ));
  it('enforces actual byte limit', async () =>
    expect(
      (await handleQuote(request(JSON.stringify({ ...body, description: 'x'.repeat(17000) }))))
        .status,
    ).toBe(413));
  it('rejects malformed JSON', async () =>
    expect((await handleQuote(request('{'))).status).toBe(400));
  it('validates all fields independently', async () =>
    expect((await handleQuote(request({ ...body, phone: 'bad' }))).status).toBe(400));
  it('rejects honeypot submissions honestly', async () =>
    expect((await handleQuote(request({ ...body, website: 'spam' }))).status).toBe(403));
  it('reports unavailable configuration', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await handleQuote(request())).status).toBe(503);
  });
  it('refuses recipient changes', async () => {
    vi.stubEnv('QUOTE_TO_EMAIL', 'other@example.com');
    expect((await handleQuote(request())).status).toBe(503);
  });
  it('fails closed when trusted IP is unavailable', async () =>
    expect((await handleQuote(request())).status).toBe(503));
  it('returns rate limit and retry interval', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ result: 6 })));
    const response = await handleQuote(request(body, { 'x-vercel-forwarded-for': '192.0.2.1' }));
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('900');
  });
  it('reports provider failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(Response.json({ result: 1 }))
        .mockResolvedValueOnce(Response.json({ error: 'bad' }, { status: 500 })),
    );
    expect(
      (await handleQuote(request(body, { 'x-vercel-forwarded-for': '192.0.2.1' }))).status,
    ).toBe(502);
  });
  it('fails closed when rate storage is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(
      (await handleQuote(request(body, { 'x-vercel-forwarded-for': '192.0.2.1' }))).status,
    ).toBe(503);
  });
  it('rejects a missing configured challenge', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret');
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'public');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ result: 1 })));
    expect(
      (await handleQuote(request(body, { 'x-vercel-forwarded-for': '192.0.2.1' }))).status,
    ).toBe(403);
  });
  it('rejects a challenge issued for another hostname', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret');
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'public');
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(Response.json({ result: 1 }))
        .mockResolvedValueOnce(Response.json({ success: true, hostname: 'wrong.example' })),
    );
    expect(
      (
        await handleQuote(
          request(
            { ...body, challengeToken: 'test-token' },
            { 'x-vercel-forwarded-for': '192.0.2.1' },
          ),
        )
      ).status,
    ).toBe(403);
  });
  it('escapes HTML in the message', async () => {
    const sends: RequestInit[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: RequestInit) => {
        if (url.includes('redis')) return Response.json({ result: 1 });
        sends.push(init);
        return Response.json({ id: 'accepted' });
      }),
    );
    await handleQuote(
      request(
        { ...body, name: '<script>alert(1)</script>' },
        { 'x-vercel-forwarded-for': '192.0.2.1' },
      ),
    );
    expect(JSON.parse(String(sends[0].body)).html).not.toContain('<script>');
    expect(JSON.parse(String(sends[0].body)).html).toContain('&lt;script&gt;');
  });
  it('accepts fixed-recipient mail and uses stable idempotency on retry', async () => {
    const sends: RequestInit[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: RequestInit) => {
        if (url.includes('redis')) return Response.json({ result: 1 });
        sends.push(init);
        return Response.json({ id: 'accepted' });
      }),
    );
    expect(
      (await handleQuote(request(body, { 'x-vercel-forwarded-for': '192.0.2.1' }))).status,
    ).toBe(200);
    expect(
      (await handleQuote(request(body, { 'x-vercel-forwarded-for': '192.0.2.1' }))).status,
    ).toBe(200);
    expect(new Headers(sends[0].headers).get('Idempotency-Key')).toBe(
      new Headers(sends[1].headers).get('Idempotency-Key'),
    );
    expect(JSON.parse(String(sends[0].body)).to).toEqual(['Plankraftwaterproofing@gmail.com']);
  });
  it('does not let form fields redirect delivery when the recipient environment setting is absent', async () => {
    vi.stubEnv('QUOTE_TO_EMAIL', '');
    const sends: RequestInit[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: RequestInit) => {
        if (url.includes('redis')) return Response.json({ result: 1 });
        sends.push(init);
        return Response.json({ id: 'accepted' });
      }),
    );
    const response = await handleQuote(
      request(
        {
          ...body,
          to: 'other@example.com',
          email: 'other@example.com',
          recipient: 'other@example.com',
        },
        { 'x-vercel-forwarded-for': '192.0.2.1' },
      ),
    );
    expect(response.status).toBe(200);
    expect(sends).toHaveLength(1);
    expect(JSON.parse(String(sends[0].body)).to).toEqual(['Plankraftwaterproofing@gmail.com']);
  });
});
