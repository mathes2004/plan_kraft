import Link from 'next/link';
import Image from 'next/image';
import { company } from '@/data/company';
import { publishedProjects } from '@/data/projects';
export function QuoteButton({
  label = 'Request a Free Quote',
  service,
}: {
  label?: string;
  service?: string;
}) {
  return (
    <Link
      className="button"
      href={service ? `/request-quote?service=${service}` : '/request-quote'}
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
export function ScrollCue({ href, label }: { href: string; label: string }) {
  return (
    <a className="scroll-cue" href={href}>
      <span className="scroll-cue-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4v16m-6-6 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label}
    </a>
  );
}
export function PageIntro({
  eyebrow,
  title,
  children,
  explore,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  explore?: { href: string; label: string };
}) {
  return (
    <section className={`page-intro${explore ? ' page-intro-compact' : ''}`}>
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <div className="page-intro-layout">
          <h1>{title}</h1>
          <div className="intro-copy">
            {children}
            {explore && <ScrollCue {...explore} />}
          </div>
        </div>
      </div>
    </section>
  );
}
export function CallToAction() {
  return (
    <section className="cta section">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">LET’S SOLVE IT TOGETHER</p>
          <h2>
            Water Leakage Problems?
            <br />
            Let the Experts Help.
          </h2>
          <p>A better-protected property starts with a conversation.</p>
        </div>
        <div className="cta-actions">
          <QuoteButton />
          <a className="button outline light" href={company.whatsapp}>
            WhatsApp Us ↗
          </a>
          <a className="text-link" href={company.tel}>
            Call Now · {company.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
export function PropertyVisual({ hero = false }: { hero?: boolean }) {
  const project = publishedProjects.find(
    (project) => project.featured && project.serviceIds.includes('roof'),
  );
  const photo = project?.images[project.coverIndex];
  if (!photo) return <RoofIllustration />;
  return (
    <div className="roof-art photo-art">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 700px) 100vw, 50vw"
        preload={hero}
      />
    </div>
  );
}
export function RoofIllustration() {
  return (
    <div className="roof-art">
      <svg
        viewBox="0 0 900 650"
        role="img"
        aria-label="Illustration of a modern building with a waterproofed roof"
      >
        <defs>
          <linearGradient id="sky" x2="0" y2="1">
            <stop stopColor="#dbe9e9" />
            <stop offset="1" stopColor="#a6c7ce" />
          </linearGradient>
          <linearGradient id="roof" x2="1" y2="1">
            <stop stopColor="#057a98" />
            <stop offset="1" stopColor="#20b5c9" />
          </linearGradient>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" opacity=".12" />
          </pattern>
        </defs>
        <rect width="900" height="650" fill="url(#sky)" />
        <circle cx="740" cy="115" r="70" fill="#fff" opacity=".4" />
        <path d="M0 530 900 390V650H0Z" fill="#9aafa7" />
        <path d="m100 500 430-208 339 195-435 153Z" fill="#36535a" opacity=".2" />
        <path d="m173 306 385-135 220 140-384 155Z" fill="#fff" />
        <path d="m173 306 221 160v135L173 430Z" fill="#c4d5d6" />
        <path d="m394 466 384-155v132L394 601Z" fill="#e9efec" />
        <path d="m182 305 376-122 202 127-368 144Z" fill="url(#roof)" />
        <path d="m182 305 376-122 202 127-368 144Z" fill="url(#grid)" />
        <path d="m173 306 221 145 384-140v21L394 478 173 326Z" fill="#f5f7ed" />
        <path d="m218 354 51 35v66l-51-37Zm82 57 51 34v66l-51-36Z" fill="#375764" />
        <path
          d="m438 483 80-32v66l-80 33Zm120-48 80-32v66l-80 33Zm121-48 57-23v67l-57 22Z"
          fill="#65838b"
        />
        <path d="m271 280 239-80 112 72-239 90Z" fill="#30c8cf" opacity=".4" />
        <path d="m206 307 180 126 356-125" stroke="#d4df37" strokeWidth="5" fill="none" />
        <path
          d="M105 155v42m32-18v42m-64-1v42m650-220v42m32-18v42"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".5"
        />
      </svg>
      <span className="art-caption">Architectural illustration · project photography pending</span>
    </div>
  );
}
