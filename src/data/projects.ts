import type { StaticImageData } from 'next/image';
import exteriorBeforeImage from '@/assets/before-after/exterior-before.jpg';
import exteriorAfterImage from '@/assets/before-after/exterior-after.jpg';
import bathroomApplication from '@/assets/projects/335/bathroom-coating-application.jpg';
import bathroomReinforcement from '@/assets/projects/335/bathroom-pipe-reinforcement.jpg';
import bathroomComplete from '@/assets/projects/335/bathroom-completed-waterproofing.jpg';
import roofPreparation from '@/assets/projects/333/rooftop-surface-preparation.jpg';
import roofApplication from '@/assets/projects/333/rooftop-coating-application.jpg';
import roofComplete from '@/assets/projects/333/rooftop-completed-waterproofing.jpg';
import waterbarOverview from '@/assets/projects/316/sump-tank-waterbar-overview.jpg';
import waterbarInstallation from '@/assets/projects/316/sump-tank-waterbar-installation.jpg';
import waterbarDetail from '@/assets/projects/316/sump-tank-waterbar-detail.jpg';
import groutRemoval from '@/assets/projects/318/tile-grout-removal.jpg';
import groutApplication from '@/assets/projects/318/epoxy-grout-application.jpg';
import groutFinishing from '@/assets/projects/318/epoxy-grout-finishing.jpg';
import amparaPreparation from '@/assets/projects/314/rooftop-surface-preparation.jpg';
import amparaCoating from '@/assets/projects/314/rooftop-completed-coating.jpg';
import sumpPreparation from '@/assets/projects/310/sump-base-surface-preparation.jpg';
import sumpReinforcement from '@/assets/projects/310/sump-base-reinforcement.jpg';
import sumpCoating from '@/assets/projects/310/sump-base-coating-application.jpg';

export type Asset = {
  src: StaticImageData;
  alt: string;
  width: number;
  height: number;
  kind: 'genuine-project' | 'official-brand' | 'illustration';
  approved: boolean;
  caption?: string;
};
export type Comparison = { before: Asset; after: Asset; note?: string };
export const exteriorBeforePhoto: Asset = {
  src: exteriorBeforeImage,
  alt: 'Brick exterior before completion, with weathered walls, scaffolding and workers',
  width: exteriorBeforeImage.width,
  height: exteriorBeforeImage.height,
  kind: 'genuine-project',
  approved: true,
};
export const exteriorAfterPhoto: Asset = {
  src: exteriorAfterImage,
  alt: 'Completed brick exterior with a clean red finish and white arched openings',
  width: exteriorAfterImage.width,
  height: exteriorAfterImage.height,
  kind: 'genuine-project',
  approved: true,
};
export const homepageComparison: Comparison = {
  before: exteriorBeforePhoto,
  after: exteriorAfterPhoto,
  note: 'Same project, photographed from different angles.',
};
export type Project = {
  id: string;
  title: string;
  category: (typeof categories)[number];
  additionalCategories?: (typeof categories)[number][];
  serviceIds: string[];
  location?: string;
  summary?: string;
  images: Asset[];
  comparison?: Comparison;
  featured: boolean;
  published: boolean;
  number: number;
  duration?: string;
  coverage?: string;
  warranty?: string;
  materials: string[];
  scope: string[];
  description: string;
  coverIndex: number;
};
export const categories = [
  'Bathroom Waterproofing',
  'Rooftop Waterproofing',
  'Water Tank Waterproofing',
  'Epoxy Grout Restoration',
] as const;

export function matchesProjectCategory(project: Project, category: string): boolean {
  return (
    category === 'all' ||
    project.category === category ||
    !!project.additionalCategories?.some((item) => item === category)
  );
}

function projectPhoto(src: StaticImageData, alt: string, caption: string): Asset {
  return {
    src,
    alt,
    caption,
    width: src.width,
    height: src.height,
    kind: 'genuine-project',
    approved: true,
  };
}

// The user supplied these originals and explicitly requested publication.
// Keep public records free of client identities, street addresses and personal contact details.
export const projects: Project[] = [
  {
    id: 'bathroom-335',
    number: 335,
    title: 'Bathroom waterproofing',
    category: 'Bathroom Waterproofing',
    serviceIds: ['bathroom'],
    location: 'Batticaloa',
    summary: 'Careful detailing. Protection where it matters most.',
    description:
      'A bathroom waterproofing project focused on the floor, pipe penetrations and wall junctions. Surface preparation and reinforced details were followed by a waterproof coating for a continuous protective finish.',
    duration: '2 days',
    warranty: '10 years',
    materials: ['FINEX PLATINUM FLEX 2K', 'Finex Construction Grout', 'Chemical anchoring'],
    scope: [
      'Surface grinding and cleaning',
      'Crack treatment and joint sealing',
      'Reinforcement at corners, pipe penetrations and wall junctions',
      'Waterproof coating application and final protective finish',
    ],
    images: [
      projectPhoto(
        bathroomApplication,
        'Worker applying a grey waterproof coating to a bathroom floor',
        'Waterproof coating application',
      ),
      projectPhoto(
        bathroomReinforcement,
        'Reinforcing mesh around a bathroom pipe penetration',
        'Pipe penetration reinforcement',
      ),
      projectPhoto(
        bathroomComplete,
        'Completed bathroom waterproofing with coated floor and lower wall junctions',
        'Completed waterproofing',
      ),
    ],
    coverIndex: 2,
    featured: true,
    published: true,
  },
  {
    id: 'rooftop-333',
    number: 333,
    title: 'Rooftop waterproofing',
    category: 'Rooftop Waterproofing',
    serviceIds: ['roof'],
    location: 'Batticaloa',
    summary: '2,300 square feet. One continuous layer of protection.',
    description:
      'A complete waterproofing treatment for a 2,300 sq ft rooftop. The work progressed from surface preparation and crack repairs to reinforced junctions and a full waterproof coating, finished with care across the roof and parapet edges.',
    duration: '4 days',
    coverage: '2,300 sq ft',
    warranty: '10 years',
    materials: ['FINEX PLATINUM FLEX 2K', 'Finex Construction Grout'],
    scope: [
      'Surface grinding, cleaning and preparation',
      'Crack treatment and joint sealing',
      'Reinforcement at corners and wall junctions',
      'Full rooftop waterproof coating and final protective finish',
    ],
    images: [
      projectPhoto(
        roofPreparation,
        'Worker preparing the rooftop surface and removing loose material',
        'Surface preparation',
      ),
      projectPhoto(
        roofApplication,
        'Worker rolling waterproof coating across the rooftop',
        'Waterproof coating application',
      ),
      projectPhoto(
        roofComplete,
        'Completed grey waterproof coating across the rooftop and parapet edges',
        'Completed rooftop protection',
      ),
    ],
    coverIndex: 2,
    featured: true,
    published: true,
  },
  {
    id: 'epoxy-grout-318',
    number: 318,
    title: 'Epoxy grout restoration',
    category: 'Epoxy Grout Restoration',
    serviceIds: ['terrace'],
    location: 'Batticaloa',
    summary: 'Renewed tile joints. A cleaner, more refined finish.',
    description:
      'A tile-grout restoration project focused on renewing the joints across a tiled terrace. Existing grout was removed, the joints were thoroughly cleaned, and epoxy grout was applied and finished with care for a clean, consistent appearance.',
    materials: ['Epoxy grout'],
    scope: [
      'Existing tile-grout removal',
      'Deep cleaning of the tile joints',
      'Epoxy grout application',
      'Joint finishing and surface cleaning',
    ],
    images: [
      projectPhoto(
        groutRemoval,
        'Team removing old grout from the joints of a tiled terrace',
        'Existing grout removal',
      ),
      projectPhoto(
        groutApplication,
        'Worker applying epoxy grout to tile joints beside a wall',
        'Epoxy grout application',
      ),
      projectPhoto(
        groutFinishing,
        'Team finishing and cleaning freshly grouted terrace tile joints',
        'Epoxy grout finishing',
      ),
    ],
    coverIndex: 2,
    featured: false,
    published: true,
  },
  {
    id: 'sump-tank-316',
    number: 316,
    title: 'Sump tank waterbar installation',
    category: 'Water Tank Waterproofing',
    serviceIds: ['tank'],
    location: 'Batticaloa',
    summary: 'Water protection built into the construction joint.',
    description:
      'A dedicated sump-tank installation using a 150 mm waterbar at construction joints. The photographs document the waterbar positioned within the reinforcement before concrete placement, including the installation work and corner details.',
    duration: '2 days',
    warranty: '10 years',
    materials: ['150 mm waterbar'],
    scope: [
      'Waterbar positioning within the sump-tank reinforcement',
      '150 mm waterbar installation at construction joints',
      'Corner detailing before concrete placement',
    ],
    images: [
      projectPhoto(
        waterbarOverview,
        'Sump-tank reinforcement cage with a blue waterbar positioned around the joints',
        'Waterbar and reinforcement overview',
      ),
      projectPhoto(
        waterbarInstallation,
        'Team installing a blue waterbar within the sump-tank reinforcement',
        'Waterbar installation',
      ),
      projectPhoto(
        waterbarDetail,
        'Blue 150 mm waterbar following a corner inside the steel reinforcement',
        'Construction joint and corner detail',
      ),
    ],
    coverIndex: 2,
    featured: true,
    published: true,
  },
  {
    id: 'roof-bathroom-314',
    number: 314,
    title: 'Rooftop & bathroom waterproofing',
    category: 'Rooftop Waterproofing',
    additionalCategories: ['Bathroom Waterproofing'],
    serviceIds: ['roof', 'bathroom'],
    location: 'Ampara',
    summary: 'Protection for exposed roofs and everyday wet areas.',
    description:
      'A combined rooftop and bathroom waterproofing project using FINEX PLATINUM FLEX 2K. Surface preparation, crack and joint treatment, and reinforced wall junctions were followed by a full waterproof coating and a carefully finished protective layer.',
    duration: '3 days',
    warranty: '10 years',
    materials: ['FINEX PLATINUM FLEX 2K'],
    scope: [
      'Surface grinding and cleaning',
      'Crack treatment and joint sealing',
      'Reinforcement at corners and wall junctions',
      'Rooftop and bathroom waterproofing with final protective finishing',
    ],
    images: [
      projectPhoto(
        amparaPreparation,
        'Team grinding and preparing the rooftop surface before waterproofing',
        'Rooftop surface preparation',
      ),
      projectPhoto(
        amparaCoating,
        'Finished grey rooftop waterproof coating with treated parapet and column junctions',
        'Completed rooftop coating',
      ),
    ],
    coverIndex: 1,
    featured: false,
    published: true,
  },
  {
    id: 'sump-tank-310',
    number: 310,
    title: 'Sump tank waterproofing',
    category: 'Water Tank Waterproofing',
    serviceIds: ['tank'],
    location: 'Batticaloa',
    summary: 'Careful preparation. Protection from the base up.',
    description:
      'A sump-tank waterproofing project using FINEX PLATINUM FLEX 2K. The concrete base was ground and cleaned before reinforcement and waterproof coating application, with attention to the joints and surface finish.',
    duration: '2 days',
    warranty: '10 years',
    materials: ['FINEX PLATINUM FLEX 2K'],
    scope: [
      'Concrete base grinding and cleaning',
      'Crack and joint treatment',
      'Reinforcement and waterproof coating application',
      'Final protective finishing',
    ],
    images: [
      projectPhoto(
        sumpPreparation,
        'Team grinding the concrete sump-tank base before waterproofing',
        'Concrete base preparation',
      ),
      projectPhoto(
        sumpReinforcement,
        'Team laying reinforcing fabric into coating on the sump-tank base',
        'Base reinforcement and coating',
      ),
      projectPhoto(
        sumpCoating,
        'Team applying a grey waterproof coating across the sump-tank base',
        'Waterproof coating application',
      ),
    ],
    coverIndex: 2,
    featured: false,
    published: true,
  },
];
export const publishedProjects = projects.filter(
  (p) => p.published && p.images.some((i) => i.approved && i.kind === 'genuine-project'),
);
