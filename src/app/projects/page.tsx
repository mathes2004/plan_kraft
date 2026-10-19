import { CallToAction, ScrollCue } from '@/components/ui';
import Gallery from '@/components/Gallery';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Our Projects',
    'Explore completed waterproofing and epoxy grout restoration projects in Sri Lanka, with genuine site photographs, materials and project details.',
    '/projects',
  );
export default function Projects() {
  return (
    <>
      <section className="portfolio-intro">
        <div className="container">
          <p className="eyebrow">
            <span className="status-dot" /> OUR PROJECTS
          </p>
          <div className="portfolio-intro-grid">
            <h1>
              Real work.
              <br />
              <span>Lasting protection.</span>
            </h1>
            <div className="portfolio-intro-copy">
              <p>
                Good protection starts with the details. Explore our completed projects, from the
                first preparation to the final finish.
              </p>
              <ScrollCue href="#completed-projects" label="Scroll to explore projects" />
            </div>
          </div>
          <div className="portfolio-intro-foot">
            <span>ON SITE. IN DETAIL.</span>
            <span>
              BATTICALOA & AMPARA <span aria-hidden="true">↗</span>
            </span>
          </div>
        </div>
      </section>
      <section
        className="section portfolio-section"
        id="completed-projects"
        tabIndex={-1}
        aria-label="Completed projects"
      >
        <div className="container">
          <Gallery />
        </div>
      </section>
      <CallToAction />
    </>
  );
}
