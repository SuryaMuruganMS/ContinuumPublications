import type { Article, EvidenceKind, Facet } from '@/types/content';
import { corrections } from '@/content/corrections';
import { evidenceOrder } from '@/content/evidence-states';
import { article as irdaiHealthClaims } from './irdai-health-claims-disallowed-row';
import { article as disallowedVsRepudiated } from './disallowed-vs-repudiated-claims-irdai';

/**
 * THE REGISTRY.
 *
 * ▸ TO PUBLISH ARTICLE #2: create the content file, import it here, and add it
 *   to the array below. Everything else — routing, the archive, search, the
 *   sitemap, related research, facets — picks it up automatically.
 *
 *   import { article as myNextPiece } from './my-next-piece';
 *   const registry: Article[] = [myNextPiece, irdaiHealthClaims];
 *
 * Order does not matter; the helpers sort by publication date.
 */
const registry: Article[] = [disallowedVsRepudiated, irdaiHealthClaims];

/* ------------------------------------------------------------------ */
/* Derivation                                                          */
/* ------------------------------------------------------------------ */

/** ~230 words a minute, rounded up, minimum 1. Only used when readingTime is absent. */
function estimateReadingTime(a: Article): number {
  const words = a.sections
    .flatMap((s) => s.blocks)
    .map((b) => {
      switch (b.type) {
        case 'p':
        case 'pull':
          return b.text;
        case 'quote':
          return b.text;
        case 'note':
          return b.text;
        case 'list':
          return b.items.join(' ');
        case 'claim':
          return `${b.figure} ${b.attribution} ${b.text}`;
        case 'h':
          return b.text;
        default:
          return '';
      }
    })
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

function hydrate(a: Article): Article {
  const own = corrections.filter((c) => c.articleSlug === a.slug);
  return {
    ...a,
    // Internal audit references never leave the content layer. Source objects
    // are serialised into the page for the evidence drawer, so anything left
    // on them here would be readable in the page source.
    sources: a.sources.map(({ internalRef: _internal, ...source }) => source),
    readingTime: a.readingTime ?? estimateReadingTime(a),
    corrections: own,
    status: own.length > 0 && a.status === 'published' ? 'corrected' : a.status,
  };
}

const hydrated = registry.map(hydrate);

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

export function getAllArticles(): Article[] {
  return [...hydrated]
    .filter((a) => a.status !== 'draft')
    .sort((a, b) => +new Date(b.published) - +new Date(a.published));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return hydrated.find((a) => a.slug === slug);
}

export function getLatestArticle(): Article {
  return getAllArticles()[0];
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return getAllArticles().slice(0, limit);
  const score = (a: Article) =>
    a.topics.filter((t) => current.topics.includes(t)).length * 2 +
    a.regulators.filter((r) => current.regulators.includes(r)).length * 3;
  return getAllArticles()
    .filter((a) => a.slug !== slug)
    .sort((a, b) => score(b) - score(a) || +new Date(b.published) - +new Date(a.published))
    .slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Evidence                                                            */
/* ------------------------------------------------------------------ */

/** An all-zero tally, built from the canonical state list so adding a state
 *  never means remembering to update a counter here. */
function emptyTally(): Record<EvidenceKind, number> {
  return Object.fromEntries(evidenceOrder.map((kind) => [kind, 0])) as Record<
    EvidenceKind,
    number
  >;
}

/**
 * Counts by evidence kind, derived from the article's own sources. The
 * Evidence Index rail renders these — they are never hand-authored.
 */
export function evidenceCounts(a: Article): Record<EvidenceKind, number> {
  const counts = emptyTally();
  for (const s of a.sources) counts[s.kind] += 1;
  return counts;
}

/** Desk-wide totals, used on the homepage and /archive. */
export function deskEvidenceTotals(): Record<EvidenceKind, number> {
  const totals = emptyTally();
  for (const a of getAllArticles()) {
    for (const s of a.sources) totals[s.kind] += 1;
  }
  return totals;
}

/* ------------------------------------------------------------------ */
/* Facets                                                              */
/* ------------------------------------------------------------------ */

function facetsFrom(pick: (a: Article) => string[]): Facet[] {
  const map = new Map<string, number>();
  for (const a of getAllArticles()) {
    for (const v of pick(a)) map.set(v, (map.get(v) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ key: slugify(label), label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const topicFacets = (): Facet[] => facetsFrom((a) => a.topics);
export const regulatorFacets = (): Facet[] => facetsFrom((a) => a.regulators);
export const documentTypeFacets = (): Facet[] =>
  facetsFrom((a) => [...new Set(a.documents.map((d) => d.type))]);
export const yearFacets = (): Facet[] =>
  facetsFrom((a) => [new Date(a.published).getUTCFullYear().toString()]);

/** Desk statistics, all derived. Nothing here is a vanity metric. */
export function deskStats() {
  const all = getAllArticles();
  const documents = new Set<string>();
  for (const a of all) for (const d of a.documents) documents.add(`${d.publisher}::${d.title}`);
  return {
    notes: all.length,
    documents: documents.size,
    regulators: new Set(all.flatMap((a) => a.regulators)).size,
    citations: all.reduce((n, a) => n + a.sources.length, 0),
    openQuestions: all.reduce((n, a) => n + a.openQuestions.length, 0),
    unresolved: all.reduce(
      (n, a) => n + a.sources.filter((s) => s.kind === 'unresolved').length,
      0,
    ),
    corrections: corrections.length,
  };
}
