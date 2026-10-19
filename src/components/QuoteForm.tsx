'use client';
import { useSearchParams } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { services } from '@/data/services';
import { company } from '@/data/company';
import { sriLankaDistricts } from '@/data/districts';
import { quoteSchema } from '@/lib/validation/quote';
import {
  quoteDeliveryEndpoint,
  quoteDeliveryResult,
  quoteEmailFields,
  quoteFieldNames,
  quoteInputFields,
} from '@/lib/quote-delivery';

export default function QuoteForm() {
  const query = useSearchParams();
  const requested = query.get('service') || '';
  const initial = services.some((s) => s.id === requested) ? requested : '';
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const summary = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const submission = useRef('');
  const previous = useRef('');
  const inFlight = useRef(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    setResult(null);
    const data = quoteInputFields(new FormData(e.currentTarget));
    const content = JSON.stringify(data);
    if (previous.current !== content || !submission.current) {
      submission.current = crypto.randomUUID();
      previous.current = content;
    }
    const parsed = quoteSchema.safeParse({ ...data, submissionId: submission.current });
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) fields[String(issue.path[0])] = issue.message;
      setErrors(fields);
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setErrors({});
    if (!quoteDeliveryEndpoint) {
      setResult({
        ok: false,
        message:
          'Online enquiries are temporarily unavailable. Please call or WhatsApp us for your quotation.',
      });
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setBusy(true);
    inFlight.current = true;
    try {
      const response = await fetch(quoteDeliveryEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(
          quoteEmailFields(parsed.data, window.location.origin + window.location.pathname),
        ),
        signal: AbortSignal.timeout(20000),
      });
      const delivery = quoteDeliveryResult(response.status, await response.json());
      setResult(delivery);
      if (delivery.ok) {
        form.current?.reset();
        submission.current = '';
        previous.current = '';
      }
    } catch {
      setResult({
        ok: false,
        message:
          'We could not confirm your enquiry. Your details have been kept; please try again or contact us on WhatsApp.',
      });
    } finally {
      inFlight.current = false;
      setBusy(false);
      requestAnimationFrame(() => summary.current?.focus());
    }
  }
  const field = (id: 'name' | 'phone', label: string, type = 'text', max = 200) => (
    <div className="field">
      <label htmlFor={id}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <input
        id={id}
        name={quoteFieldNames[id]}
        type={type}
        required
        maxLength={max}
        autoComplete={id === 'name' ? 'name' : id === 'phone' ? 'tel' : undefined}
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
      />
      {errors[id] && (
        <p className="field-error" id={`${id}-error`}>
          {errors[id]}
        </p>
      )}
    </div>
  );
  return (
    <form
      ref={form}
      className="quote-form"
      action={quoteDeliveryEndpoint || undefined}
      method="POST"
      onSubmit={submit}
      noValidate
      aria-busy={busy}
    >
      <p className="small">All fields marked * are required.</p>
      {!quoteDeliveryEndpoint && (
        <p role="status" className="form-message">
          Online enquiries are temporarily unavailable. Please call or WhatsApp us for your
          quotation.
        </p>
      )}
      {(Object.keys(errors).length > 0 || result) && (
        <div
          className={`form-message ${result?.ok ? 'success' : ''}`}
          ref={summary}
          tabIndex={-1}
          role="status"
        >
          {result?.message || 'Please check the highlighted fields.'}
          {Object.keys(errors).length > 0 && (
            <ul>
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>
                  <a href={`#${key}`}>{value}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="form-row">
        {field('name', 'Full name', 'text', 100)}
        {field('phone', 'Phone / WhatsApp number', 'tel', 40)}
      </div>
      <div className="field">
        <label htmlFor="location">District / project location *</label>
        <select
          id="location"
          name={quoteFieldNames.location}
          required
          defaultValue=""
          autoComplete="address-level1"
          aria-invalid={!!errors.location}
          aria-describedby={errors.location ? 'location-error' : undefined}
        >
          <option value="" disabled>
            Choose a district
          </option>
          {sriLankaDistricts.map((district) => (
            <option value={district} key={district}>
              {district}
            </option>
          ))}
        </select>
        {errors.location && (
          <p className="field-error" id="location-error">
            {errors.location}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="serviceId">Required service *</label>
        <select
          id="serviceId"
          name={quoteFieldNames.serviceId}
          required
          defaultValue={initial}
          aria-invalid={!!errors.serviceId}
          aria-describedby={errors.serviceId ? 'serviceId-error' : undefined}
        >
          <option value="">Choose a service</option>
          {services.map((s) => (
            <option value={s.id} key={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        {errors.serviceId && (
          <p className="field-error" id="serviceId-error">
            {errors.serviceId}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="description">Tell us about your project / leakage problem *</label>
        <textarea
          id="description"
          name={quoteFieldNames.description}
          rows={6}
          minLength={10}
          maxLength={5000}
          required
          defaultValue={
            query.get('project') ? `Enquiry about work similar to: ${query.get('project')}` : ''
          }
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p className="field-error" id="description-error">
            {errors.description}
          </p>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="_gotcha" type="hidden" autoComplete="off" />
      </div>
      <p className="small">Your details are used to respond to this enquiry.</p>
      <button className="button" type="submit" disabled={busy || !quoteDeliveryEndpoint}>
        {busy ? 'Sending enquiry…' : 'Send Enquiry'} <span>↗</span>
      </button>
      <p className="small">
        Or{' '}
        <a className="text-link" href={company.whatsapp}>
          choose to chat on WhatsApp ↗
        </a>
      </p>
    </form>
  );
}
