import { describe, expect, test } from 'vitest';
import {
  forminitEndpoint,
  quoteEmailFields,
  quoteInputFields,
  quoteDeliveryResult,
  quoteRecipient,
} from '@/lib/quote-delivery';
import { quoteSchema } from '@/lib/validation/quote';

describe('Forminit delivery contract', () => {
  test('keeps requests on the official endpoint and rejects missing or invalid IDs', () => {
    expect(forminitEndpoint('nilov0qnww9')).toBe('https://forminit.com/f/nilov0qnww9');
    expect(quoteRecipient).toBe('Plankraftwaterproofing@gmail.com');
    for (const id of [
      '',
      ' ',
      'https://other.invalid/form',
      '../form',
      'id?redirect=other',
      'x'.repeat(129),
    ])
      expect(forminitEndpoint(id)).toBeNull();
  });

  test('maps all form values to documented Forminit field blocks', () => {
    const form = new FormData();
    for (const [name, value] of Object.entries({
      'fi-sender-fullName': 'Test Customer',
      'fi-sender-phone': '077 123 4567',
      'fi-text-location': 'Batticaloa',
      'fi-text-service': 'roof',
      'fi-text-message': 'Please inspect a leak in the roof.',
      _gotcha: '',
    }))
      form.set(name, value);
    const input = quoteInputFields(form);
    const parsed = quoteSchema.parse({
      ...input,
      submissionId: '87bd4887-270a-4c0b-a7bc-a9130ea50bb5',
    });
    const fields = quoteEmailFields(
      parsed,
      'https://mathes2004.github.io/plan_kraft/request-quote/',
    );
    expect(fields).toEqual({
      'fi-sender-fullName': 'Test Customer',
      'fi-sender-phone': '+94771234567',
      'fi-text-location': 'Batticaloa',
      'fi-text-service': 'Roof / Rooftop Waterproofing',
      'fi-text-message': 'Please inspect a leak in the roof.',
      'fi-text-reference': parsed.submissionId,
      'fi-url-source': 'https://mathes2004.github.io/plan_kraft/request-quote/',
      _gotcha: '',
    });
    form.set('_gotcha', 'spam');
    expect(
      quoteSchema.safeParse({ ...quoteInputFields(form), submissionId: parsed.submissionId })
        .success,
    ).toBe(false);
  });

  test('acknowledges only a documented successful submission and never redirects', () => {
    expect(
      quoteDeliveryResult(200, {
        success: true,
        submission: { hashId: 'accepted-id' },
        redirectUrl: 'https://other.invalid',
      }),
    ).toMatchObject({ ok: true });
    for (const [status, body] of [
      [503, { success: true, submission: { hashId: 'id' } }],
      [200, { success: true }],
      [200, { success: 'true', submission: { hashId: 'id' } }],
      [200, { success: true, submission: { hashId: ' ' } }],
      [200, { success: true, error: 'FAILED', submission: { hashId: 'id' } }],
      [200, null],
      [200, '<html>Error</html>'],
    ] as const)
      expect(quoteDeliveryResult(status, body).ok).toBe(false);
  });

  test('handles limits and disabled or misconfigured forms without exposing provider text', () => {
    expect(quoteDeliveryResult(429, {}).message).toContain('five seconds');
    for (const error of ['FORM_DISABLED', 'FORM_NOT_FOUND', 'LIMIT_EXPIRED', 'MISSING_API_KEY']) {
      const result = quoteDeliveryResult(403, {
        success: false,
        error,
        message: 'Internal details',
      });
      expect(result).toMatchObject({ ok: false });
      expect(result.message).toContain('temporarily unavailable');
      expect(result.message).not.toContain('Internal details');
    }
  });
});
