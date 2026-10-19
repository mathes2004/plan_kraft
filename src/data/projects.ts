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
import wall331Treatment from '@/assets/projects/331/external-wall-surface-treatment.jpg';
import wall331Overview from '@/assets/projects/331/external-wall-application-overview.jpg';
import wall331Finish from '@/assets/projects/331/external-wall-completed-finish.jpg';
import bathroom323Junctions from '@/assets/projects/323/bathroom-coated-wall-junctions.jpg';
import bathroom323Finish from '@/assets/projects/323/bathroom-completed-waterproofing.jpg';
import roof313Surface from '@/assets/projects/313/rooftop-coated-surface.jpg';
import roof313Reinforcement from '@/assets/projects/313/rooftop-junction-reinforcement.jpg';
import roof313Application from '@/assets/projects/313/rooftop-coating-application.jpg';
import tank306Interior from '@/assets/projects/306/tank-waterproofed-interior.jpg';
import tank306Junctions from '@/assets/projects/306/tank-wall-junction-detail.jpg';
import wall302Access from '@/assets/projects/302/external-wall-scaffold-access.jpg';
import wall302Application from '@/assets/projects/302/external-wall-coating-application.jpg';
import wall302Preparation from '@/assets/projects/302/external-wall-surface-preparation.jpg';
import lift299Wall from '@/assets/projects/299/lift-well-wall-coating.jpg';
import lift299Exterior from '@/assets/projects/299/lift-well-exterior-coating.jpg';

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
  'External Wall Waterproofing',
  'Lift Well Waterproofing',
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
  {
    id: 'external-wall-331',
    number: 331,
    title: 'External wall waterproofing in Batticaloa',
    category: 'External Wall Waterproofing',
    serviceIds: ['external-wall'],
    location: 'Batticaloa',
    summary: '3,360 square feet of exterior protection, finished with care.',
    description:
      'An external wall waterproofing project covering 3,360 sq ft. Surface preparation, crack repairs and joint sealing were followed by reinforcement at vulnerable junctions and a protective finish using Synroof Hibuild and Finex Construction Grout.',
    duration: '15 days',
    coverage: '3,360 sq ft',
    warranty: '5 years',
    materials: ['Synroof Hibuild', 'Finex Construction Grout'],
    scope: [
      'Surface grinding, cleaning and preparation',
      'Crack treatment and joint sealing',
      'Reinforcement at corners and wall junctions',
      'External wall waterproofing and final protective finishing',
    ],
    images: [
      projectPhoto(
        wall331Treatment,
        'Worker treating an external brick wall beside scaffolding and an arched entrance',
        'External wall surface treatment',
      ),
      projectPhoto(
        wall331Overview,
        'Wide view of the brick exterior with scaffolding during the wall treatment work',
        'Exterior work in progress',
      ),
      projectPhoto(
        wall331Finish,
        'Finished red brick exterior with white arched openings',
        'Completed exterior finish',
      ),
    ],
    coverIndex: 2,
    featured: false,
    published: true,
  },
  {
    id: 'bathroom-323',
    number: 323,
    title: 'Bathroom waterproofing in Ampara',
    category: 'Bathroom Waterproofing',
    serviceIds: ['bathroom'],
    location: 'Ampara',
    summary: 'Detailed wet-area protection, completed in one day.',
    description:
      'Bathroom waterproofing using FINEX PLATINUM FLEX 2K, with attention to prepared surfaces, cracks and floor-to-wall junctions. The coating system was applied across the wet-area surfaces and finished around plumbing points for a consistent protective layer.',
    duration: '1 day',
    warranty: '10 years',
    materials: ['FINEX PLATINUM FLEX 2K'],
    scope: [
      'Wet-area surface preparation',
      'Crack treatment and junction detailing',
      'Waterproof coating application',
      'Protective finishing around floor and wall junctions',
    ],
    images: [
      projectPhoto(
        bathroom323Junctions,
        'Bathroom with grey-coated walls, treated junctions and exposed plumbing points',
        'Coated walls and junctions',
      ),
      projectPhoto(
        bathroom323Finish,
        'Grey waterproofing finish around bathroom walls and a floor-level sanitary fitting',
        'Completed bathroom waterproofing',
      ),
    ],
    coverIndex: 1,
    featured: false,
    published: true,
  },
  {
    id: 'rooftop-313',
    number: 313,
    title: 'Rooftop waterproofing in Batticaloa',
    category: 'Rooftop Waterproofing',
    serviceIds: ['roof'],
    location: 'Batticaloa',
    summary: 'Reinforced details. A continuous rooftop coating.',
    description:
      'A rooftop waterproofing project using TOKYO SUPER SEAL 2K. The surface was ground and cleaned, cracks and joints were treated, and vulnerable corners and wall junctions were reinforced before application of the full waterproof coating.',
    duration: '2 days',
    warranty: '10 years',
    materials: ['TOKYO SUPER SEAL 2K'],
    scope: [
      'Rooftop grinding, cleaning and surface preparation',
      'Crack treatment and joint sealing',
      'Corner and parapet junction reinforcement',
      'Full rooftop coating and final protective finishing',
    ],
    images: [
      projectPhoto(
        roof313Surface,
        'Grey-coated rooftop surface with treated parapet junctions',
        'Coated rooftop surface',
      ),
      projectPhoto(
        roof313Reinforcement,
        'Worker placing reinforcing material across rooftop joints',
        'Rooftop joint reinforcement',
      ),
      projectPhoto(
        roof313Application,
        'Worker applying waterproof coating beside a rooftop wall junction',
        'Waterproof coating application',
      ),
    ],
    coverIndex: 0,
    featured: false,
    published: true,
  },
  {
    id: 'water-tank-306',
    number: 306,
    title: 'Water tank waterproofing',
    category: 'Water Tank Waterproofing',
    serviceIds: ['tank'],
    location: 'Batticaloa',
    summary: 'Waterproofing with close attention to tank surfaces and joints.',
    description:
      'A tank waterproofing project using FINEX PLATINUM FLEX 2K, Finex Construction Grout and chemical anchoring. Surface preparation, crack and joint treatment, and reinforced junctions were followed by waterproof coating and protective finishing.',
    duration: '1 day',
    warranty: '10 years',
    materials: ['FINEX PLATINUM FLEX 2K', 'Finex Construction Grout', 'Chemical anchoring'],
    scope: [
      'Tank surface preparation and cleaning',
      'Crack treatment and joint sealing',
      'Reinforcement at corners and wall junctions',
      'Waterproof coating application and final protective finish',
    ],
    images: [
      projectPhoto(
        tank306Interior,
        'Narrow concrete tank interior with grey-coated floor and lower walls',
        'Coated tank interior',
      ),
      projectPhoto(
        tank306Junctions,
        'Grey waterproof coating along the base and wall junctions of a concrete tank',
        'Tank wall and base junctions',
      ),
    ],
    coverIndex: 0,
    featured: false,
    published: true,
  },
  {
    id: 'external-wall-302',
    number: 302,
    title: 'External wall waterproofing in Trincomalee',
    category: 'External Wall Waterproofing',
    serviceIds: ['external-wall'],
    location: 'Trincomalee',
    summary: 'Exterior surface repairs and a carefully applied protective system.',
    description:
      'An external wall waterproofing project using the Dr. Fixit Raincoat 2-in-1 system. Prepared wall surfaces and repaired cracks were followed by PU/sealant joint treatment and waterproof coating application, with careful finishing across the building exterior.',
    duration: '16 days',
    warranty: '5 years',
    materials: ['Dr. Fixit Raincoat 2-in-1', 'PU/sealant joint treatment'],
    scope: [
      'External wall surface preparation',
      'Crack treatment and surface repairs',
      'PU/sealant application at joints',
      'Waterproof coating application and protective finishing',
    ],
    images: [
      projectPhoto(
        wall302Access,
        'Scaffolding alongside an exterior wall with coated sections and window openings',
        'Exterior wall work and access',
      ),
      projectPhoto(
        wall302Application,
        'Worker applying grey coating to an external wall beside a balcony',
        'External wall coating application',
      ),
      projectPhoto(
        wall302Preparation,
        'Worker preparing a weathered exterior wall from a ladder',
        'External wall surface preparation',
      ),
    ],
    coverIndex: 1,
    featured: false,
    published: true,
  },
  {
    id: 'lift-well-299',
    number: 299,
    title: 'Lift well waterproofing',
    category: 'Lift Well Waterproofing',
    serviceIds: ['basement'],
    location: 'Batticaloa',
    summary: 'Concrete wall protection for a lift-well construction project.',
    description:
      'A lift well waterproofing project using IKOTE CM 30X. The work included surface grinding and cleaning, crack and joint treatment, and reinforced corner and wall junctions before waterproof coating application and final protective finishing.',
    duration: '1 day',
    warranty: '10 years',
    materials: ['IKOTE CM 30X'],
    scope: [
      'Concrete surface grinding and cleaning',
      'Crack treatment and joint sealing',
      'Corner and wall junction reinforcement',
      'Waterproof coating application and final protective finishing',
    ],
    images: [
      projectPhoto(
        lift299Wall,
        'Worker applying grey waterproof coating to a concrete wall at the lift-well site',
        'Concrete wall coating application',
      ),
      projectPhoto(
        lift299Exterior,
        'Team applying a protective coating along the exterior of a below-ground concrete wall',
        'Exterior concrete wall treatment',
      ),
    ],
    coverIndex: 0,
    featured: false,
    published: true,
  },
];
export const publishedProjects = projects.filter(
  (p) => p.published && p.images.some((i) => i.approved && i.kind === 'genuine-project'),
);
