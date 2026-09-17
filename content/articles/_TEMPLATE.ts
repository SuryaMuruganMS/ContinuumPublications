import type { Article } from '@/types/content';

/**
 * ARTICLE TEMPLATE
 *
 * Copy this file, rename it to your slug, fill it in, and register it in
 * content/articles/index.ts. Nothing else needs to change.
 *
 *   cp content/articles/_TEMPLATE.ts content/articles/my-new-note.ts
 *
 * This file is NOT registered, so it never appears on the site.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE MARKUP
 * ─────────────────────────────────────────────────────────────────────────
 *   [[S4]]        an interactive evidence reference, bound to sources[].id
 *   *emphasis*    italic
 *   `18,521.02`   a figure lifted from a document, set in mono
 *
 * Nothing else is parsed. See lib/rich-text.tsx.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE RULES THIS STRUCTURE ENFORCES
 * ─────────────────────────────────────────────────────────────────────────
 * · Every source needs a `locator`. A citation naming a document but not a
 *   location inside it is not a citation.
 * · Every source needs `establishes` — one sentence, saying only what this
 *   source proves and not what the article concludes from it.
 * · `openQuestions` is not optional decoration. A note with a finding and no
 *   stated boundary is not finished.
 * · The strongest case against the finding belongs in `sections`, in the body,
 *   not in a footnote.
 */
export const article: Article = {
  slug: 'my-new-note',
  /** Archive index. The next integer after the last published note. */
  index: 2,
  status: 'published',

  title: 'A headline that states the finding, not the topic',

  deck: 'Two or three sentences. What the documents say, what is inconsistent about it, and what could not be established. No throat-clearing.',

  summary:
    'Used for the meta description, the archive card and the search index. Around fifty words, written for someone deciding whether this answers their question.',

  /** ISO 8601. Drives the article page, the archive sort and the sitemap. */
  published: '2026-01-01',
  /** Optional, and only when the note is materially revised. */
  // updated: '2026-02-01',

  /** Minutes. Omit and it is estimated from the word count. */
  readingTime: undefined,

  topics: ['Topic one', 'Topic two'],
  regulators: ['REGULATOR'],

  documents: [
    {
      id: 'D1',
      title: 'The document title, as printed on the document',
      publisher: 'Who issued it',
      type: 'Annual report',
      year: '2024–25',
      url: 'https://example.gov.in/the-document',
    },
  ],

  /** Two to four things the note establishes. Rendered as the standfirst box. */
  findings: [
    'The first thing the documents establish, stated as a fact with its figures.',
    'The second.',
  ],

  /** Questions the note could not close. Rendered verbatim; do not soften. */
  openQuestions: [
    'The specific thing that could not be established, and what would settle it.',
  ],

  /** Drives the social card. Keep the two figures short. */
  social: {
    figure: '₹0.00 crore',
    counterFigure: '0.00 lakh',
    label: 'REGULATOR · TABLE X.XX',
  },

  sections: [
    {
      id: 'the-finding',
      nav: 'The finding',
      kicker: 'The document',
      title: 'A section heading that carries information',
      blocks: [
        {
          type: 'p',
          text: 'Open at the document. Name the source before stating what it says. [[S1]]',
        },
        {
          type: 'note',
          label: 'Scope',
          text: 'Use a note for a caveat or a scope limit, in the place where it applies — not in a block at the bottom of the piece.',
        },
        {
          type: 'visual',
          component: 'table-i29',
          caption: 'Register your own visual in components/visuals/registry.tsx and reference its key here.',
        },
        {
          type: 'pull',
          text: 'A pull quote should be the sentence the piece turns on, not the most dramatic one.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '*A readable point.* With its citation. [[S2]]',
            'Another.',
          ],
        },
        {
          type: 'claim',
          figure: 'A figure someone else published',
          attribution: 'Outlet, date',
          assessment: 'ambiguous',
          text: 'What the primary document actually says, and where the published version departs from it. Say plainly when an outlet got it right. [[S3]]',
        },
      ],
    },

    {
      id: 'the-case-against',
      nav: 'The case against',
      kicker: 'Counter-argument',
      title: 'The strongest objection, at full strength',
      blocks: [
        {
          type: 'p',
          text: 'State it in the terms someone who holds that view would accept, before responding to it.',
        },
      ],
    },

    {
      id: 'the-boundary',
      nav: 'The boundary',
      kicker: 'Unresolved',
      title: 'The boundary of the evidence',
      blocks: [
        {
          type: 'p',
          text: 'What could not be established, where you looked, and what would settle it.',
        },
      ],
    },
  ],

  sources: [
    {
      id: 'S1',
      kind: 'documented',
      publisher: 'Who issued it',
      document: 'Annual Report 2024–25',
      locator: 'Table X.XX · printed page 00 (PDF index 000)',
      quote: 'A short, exact extract.',
      establishes: 'One sentence, saying only what this source proves.',
      working: 'Optional. What it does NOT prove, and any competing reading.',
      url: 'https://example.gov.in/the-document',
      retrieved: '2026-01-01',
    },
    {
      id: 'S2',
      kind: 'calculated',
      publisher: 'Continuum',
      document: 'Our arithmetic on the printed values',
      locator: 'What was computed',
      establishes: 'What the arithmetic shows.',
      working: 'The sum written out, so a reader can repeat it in a spreadsheet.',
    },
    {
      id: 'S3',
      kind: 'reported',
      publisher: 'Outlet',
      document: 'Outlet, 1 January 2026',
      locator: 'As published',
      assessment: 'ambiguous',
      establishes: 'What the outlet published.',
      working: 'How it stands up against the primary document. Archive the URL before publishing.',
      url: 'https://web.archive.org/…',
      retrieved: '2026-01-01',
    },
    {
      id: 'S4',
      kind: 'analysis',
      publisher: 'Continuum',
      document: 'Our reading of the documents',
      locator: 'What is being read',
      establishes: 'The reading.',
      working: 'Why it is available, and what would defeat it.',
    },
    {
      id: 'S5',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Search of the public record',
      locator: 'The question',
      establishes: 'What could not be established.',
      working: 'The specific documents searched.',
    },
  ],

  related: [
    { label: 'How a Continuum note is built', href: '/methods/' },
    { label: 'The evidence states', href: '/standards/#evidence' },
  ],
};
