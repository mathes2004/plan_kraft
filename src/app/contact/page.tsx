import { PageIntro, QuoteButton } from '@/components/ui';
import { company, mapQuery } from '@/data/company';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Contact Us',
    'Contact Plan Kraft in Batticaloa for islandwide waterproofing. Call, WhatsApp or request a free inspection.',
    '/contact',
  );
export default function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="CONTACT US"
        title="Let’s talk about your property."
        explore={{ href: '#contact-details', label: 'Scroll for contact details' }}
      >
        <p>
          A question, a leak, or a project in mind? Start with a free site inspection and quotation.
        </p>
      </PageIntro>
      <section className="section" id="contact-details" tabIndex={-1} aria-label="Contact details">
        <div className="container contact-grid">
          <div>
            <p className="eyebrow">WE’RE HERE TO HELP</p>
            <h2>
              One conversation.
              <br />A clearer next step.
            </h2>
            <div className="contact-details">
              <div>
                <span>01 / CALL US</span>
                <a href={company.tel}>{company.phone}</a>
                <a href={company.secondaryTel}>{company.secondaryPhone}</a>
              </div>
              <div>
                <span>02 / WRITE TO US</span>
                <a href={`mailto:${company.email}`}>{company.email}</a>
                <a href={company.whatsapp}>Chat on WhatsApp ↗</a>
              </div>
              <div>
                <span>03 / FIND US</span>
                <p>{company.address}</p>
                <p>Islandwide service — all Sri Lanka</p>
              </div>
            </div>
            <QuoteButton />
          </div>
          <div>
            <iframe
              className="map"
              title="Address-search map for Plan Kraft in Arayampathy, Batticaloa"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            />
            <p className="small">
              Address-search map. The precise office entrance pin is pending verification.
            </p>
            <a
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            >
              Open Address in Google Maps ↗
            </a>
            <p className="small">{company.name}</p>
          </div>
        </div>
      </section>
    </>
  );
}
