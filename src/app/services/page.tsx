import { ServicePhoto } from '@/components/ServicePhoto';
import { PageIntro, QuoteButton, CallToAction } from '@/components/ui';
import { services } from '@/data/services';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Our Services',
    'Sixteen inspection-led waterproofing, coating and repair services for properties across Sri Lanka.',
    '/services',
  );
export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="OUR SERVICES"
        title="The right solution. From the ground up."
        explore={{ href: '#our-services', label: 'Scroll to explore services' }}
      >
        <p>
          Professional waterproofing for the places that matter. Every treatment starts with
          understanding your property.
        </p>
      </PageIntro>
      <section
        className="section"
        id="our-services"
        tabIndex={-1}
        aria-label="Waterproofing services"
      >
        <div className="container">
          <div className="service-index">
            {services.map((s) => (
              <a href={`#${s.id}`} key={s.id}>
                {s.short} ↘
              </a>
            ))}
          </div>
          <div className="services-list">
            {services.map((s, i) => (
              <article className="service-detail" id={s.id} key={s.id}>
                <ServicePhoto image={s.image} sizes="(max-width: 700px) 88vw, 45vw" />
                <div>
                  <p className="eyebrow">
                    {String(i + 1).padStart(2, '0')} / WATERPROOFING & REPAIR
                  </p>
                  <h2>{s.title}</h2>
                  <p className="lead">{s.solution}</p>
                  <dl>
                    <dt>Common problems</dt>
                    <dd>{s.problem}</dd>
                    <dt>How we approach it</dt>
                    <dd>{s.process}</dd>
                    <dt>The benefit</dt>
                    <dd>{s.benefit}</dd>
                  </dl>
                  <p className="small">
                    Materials, testing and warranty terms depend on the selected service and actual
                    site conditions.
                  </p>
                  <QuoteButton service={s.id} label="Discuss This Service" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  );
}
