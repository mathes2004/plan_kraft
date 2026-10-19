'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  publishedProjects,
  categories,
  matchesProjectCategory,
  type Project,
} from '@/data/projects';

const enquiryUrl = (p: Project) =>
  `/request-quote?service=${p.serviceIds[0]}&project=${encodeURIComponent(p.title)}`;

function ProjectFacts({ project }: { project: Project }) {
  if (!project.duration && !project.coverage && !project.warranty) return null;
  return (
    <dl className="project-facts">
      {project.duration && (
        <div>
          <dt>Duration</dt>
          <dd>{project.duration}</dd>
        </div>
      )}
      {project.coverage && (
        <div>
          <dt>Coverage</dt>
          <dd>{project.coverage}</dd>
        </div>
      )}
      {project.warranty && (
        <div>
          <dt>Warranty*</dt>
          <dd>{project.warranty}</dd>
        </div>
      )}
    </dl>
  );
}

export default function Gallery({ featured = false }: { featured?: boolean }) {
  const ProjectHeading = featured ? 'h3' : 'h2';
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Project | null>(null);
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const list = publishedProjects.filter(
    (p) => (!featured || p.featured) && matchesProjectCategory(p, filter),
  );
  const images = selected?.images.filter((i) => i.approved && i.kind === 'genuine-project') || [];

  useEffect(() => {
    if (!selected) return;
    dialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  function open(project: Project, photoIndex: number, trigger: HTMLElement) {
    opener.current = trigger;
    setIndex(photoIndex);
    setSelected(project);
  }
  function close() {
    dialog.current?.close();
    setSelected(null);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }
  function move(delta: number) {
    setIndex((i) => (i + delta + images.length) % images.length);
  }

  return (
    <>
      {!featured && (
        <div className="portfolio-toolbar">
          <div className="filters" role="group" aria-label="Filter projects">
            {[['all', 'All projects'], ...categories.map((c) => [c, c])].map(([id, label]) => (
              <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>
                {label}
                <span>
                  {id === 'all'
                    ? publishedProjects.length
                    : publishedProjects.filter((p) => matchesProjectCategory(p, id)).length}
                </span>
              </button>
            ))}
          </div>
          <p className="portfolio-count" role="status">
            {list.length.toString().padStart(2, '0')} {list.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
      )}

      {list.length ? (
        <div
          className={`project-grid ${featured ? 'project-grid-featured' : 'project-grid-showcase'}`}
        >
          {list.slice(0, featured ? 3 : undefined).map((p) => {
            const photos = p.images.filter((i) => i.approved && i.kind === 'genuine-project');
            const cover = photos[p.coverIndex] || photos[0];
            return (
              <article className="project-card" key={p.id}>
                <div className="project-media">
                  <button
                    className="project-image"
                    onClick={(e) => open(p, p.coverIndex, e.currentTarget)}
                    aria-label={`Open ${p.title} gallery`}
                  >
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      placeholder="blur"
                      sizes={
                        featured ? '(max-width: 700px) 90vw, 30vw' : '(max-width: 900px) 90vw, 50vw'
                      }
                    />
                    <span className="project-photo-tag">
                      <span />
                      {p.number === 316 ? 'Installation complete' : 'Completed project'}
                    </span>
                    <span className="project-image-footer">
                      <span>
                        View project <span aria-hidden="true">↗</span>
                      </span>
                      <span>{photos.length.toString().padStart(2, '0')} photos</span>
                    </span>
                  </button>
                  {!featured && (
                    <div
                      className="project-contact-sheet"
                      aria-label={`${p.title} photographs`}
                      style={{ gridTemplateColumns: `repeat(${photos.length}, minmax(0, 1fr))` }}
                    >
                      {photos.map((photo, i) => (
                        <button
                          key={photo.src.src}
                          onClick={(e) => open(p, i, e.currentTarget)}
                          aria-label={`View ${p.title}: ${photo.caption}`}
                        >
                          <span className="project-thumb">
                            <Image
                              src={photo.src}
                              alt=""
                              fill
                              sizes="(max-width: 900px) 28vw, 16vw"
                            />
                          </span>
                          <span className="project-thumb-caption">
                            <span>0{i + 1}</span>
                            {photo.caption}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="project-details">
                  <div className="project-kicker">
                    <span>PROJECT / {p.number}</span>
                    <span>{p.location}</span>
                  </div>
                  <ProjectHeading className="project-title">{p.title}</ProjectHeading>
                  <p className="project-summary">{p.summary}</p>
                  {!featured && <p className="project-description">{p.description}</p>}
                  <ProjectFacts project={p} />
                  {!featured && (
                    <div className="project-materials">
                      <span className="project-label">SYSTEM USED</span>
                      <p>{p.materials.join(' · ')}</p>
                    </div>
                  )}
                  <div className="project-actions">
                    <button
                      className="project-view"
                      onClick={(e) => open(p, p.coverIndex, e.currentTarget)}
                    >
                      Explore project <span aria-hidden="true">↗</span>
                    </button>
                    {!featured && (
                      <Link href={enquiryUrl(p)}>
                        Plan a similar project <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="pending-portfolio">
          <div>
            <h3>No projects in this category yet.</h3>
            <p>Speak with us about work relevant to your property.</p>
            <Link className="text-link" href="/request-quote">
              Discuss your project ↗
            </Link>
          </div>
        </div>
      )}
      {list.some((project) => project.warranty) && (
        <p className="project-warranty-note">
          *Project-specific warranty. Coverage and terms apply; confirmed with your quotation.
        </p>
      )}

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={selected ? `${selected.title} — project ${selected.number}` : 'Project gallery'}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          const bounds = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < bounds.left ||
            e.clientX > bounds.right ||
            e.clientY < bounds.top ||
            e.clientY > bounds.bottom
          )
            close();
        }}
        onKeyDown={(e) => {
          if (e.altKey || e.ctrlKey || e.metaKey) return;
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            move(e.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        {selected && images[index] && (
          <>
            <div className="lightbox-bar">
              <span className="project-label">
                PLAN KRAFT <span aria-hidden="true">/</span> PROJECT {selected.number}
              </span>
              <button onClick={close} autoFocus aria-label="Close gallery">
                Close <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="lightbox-layout">
              <div className="lightbox-gallery">
                <div className="lightbox-image">
                  <Image
                    key={images[index].src.src}
                    src={images[index].src}
                    alt={images[index].alt}
                    fill
                    sizes="(max-width: 900px) 90vw, 60vw"
                  />
                </div>
                <div className="lightbox-controls">
                  <button onClick={() => move(-1)} aria-label="Previous photo">
                    ←
                  </button>
                  <p aria-live="polite" aria-atomic="true">
                    <span>
                      {index + 1} / {images.length}
                    </span>
                    {images[index].caption}
                  </p>
                  <button onClick={() => move(1)} aria-label="Next photo">
                    →
                  </button>
                </div>
                <div
                  className="lightbox-thumbnails"
                  role="group"
                  aria-label="Choose a project photo"
                >
                  {images.map((photo, i) => (
                    <button
                      key={photo.src.src}
                      onClick={() => setIndex(i)}
                      aria-pressed={index === i}
                      aria-label={`Photo ${i + 1}: ${photo.caption}`}
                    >
                      <Image src={photo.src} alt="" fill sizes="100px" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="lightbox-details">
                <p className="eyebrow">COMPLETED IN {selected.location?.toUpperCase()}</p>
                <h2>{selected.title}</h2>
                <p>{selected.description}</p>
                <ProjectFacts project={selected} />
                <h3>Scope of work</h3>
                <ul>
                  {selected.scope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h3>System used</h3>
                <p>{selected.materials.join(' · ')}</p>
                {selected.warranty && (
                  <p className="project-warranty-note">
                    *Project-specific warranty; coverage and terms apply.
                  </p>
                )}
                <Link className="button" href={enquiryUrl(selected)}>
                  Plan a similar project <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
