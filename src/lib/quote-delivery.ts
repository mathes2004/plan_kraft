import { services } from '@/data/services';
import { quoteConfig } from '@/data/quote-config';
import type { z } from 'zod';
import type { quoteSchema } from '@/lib/validation/quote';

export const quoteRecipient = quoteConfig.recipient;
export function forminitEndpoint(formId: string) {
  const id = formId.trim();
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 128 ? `https://forminit.com/f/${id}` : null;
}
export const quoteDeliveryEndpoint = quoteConfig.enabled
  ? forminitEndpoint(quoteConfig.formId)
  : null;

export const quoteFieldNames = {
  name: 'fi-sender-fullName',
  phone: 'fi-sender-phone',
  // "location" collides with Forminit's location block; use a distinct project field.
  location: 'fi-text-projectDistrict',
  serviceId: 'fi-text-service',
  description: 'fi-text-message',
} as const;

export function quoteInputFields(form: FormData) {
  return {
    ...Object.fromEntries(
      Object.entries(quoteFieldNames).map(([key, name]) => [key, form.get(name)]),
    ),
    website: form.get('_gotcha') || '',
  };
}

export function quoteEmailFields(data: z.output<typeof quoteSchema>, sourceUrl: string) {
  return {
    'fi-sender-fullName': data.name,
    'fi-sender-phone': data.phone,
    [quoteFieldNames.location]: data.location,
    'fi-text-service': services.find((service) => service.id === data.serviceId)!.title,
    'fi-text-message': data.description,
    'fi-text-reference': data.submissionId,
    'fi-url-source': sourceUrl,
    _gotcha: data.website || '',
  };
}

export function quoteDeliveryResult(status: number, body: unknown) {
  const data = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  if (status === 429 || data.error === 'TOO_MANY_REQUESTS')
    return {
      ok: false,
      message:
        'Please wait at least five seconds before trying again. Your details have been kept.',
    };
  const submission =
    data.submission && typeof data.submission === 'object'
      ? (data.submission as Record<string, unknown>)
      : {};
  if (
    status >= 200 &&
    status < 300 &&
    data.success === true &&
    !data.error &&
    typeof submission.hashId === 'string' &&
    submission.hashId.trim()
  )
    return {
      ok: true,
      message:
        'Your enquiry has been accepted. We’ll contact you using the details provided. For urgent help, please call or WhatsApp us.',
    };
  if (
    ['MISSING_API_KEY', 'FORM_NOT_FOUND', 'FORM_DISABLED', 'LIMIT_EXPIRED'].includes(
      String(data.error),
    )
  )
    return {
      ok: false,
      message:
        'Online enquiries are temporarily unavailable. Your details have been kept; please call or WhatsApp us for your quotation.',
    };
  return {
    ok: false,
    message:
      'We could not confirm your enquiry. Your details have been kept; please try again or contact us on WhatsApp.',
  };
}
