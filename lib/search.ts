/**
 * Search — the client half.
 *
 * The index itself is built at build time (lib/search-index.ts) and published
 * as a static file, /search-index.json. Nothing here imports content, so the
 * search page and the quick search overlay ship only this query logic.
 */

export type ResultKind = 'article' | 'section' | 'document' | 'regulator' | 'topic' | 'page' | 'evidence';

export interface SearchRecord {
  id: string;
  kind: ResultKind;
  title: string;
  /** Shown under the title. */
  meta: string;
  /** The text actually searched. Lower-cased at build. */
  haystack: string;
  /** Snippet shown in results. */
  excerpt: string;
  href: string;
  /** Higher wins ties. */
  weight: number;
}

const KIND_LABEL: Record<ResultKind, string> = {
  article: 'Research note',
  section: 'Section',
  document: 'Document',
  regulator: 'Regulator',
  topic: 'Topic',
  page: 'Page',
  evidence: 'Evidence state',
};

export function kindLabel(kind: ResultKind): string {
  return KIND_LABEL[kind];
}

/** One request per page load, shared by every caller. */
let pending: Promise<SearchRecord[]> | null = null;

export function loadSearchIndex(): Promise<SearchRecord[]> {
  if (!pending) {
    pending = fetch('/search-index.json')
      .then((response) => {
        if (!response.ok) throw new Error(`search index ${response.status}`);
        return response.json() as Promise<SearchRecord[]>;
      })
      .catch((error) => {
        pending = null;
        throw error;
      });
  }
  return pending;
}

export interface ScoredResult extends SearchRecord {
  score: number;
}

/**
 * Scoring, in plain terms: an exact phrase in the title beats a phrase in the
 * body, which beats all the query's words appearing separately. Records that
 * match none of the words are dropped.
 */
export function search(index: SearchRecord[], query: string, limit = 24): ScoredResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const words = q.split(/\s+/).filter(Boolean);

  const scored: ScoredResult[] = [];

  for (const record of index) {
    const title = record.title.toLowerCase();
    let score = 0;

    if (title === q) score += 400;
    else if (title.startsWith(q)) score += 260;
    else if (title.includes(q)) score += 180;

    if (record.haystack.includes(q)) score += 90;

    let matchedWords = 0;
    for (const word of words) {
      if (title.includes(word)) {
        score += 40;
        matchedWords += 1;
      } else if (record.haystack.includes(word)) {
        score += 12;
        matchedWords += 1;
      }
    }

    if (matchedWords < words.length) continue;
    if (score === 0) continue;

    scored.push({ ...record, score: score + record.weight / 10 });
  }

  return scored.sort((a, b) => b.score - a.score || b.weight - a.weight).slice(0, limit);
}
