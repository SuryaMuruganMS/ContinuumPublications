import type { EvidenceKind, EvidenceStateMeta } from '@/types/content';

/**
 * The evidence system.
 *
 * These five states are the site's rendering of the certainty vocabulary in
 * the Editorial Standards. A reader should be able to read our confidence off
 * the page without interpreting our tone — which is the whole point of having
 * a fixed vocabulary rather than adjectives.
 *
 * Referenced by the citation drawer, the Evidence Index rail, the homepage
 * explainer, /methods and /standards — all from this one file.
 */
export const evidenceStates: Record<EvidenceKind, EvidenceStateMeta> = {
  documented: {
    kind: 'documented',
    label: 'Documented',
    definition: 'We found this in a primary source and read the passage ourselves.',
    standard:
      'We have the page, table, sheet or cell, and we quote each document to its own source rather than merging two wordings into one. If the document is public we link it.',
    token: 'documented',
  },
  calculated: {
    kind: 'calculated',
    label: 'Calculated',
    definition: 'Our arithmetic, run on figures that are themselves documented.',
    standard:
      'The working is printed so you can repeat the sum in a spreadsheet and disagree with it. Our own arithmetic is never presented in the same register as a figure printed by the source.',
    token: 'calculated',
  },
  analysis: {
    kind: 'analysis',
    label: 'Analysis',
    definition: 'Our reading of documented material. Contestable by design.',
    standard:
      'A different reader with the same documents could reach a different reading. Where that is true we say so, and the strongest case against us appears in the body of the piece rather than in a footnote.',
    token: 'analysis',
  },
  reported: {
    kind: 'reported',
    label: 'Reported',
    definition: 'A secondary source published this. We have not taken its word for anything.',
    standard:
      'Evidence of what was published, and never evidence of what a primary document means. Each published figure is judged against the primary document alone, and we say plainly when an outlet got it right.',
    token: 'reported',
  },
  unresolved: {
    kind: 'unresolved',
    label: 'Unresolved',
    definition: 'We looked for supporting evidence and did not find it.',
    standard:
      'This describes our search, not the state of the world. It records a specific question, the documents we searched, and the fact that the answer was not in them.',
    token: 'unresolved',
  },
};

export const evidenceOrder: EvidenceKind[] = [
  'documented',
  'calculated',
  'analysis',
  'reported',
  'unresolved',
];

export function evidenceMeta(kind: EvidenceKind): EvidenceStateMeta {
  return evidenceStates[kind];
}

/** Verdicts available to a `reported` source. */
export const assessmentMeta = {
  correct: {
    label: 'Correct',
    description: 'The published figure matches the primary document.',
  },
  ambiguous: {
    label: 'Ambiguous',
    description: 'The figure is right; the wording invites a reading the figure does not support.',
  },
  misleading: {
    label: 'Misleading',
    description: 'The arithmetic holds but the quantity it produces corresponds to nothing reported.',
  },
  incorrect: {
    label: 'Incorrect',
    description: 'The published claim does not match the primary document.',
  },
} as const;
