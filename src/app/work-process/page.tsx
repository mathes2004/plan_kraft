import { PageIntro } from '@/components/ui';
import ProcessExperience from '@/components/ProcessExperience';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Our Work Process',
    'Explore an interactive eight-stage illustration of a representative waterproofing workflow.',
    '/work-process',
  );
export default function WorkProcess() {
  return (
    <>
      <PageIntro
        eyebrow="OUR WORK PROCESS"
        title="Good protection starts with a clear process."
        explore={{ href: '#our-process', label: 'Scroll to explore our process' }}
      >
        <p>Explore a representative waterproofing workflow, one layer at a time.</p>
      </PageIntro>
      <section
        className="section"
        id="our-process"
        tabIndex={-1}
        aria-label="Waterproofing workflow"
      >
        <div className="container">
          <ProcessExperience />
        </div>
      </section>
    </>
  );
}
