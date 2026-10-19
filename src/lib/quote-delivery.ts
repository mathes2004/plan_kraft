import { services } from '@/data/services';
import type { z } from 'zod';
import type { quoteSchema } from '@/lib/validation/quote';

export const quoteRecipient = 'mathesmathes20005@gmail.com';
export const quoteFormAction = `https://formsubmit.co/${quoteRecipient}`;
export const quoteDeliveryEndpoint = `https://formsubmit.co/ajax/${quoteRecipient}`;

export function quoteEmailFields(data: z.output<typeof quoteSchema>, sourceUrl: string) {
  return {
    name: data.name,
    phone: data.phone,
    location: data.location,
    service: services.find((service) => service.id === data.serviceId)!.title,
    message: data.description,
    reference: data.submissionId,
    _subject: 'PLAN KRAFT — New quotation enquiry',
    _template: 'table',
    _honey: data.website || '',
    _url: sourceUrl,
  };
}

export function quoteDeliveryResult(responseOk: boolean, body: unknown) {
  const data = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const activationPending =
    typeof data.message === 'string' && /activat|confirm.*(?:email|form)/i.test(data.message);
  if (activationPending)
    return {
      ok: false,
      message:
        'Online enquiries are awaiting email activation. Please call or WhatsApp us for your quotation.',
    };
  if (responseOk && (data.success === true || data.success === 'true'))
    return {
      ok: true,
      message:
        'Your enquiry has been accepted. We’ll contact you using the details provided. For urgent help, please call or WhatsApp us.',
    };
  return {
    ok: false,
    message:
      'We could not confirm your enquiry. Your details have been kept; please try again or contact us on WhatsApp.',
  };
}
