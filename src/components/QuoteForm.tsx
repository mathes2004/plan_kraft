'use client';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { services } from '@/data/services';
import { company } from '@/data/company';
import { quoteSchema } from '@/lib/validation/quote';
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}
export default function QuoteForm() {
  const query = useSearchParams();
  const requested = query.get('service') || '';
  const initial = services.some((s) => s.id === requested) ? requested : '';
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [token, setToken] = useState('');
  const [scriptReady, setScriptReady] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const challenge = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const submission = useRef('');
  const previous = useRef('');
  const inFlight = useRef(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!siteKey || !scriptReady || !challenge.current || !window.turnstile) return;
    widget.current = window.turnstile.render(challenge.current, {
      sitekey: siteKey,
      callback: (t: string) => setToken(t),
      'expired-callback': () => setToken(''),
      'error-callback': () => setToken(''),
    });
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
    };
  }, [scriptReady, siteKey]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    setResult(null);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const content = JSON.stringify(data);
    if (previous.current !== content || !submission.current) {
      submission.current = crypto.randomUUID();
      previous.current = content;
    }
    const payload = { ...data, challengeToken: token, submissionId: submission.current };
    const parsed = quoteSchema.safeParse(payload);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) fields[String(issue.path[0])] = issue.message;
      setErrors(fields);
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setErrors({});
    setBusy(true);
    inFlight.current = true;
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      setResult({ ok: response.ok, message: body.message });
      if (body.fieldErrors) setErrors(body.fieldErrors);
      if (response.ok) {
        form.current?.reset();
        submission.current = '';
        previous.current = '';
      }
    } catch {
      setResult({
        ok: false,
        message: 'We could not send your enquiry. Please try again or contact us on WhatsApp.',
      });
    } finally {
      inFlight.current = false;
      setBusy(false);
      setToken('');
      if (widget.current) window.turnstile?.reset(widget.current);
      requestAnimationFrame(() => summary.current?.focus());
    }
  }
  const field = (id: string, label: string, type = 'text', max = 200) => (
    <div className="field">
      <label htmlFor={id}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <input
        id={id}
        name={id}
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
    <form ref={form} className="quote-form" onSubmit={submit} noValidate aria-busy={busy}>
      <p className="small">All fields marked * are required.</p>
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
      {field('location', 'District / project location')}
      <div className="field">
        <label htmlFor="serviceId">Required service *</label>
        <select
          id="serviceId"
          name="serviceId"
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
          name="description"
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
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {siteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            onReady={() => setScriptReady(true)}
          />
          <div ref={challenge} />
        </>
      )}
      <p className="small">Your details are used to respond to this enquiry.</p>
      <button className="button" type="submit" disabled={busy || (!!siteKey && !token)}>
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
