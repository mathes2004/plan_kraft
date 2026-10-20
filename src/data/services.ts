import rooftopImage from '@/assets/services/rooftop-waterproofing-new.jpg';
import bathroomImage from '@/assets/services/bathroom-waterproofing-stages.jpg';
import balconyImage from '@/assets/services/balcony-waterproofing.jpg';
import basementImage from '@/assets/services/basement-waterproofing.jpg';
import tankImage from '@/assets/services/water-tank-waterproofing.jpg';
import poolImage from '@/assets/services/swimming-pool-waterproofing.jpg';
import crackImage from '@/assets/services/concrete-crack-repair.jpg';
import wallImage from '@/assets/services/wall-leakage.jpg';
import industrialImage from '@/assets/services/industrial-waterproofing.jpg';
import externalWallImage from '@/assets/services/external-wall-waterproofing.jpg';
import epoxyGroutingImage from '@/assets/services/epoxy-grouting.jpg';
import fiberPaintImage from '@/assets/services/fiber-paint-application.jpg';
import polyurethaneImage from '@/assets/services/polyurethane-coating-application.jpg';
import sandEpoxyImage from '@/assets/services/sand-epoxy-flooring.jpg';
import heatProofingImage from '@/assets/services/rooftop-heat-proofing.jpg';
import roofWaterproofingImage from '@/assets/services/roof-waterproofing-membrane.jpg';

export const services = [
  {
    id: 'roof',
    title: 'Rooftop Waterproofing',
    short: 'Rooftop Waterproofing',
    image: {
      src: rooftopImage,
      alt: 'Wide view of a waterproofed rooftop with treated column bases and parapet walls',
      contentHeight: 933,
    },
    problem: 'Rainwater ingress, ponding and exposed roof surfaces.',
    solution:
      'Inspect drainage, joints and the existing substrate before selecting a suitable roof waterproofing system.',
    benefit: 'Help protect the structure and the spaces beneath it.',
    process: 'Surface preparation, junction detailing and system-specific application.',
  },
  {
    id: 'bathroom',
    title: 'Bathroom Waterproofing',
    short: 'Bathroom waterproofing',
    image: {
      src: bathroomImage,
      alt: 'Four stages of bathroom waterproofing showing surface preparation, reinforced corners, coating application and water testing',
      contentHeight: 1024,
    },
    problem: 'Leaks around wet areas, floor junctions and plumbing penetrations.',
    solution:
      'Assess the source of leakage and specify a treatment suitable for the wet-area substrate.',
    benefit: 'Protect adjacent rooms and finishes from moisture ingress.',
    process: 'Prepare the substrate, detail vulnerable junctions and apply the selected system.',
  },
  {
    id: 'terrace',
    title: 'Terrace / Balcony Waterproofing',
    short: 'Terraces & balconies',
    image: {
      src: balconyImage,
      alt: 'Worker applying waterproofing around a balcony column and floor junction',
    },
    problem: 'Water entry at thresholds, exposed slabs and balcony edges.',
    solution: 'Review falls, outlets and joints to plan an appropriate waterproofing treatment.',
    benefit: 'Improve protection of exposed outdoor living areas.',
    process: 'Assess drainage, prepare surfaces and treat junctions before application.',
  },
  {
    id: 'basement',
    title: 'Basement Waterproofing',
    short: 'Basement protection',
    image: {
      src: basementImage,
      alt: 'Waterstop installation within concrete reinforcement for below-ground waterproofing',
    },
    problem: 'Below-ground dampness and water ingress through concrete or joints.',
    solution:
      'Assess the direction and likely source of ingress before choosing a suitable treatment.',
    benefit: 'Help manage moisture affecting below-ground spaces.',
    process: 'Inspection-led preparation, repairs and application appropriate to site conditions.',
  },
  {
    id: 'tank',
    title: 'Water Tank Waterproofing',
    short: 'Water tank waterproofing',
    image: {
      src: tankImage,
      alt: 'Worker coating the inside walls of a concrete water tank with a roller',
    },
    problem: 'Water loss through tank surfaces, cracks or construction joints.',
    solution: 'Inspect the tank condition and intended use to determine a compatible system.',
    benefit: 'Help address leakage and protect the tank structure.',
    process:
      'Prepare and repair surfaces; apply and cure the specified system before appropriate testing.',
  },
  {
    id: 'pool',
    title: 'Swimming Pool Waterproofing',
    short: 'Swimming pool protection',
    image: {
      src: poolImage,
      alt: 'Blue-tiled swimming pool with steps and adjoining tiled compartments',
    },
    problem: 'Leakage around pool shells, joints and penetrations.',
    solution: 'Assess the pool structure, finishes and junctions before specifying treatment.',
    benefit: 'Help maintain the integrity of the water-retaining structure.',
    process:
      'Detail penetrations and joints, apply the chosen system and conduct suitable testing.',
  },
  {
    id: 'crack',
    title: 'Concrete Crack Repair',
    short: 'Concrete crack repair',
    image: {
      src: crackImage,
      alt: 'Worker filling a crack across a concrete rooftop slab',
    },
    problem: 'Visible cracking and potential moisture paths in concrete.',
    solution:
      'Review crack condition and likely cause before selecting an appropriate repair approach.',
    benefit: 'Address vulnerable areas as part of a suitable repair scope.',
    process: 'Assess, prepare and repair cracks; reinforce where required by the selected method.',
  },
  {
    id: 'wall',
    title: 'Wall Leakage / Dampness Treatment',
    short: 'Wall leakage & dampness',
    image: {
      src: wallImage,
      alt: 'Worker applying a protective treatment to a wall and porch ceiling',
    },
    problem: 'Damp patches, peeling finishes and moisture through external walls.',
    solution:
      'Trace likely entry points and assess the surface before choosing a suitable wall treatment.',
    benefit: 'Help protect interior finishes and building exteriors.',
    process: 'Prepare affected areas, address defects and apply the specified treatment.',
  },
  {
    id: 'commercial',
    title: 'Commercial / Industrial Waterproofing',
    short: 'Commercial & industrial',
    image: {
      src: industrialImage,
      alt: 'Industrial floor with a grey protective coating and marked edges',
    },
    problem: 'Water ingress affecting commercial premises and industrial structures.',
    solution: 'Inspect the building and operational requirements to define an appropriate scope.',
    benefit: 'Support planned protection of business property.',
    process:
      'Coordinate access, prepare and repair surfaces, and inspect work against the agreed scope.',
  },
  {
    id: 'external-wall',
    title: 'External Wall Waterproofing',
    short: 'External wall waterproofing',
    image: {
      src: externalWallImage,
      alt: 'Exterior building wall with a grey protective finish behind scaffolding',
    },
    problem: 'Rainwater entering through exposed walls, cracks and weathered exterior finishes.',
    solution:
      'Inspect the exterior surface, cracks and junctions to select a compatible wall waterproofing treatment.',
    benefit: 'Help protect external walls and interior spaces from rainwater ingress.',
    process:
      'Prepare the wall, repair surface defects, detail vulnerable junctions and apply the selected protective system.',
  },
  {
    id: 'epoxy-grouting',
    title: 'Epoxy Grouting',
    short: 'Epoxy Grouting',
    image: {
      src: epoxyGroutingImage,
      alt: 'Plan Kraft epoxy grouting service graphic showing tile-joint preparation and finishing',
      contentHeight: 1280,
    },
    problem: 'Worn, stained or missing grout in tiled surfaces and wet areas.',
    solution:
      'Inspect the tile joints and existing finish before selecting a compatible epoxy grout treatment.',
    benefit: 'Renew tile joints with a consistent finish that is easier to maintain.',
    process: 'Remove damaged grout, clean the joints, apply epoxy grout and finish the surface.',
  },
  {
    id: 'fiber-paint-application',
    title: 'Fiber Paint Application',
    short: 'Fiber Paint Application',
    image: {
      src: fiberPaintImage,
      alt: 'Grey protective coating across a rooftop and its raised wall junctions',
    },
    problem: 'Weathered surfaces and vulnerable joints exposed to rain and everyday wear.',
    solution:
      'Assess the surface condition and select a fiber paint coating system suited to the substrate and exposure.',
    benefit: 'Help protect exposed surfaces with a carefully applied coating.',
    process:
      'Clean and prepare the surface, repair defects and apply the selected fiber paint system.',
  },
  {
    id: 'polyurethane-coating-application',
    title: 'Polyurethane Coating Application',
    short: 'Polyurethane Coating Application',
    image: {
      src: polyurethaneImage,
      alt: 'Coated rooftop passage between tiled roofs with treated parapet walls',
    },
    problem: 'Water ingress and deterioration affecting exposed surfaces and junctions.',
    solution:
      'Inspect the substrate, moisture conditions and drainage before specifying a suitable polyurethane coating.',
    benefit: 'Provide a protective surface treatment suited to the site conditions.',
    process:
      'Prepare the substrate, treat cracks and joints, and apply and cure the selected coating system.',
  },
  {
    id: 'sand-epoxy-flooring',
    title: 'Sand Epoxy Flooring',
    short: 'Sand Epoxy Flooring',
    image: {
      src: sandEpoxyImage,
      alt: 'Plan Kraft sand epoxy flooring graphic showing a finished floor and application stages',
      contentHeight: 1408,
    },
    problem: 'Worn or uneven floor finishes requiring a suitable protective flooring system.',
    solution:
      'Assess the floor condition, intended use and finish requirements to plan a compatible sand epoxy application.',
    benefit: 'Create a consistent floor finish selected for the way the space is used.',
    process:
      'Prepare and repair the floor, apply primer, install the epoxy and sand system, and finish with the specified top coat.',
  },
  {
    id: 'rooftop-heat-proofing',
    title: 'Rooftop Heat Proofing',
    short: 'Rooftop Heat Proofing',
    image: {
      src: heatProofingImage,
      alt: 'Rooftop heat-proofing illustration showing insulation boards and protective roof layers',
    },
    problem: 'Heat transfer through exposed rooftops affecting the spaces beneath.',
    solution:
      'Review the roof condition and existing waterproofing to plan a compatible heat-proofing system.',
    benefit: 'Help reduce heat transfer through the rooftop and improve indoor comfort.',
    process:
      'Prepare the rooftop and install the specified waterproofing, insulation and protective layers.',
  },
  {
    id: 'roof-waterproofing',
    title: 'Roof Waterproofing',
    short: 'Roof Waterproofing',
    image: {
      src: roofWaterproofingImage,
      alt: 'Roof waterproofing graphic showing workers installing torch-on bituminous membranes',
      contentHeight: 850,
    },
    problem: 'Roof leaks and water entry through exposed surfaces, joints and penetrations.',
    solution:
      'Inspect the roof and likely leakage paths before selecting a compatible waterproofing system, including torch-on membranes where appropriate.',
    benefit: 'Help protect the roof structure and the interior from rainwater ingress.',
    process:
      'Prepare the roof, repair defects and detail vulnerable junctions before installing and inspecting the selected membrane or coating system.',
  },
] as const;
export type ServiceId = (typeof services)[number]['id'];

export const homepageServices = [
  'roof',
  'epoxy-grouting',
  'fiber-paint-application',
  'polyurethane-coating-application',
  'terrace',
].map((id) => {
  const service = services.find((item) => item.id === id)!;
  return {
    ...service,
    image:
      id === 'epoxy-grouting' ? service.image : { src: service.image.src, alt: service.image.alt },
  };
});
