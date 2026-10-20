import Link from 'next/link';
import { ServicePhoto } from '@/components/ServicePhoto';
import ServicesCarousel from '@/components/ServicesCarousel';
import { QuoteButton, CallToAction } from '@/components/ui';
import { homepageServices } from '@/data/services';
import { company } from '@/data/company';
import Gallery from '@/components/Gallery';
import BeforeAfter from '@/components/BeforeAfter';
import { homepageComparison } from '@/data/projects';
import { metadata } from '@/lib/seo';
import { withBasePath } from '@/lib/paths';
export const generateMetadata = () =>
  metadata(
    'Waterproofing Solutions Sri Lanka',
    `Professional waterproofing, ${company.experience} years of experience and islandwide service.`,
    '/',
  );
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> BUILT FOR SRI LANKA. BUILT TO LAST.
          </p>
          <h1>
            Protecting Your
            <br />
            Property.
            <span>
              Preserving Your
              <br />
              Investment.
            </span>
          </h1>
          <p className="hero-description">
            Professional waterproofing and building protection solutions backed by{' '}
            {company.experience} years of experience, serving clients across Sri Lanka.
          </p>
          <div className="actions">
            <QuoteButton />
            <Link className="button outline hero-services" href="/services">
              <span className="action-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="m5 3 7 5-7 5V3Z" stroke="currentColor" strokeLinejoin="round" />
                </svg>
              </span>
              Explore Our Services
            </Link>
          </div>
          <div className="hero-foot">
            <span className="mini-shield">✓</span>
            <span>Expert care. Thoughtful solutions. Lasting protection.</span>
          </div>
        </div>
        <div className="hero-visual">
          <iframe
            className="hero-animation"
            src={withBasePath('/banner/index.html')}
            title="Interactive 3D house: compare roof protection, explore layers, and control the rain"
          />
        </div>
      </section>
      <section className="trust" aria-label="Trust and experience">
        <div className="container trust-grid">
          <div>
            <strong>
              {company.experience}
              <span>years</span>
            </strong>
            <p>Hands-on experience</p>
          </div>
          <div>
            <strong>{company.projects}</strong>
            <p>Completed projects</p>
          </div>
          <div>
            <strong>
              Islandwide<span>↗</span>
            </strong>
            <p>Across Sri Lanka</p>
          </div>
          <div>
            <strong>Always free</strong>
            <p>Site inspection & quotation</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">WHAT WE DO</p>
              <h2>
                Every surface.
                <br />
                The right protection.
              </h2>
            </div>
            <div>
              <p>
                From a leaking roof to a damp wall, start with
                <br className="desktop" /> a solution shaped around your property.
              </p>
              <Link className="text-link" href="/services">
                View All Services ↗
              </Link>
            </div>
          </div>
          <ServicesCarousel>
            {homepageServices.map((s, i) => (
              <Link
                className="preview-card"
                data-service={s.id}
                key={s.id}
                href={`/services#${s.id}`}
              >
                <ServicePhoto
                  image={s.image}
                  sizes="(max-width: 700px) 76vw, (max-width: 1000px) 44vw, 30vw"
                />
                <div className="preview-body">
                  <small>0{i + 1} / WATERPROOFING</small>
                  <h3>
                    {s.short}
                    <span>↗</span>
                  </h3>
                  <p>{s.benefit}</p>
                </div>
              </Link>
            ))}
          </ServicesCarousel>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR WORK</p>
              <h2>Protection in practice.</h2>
            </div>
            <Link className="text-link" href="/projects">
              Explore Our Projects ↗
            </Link>
          </div>
          <Gallery featured />
        </div>
      </section>
      <section className="section" aria-label="Before and after project comparison">
        <div className="container comparison-layout">
          <div>
            <p className="eyebrow">THE DIFFERENCE IS IN THE DETAILS</p>
            <h2>
              A clearer view
              <br />
              of better protection.
            </h2>
            <p>
              See the difference in our exterior work. Drag the divider to compare the project
              before work started and after completion.
            </p>
            <Link className="text-link" href="/projects">
              See Our Work ↗
            </Link>
          </div>
          <BeforeAfter pair={homepageComparison} />
        </div>
      </section>
      <section className="section why">
        <div className="container why-grid">
          <div>
            <p className="eyebrow">WHY PLAN KRAFT</p>
            <h2>
              Your property deserves
              <br />
              experienced hands.
            </h2>
            <p>
              Practical expertise. An inspection-led approach.
              <br />
              Care at every stage of the work.
            </p>
            <QuoteButton />
          </div>
          <div className="reasons">
            {[
              [
                `${company.experience} years of experience`,
                'Knowledge built through hands-on waterproofing work.',
              ],
              [
                `${company.projects} completed projects`,
                'Experience across waterproofing and building protection.',
              ],
              ['Islandwide service', 'Based in Batticaloa. Serving all Sri Lanka.'],
              [
                'Waterproofing expertise',
                'Treatment selected to suit the surface and site conditions.',
              ],
              [
                'Free inspection & quotation',
                'Understand the problem and the proposed scope first.',
              ],
              ['Service-dependent warranty', company.warranty],
            ].map(([a, b], i) => (
              <div key={a}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{a}</h3>
                  <p>{b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  );
}
