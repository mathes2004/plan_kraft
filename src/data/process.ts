export const stages = [
  [
    'Site Inspection',
    'Assess affected areas, existing surfaces and moisture signs.',
    'Inspection area',
  ],
  [
    'Problem Assessment',
    'Review likely ingress sources, joints and substrate conditions.',
    'Moisture paths & cracks',
  ],
  [
    'Quotation & Planning',
    'Explain the proposed scope, free quotation and work sequence.',
    'Measured treatment zones',
  ],
  [
    'Surface Preparation',
    'Prepare the substrate as required by the chosen system.',
    'Prepared substrate',
  ],
  [
    'Crack Repair & Reinforcement',
    'Detail repairs and reinforcement where required.',
    'Repair & reinforcement layer',
  ],
  [
    'Waterproofing Application',
    'Apply the specified waterproofing system and junction details.',
    'Protective coating',
  ],
  [
    'Testing & Quality Inspection',
    'Inspect and perform appropriate system- and site-dependent testing.',
    'Controlled testing',
  ],
  [
    'Completion & Handover',
    'Review the work, care instructions and applicable warranty terms.',
    'Completed protective surface',
  ],
] as const;
export function nextStep(step: number) {
  return Math.min(7, step + 1);
}
export function previousStep(step: number) {
  return Math.max(0, step - 1);
}
