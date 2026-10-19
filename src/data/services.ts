export const services = [
  {
    id: 'roof',
    title: 'Roof / Rooftop Waterproofing',
    short: 'Rooftop waterproofing',
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
    problem: 'Water entry at thresholds, exposed slabs and balcony edges.',
    solution: 'Review falls, outlets and joints to plan an appropriate waterproofing treatment.',
    benefit: 'Improve protection of exposed outdoor living areas.',
    process: 'Assess drainage, prepare surfaces and treat junctions before application.',
  },
  {
    id: 'basement',
    title: 'Basement Waterproofing',
    short: 'Basement protection',
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
    problem: 'Water ingress affecting commercial premises and industrial structures.',
    solution: 'Inspect the building and operational requirements to define an appropriate scope.',
    benefit: 'Support planned protection of business property.',
    process:
      'Coordinate access, prepare and repair surfaces, and inspect work against the agreed scope.',
  },
] as const;
export type ServiceId = (typeof services)[number]['id'];
