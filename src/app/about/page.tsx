import { PageIntro, PropertyVisual, QuoteButton, CallToAction } from '@/components/ui';
import { company } from '@/data/company';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'About Us',
    `Meet Plan Kraft: ${company.experience} years of waterproofing experience, ${company.projects} completed projects and islandwide service.`,
    '/about',
  );
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="ABOUT PLAN KRAFT"
        title="Built on experience. Focused on protection."
        explore={{ href: '#about-plan-kraft', label: 'Scroll to meet Plan Kraft' }}
      >
        <p>
          We help property owners across Sri Lanka take the next step towards better building
          protection.
        </p>
      </PageIntro>
      <section
        className="section"
        id="about-plan-kraft"
        tabIndex={-1}
        aria-label="About Plan Kraft"
      >
        <div className="container about-grid">
          <PropertyVisual />
          <div>
            <p className="eyebrow">LOCAL KNOWLEDGE. ISLANDWIDE REACH.</p>
            <h2>
              Protecting the places
              <br />
              you invest in.
            </h2>
            <p className="lead">
              PLAN KRAFT WATERPROOFING SOLUTIONS is based in Batticaloa and provides waterproofing,
              building protection and repair services across Sri Lanka.
            </p>
            <p>
              With {company.experience} years of experience and {company.projects} completed
              projects, our approach begins with understanding the issue. We assess the site, select
              a suitable treatment, explain the scope, and carry out and inspect the work.
            </p>
            <p>
              We value clear communication, careful workmanship and professional service. A free
              site inspection and quotation help you understand the proposed work before making a
              decision.
            </p>
            <QuoteButton />
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <p className="eyebrow">OUR APPROACH</p>
          <h2>Care that goes beyond the surface.</h2>
          <div className="values-grid">
            {[
              [
                'Understand first',
                'Assess the moisture signs and site conditions before recommending a treatment.',
              ],
              [
                'Explain the scope',
                'Make the proposed solution, sequence and applicable terms clear.',
              ],
              ['Work with care', 'Prepare, apply and inspect according to the selected system.'],
            ].map(([a, b]) => (
              <article key={a}>
                <h3>{a}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
          <p className="warranty-note">{company.warranty}</p>
        </div>
      </section>
      <CallToAction />
    </>
  );
}
