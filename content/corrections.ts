import type { Correction } from '@/types/content';

/**
 * The corrections ledger.
 *
 * ▸ TO ISSUE A CORRECTION: add an object to the array below. It appears on
 *   /corrections, on the article it belongs to (as a notice above the body),
 *   and flips that article's status to `corrected` automatically.
 *
 * We do not silently edit published text. If the meaning of a sentence
 * changes, the old sentence goes in `published` and the new one in
 * `corrected`, so the change is legible rather than invisible.
 *
 * Severity:
 *   typographical — spelling, formatting, a broken link. Meaning unchanged.
 *   factual       — a stated fact was wrong and is now right.
 *   substantive   — a finding, figure or conclusion changed.
 *
 * Example entry, kept here as documentation:
 *
 *   {
 *     id: 'C-2026-001',
 *     articleSlug: 'irdai-health-claims-disallowed-row',
 *     articleTitle: 'IRDAI’s health claims table prints ₹18,521 crore …',
 *     date: '2026-10-04',
 *     published: 'The figure appears in three consecutive editions.',
 *     corrected: 'The figure appears in the two editions we examined.',
 *     reason: 'We had examined two editions, not three. The original wording overstated the range of the check.',
 *     source: 'Raised by a reader with reference to the 2022–23 edition.',
 *     severity: 'factual',
 *   },
 */
export const corrections: Correction[] = [];

export function correctionsForArticle(slug: string): Correction[] {
  return corrections
    .filter((c) => c.articleSlug === slug)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function allCorrections(): Correction[] {
  return [...corrections].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export const correctionSeverity = {
  typographical: {
    label: 'Typographical',
    description: 'Spelling, formatting or a broken link. The meaning did not change.',
  },
  factual: {
    label: 'Factual',
    description: 'A stated fact was wrong. It has been replaced and the original is printed alongside it.',
  },
  substantive: {
    label: 'Substantive',
    description: 'A finding, figure or conclusion changed. The note carries a standing notice.',
  },
} as const;
