import { Suspense } from 'react';
import { PageIntro } from '@/components/ui';
import QuoteForm from '@/components/QuoteForm';
import { company } from '@/data/company';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Request a Quote',
    'Request your free site inspection and waterproofing quotation from Plan Kraft.',
    '/request-quote',
  );
export default function RequestQuote() {
  return (
    <>
      <PageIntro eyebrow="REQUEST A FREE QUOTE" title="Tell us what needs protecting.">
        <p>Share a few details about your property. Let’s find the right next step together.</p>
      </PageIntro>
      <section className="section">
        <div className="container quote-layout">
          <aside>
            <p className="eyebrow">START WITH CONFIDENCE</p>
            <h2>
              Expert advice.
              <br />
              No inspection fee.
            </h2>
            <ul className="check-list">
              <li>Free site inspection</li>
              <li>Free quotation</li>
              <li>Islandwide service</li>
              <li>{company.experience} years of experience</li>
            </ul>
            <div className="quote-help">
              <h3>Prefer a conversation?</h3>
              <p>Talk to us directly about your property.</p>
              <a className="text-link" href={company.whatsapp}>
                WhatsApp Us ↗
              </a>
              <a href={company.tel}>{company.phone}</a>
            </div>
            <p className="small">{company.warranty}</p>
          </aside>
          <Suspense fallback={<p role="status">Loading enquiry form…</p>}>
            <QuoteForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
