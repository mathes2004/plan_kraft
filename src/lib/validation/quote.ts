import { z } from 'zod';
import { services } from '@/data/services';
import { sriLankaDistricts } from '@/data/districts';
export function normalizePhone(raw: string) {
  let p = raw.replace(/[\s()\-]/g, '');
  if (/^07\d{8}$/.test(p)) p = '+94' + p.slice(1);
  else if (/^947\d{8}$/.test(p)) p = '+' + p;
  return p;
}
export const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name (at least 2 characters).').max(100),
  phone: z
    .string()
    .max(40)
    .transform(normalizePhone)
    .refine(
      (p) => /^\+947\d{8}$/.test(p),
      'Enter a valid Sri Lankan mobile number, such as 077 123 4567.',
    ),
  location: z.enum(sriLankaDistricts, {
    error: 'Choose the district where your project is located.',
  }),
  serviceId: z
    .string()
    .refine((id) => services.some((s) => s.id === id), 'Choose a waterproofing service.'),
  description: z
    .string()
    .trim()
    .min(10, 'Describe the problem in at least 10 characters.')
    .max(5000),
  website: z.string().max(0).optional(),
  challengeToken: z.string().max(2048).optional(),
  submissionId: z.string().uuid(),
});
export type QuoteInput = z.input<typeof quoteSchema>;
