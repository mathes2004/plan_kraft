import { describe, it, expect } from 'vitest';
import { normalizePhone, quoteSchema } from '@/lib/validation/quote';
describe('Sri Lankan mobile validation', () => {
  it.each(['077 123 4567', '(077)123-4567', '94771234567', '+94 77 123 4567'])(
    'normalizes %s',
    (p) => expect(normalizePhone(p)).toBe('+94771234567'),
  );
  it.each(['0112345678', '+44771234567', '077123', '077123456789', 'abc'])('rejects %s', (phone) =>
    expect(quoteSchema.safeParse({ ...valid, phone }).success).toBe(false),
  );
});
export const valid = {
  name: 'Test Customer',
  phone: '0771234567',
  location: 'Batticaloa',
  serviceId: 'roof',
  description: 'Water is entering through the roof.',
  website: '',
  submissionId: '38db91a6-a261-45c8-b011-47b622825ecc',
};
describe('quote schema', () => {
  it('accepts and normalizes a valid enquiry', () =>
    expect(quoteSchema.parse(valid).phone).toBe('+94771234567'));
  it('rejects unsupported services', () =>
    expect(quoteSchema.safeParse({ ...valid, serviceId: 'other' }).success).toBe(false));
  it('rejects a populated honeypot', () =>
    expect(quoteSchema.safeParse({ ...valid, website: 'spam' }).success).toBe(false));
  it('rejects oversized description', () =>
    expect(quoteSchema.safeParse({ ...valid, description: 'x'.repeat(5001) }).success).toBe(false));
  it('rejects missing submission identity', () =>
    expect(quoteSchema.safeParse({ ...valid, submissionId: '' }).success).toBe(false));
});
