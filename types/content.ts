/**
 * Continuum Publications — content model.
 *
 * Every page on the site is rendered from these structures. Nothing about
 * Article #1 is hard-coded into a component: to publish Article #2 you add one
 * file under content/articles/ and register it in content/articles/index.ts.
 *
 * See DOCS/ADDING-AN-ARTICLE.md for the walkthrough.
 */

/* ------------------------------------------------------------------ */
/* Evidence                                                            */
/* ------------------------------------------------------------------ */

/**
 * The states every claim on this site resolves to. These are the publication's
 * epistemic contract with the reader, and they map directly onto the certainty
 * vocabulary in the Editorial Standards. Do not add a sixth without updating
 * content/evidence-states.ts, the tokens in styles/tokens.css, and /standards.
 *
 * documented — a primary document says it, at a citable locator.
 * calculated — we derived it arithmetically from documented figures.
 * analysis   — our reading of documented material. Contestable.
 * reported   — a secondary source published it. Evidence only of what was
 *              published, never of what a primary document means.
 * unresolved — we looked and could not establish it. Stated as a gap.
 */
export type EvidenceKind =
  | 'documented'
  | 'calculated'
  | 'analysis'
  | 'reported'
  | 'unresolved';

export interface EvidenceStateMeta {
  kind: EvidenceKind;
  label: string;
  /** One line, shown in the drawer and on the homepage explainer. */
  definition: string;
  /** What the reader is entitled to assume when they see this marker. */
  standard: string;
  /** CSS custom-property suffix, e.g. `--ev-documented`. */
  token: string;
}

export interface Source {
  /** Stable, short, cited inline as [[S1]] in body copy. Never renumber. */
  id: string;
  kind: EvidenceKind;
  /** Who published the document. "IRDAI", "Continuum", "Ministry of Finance". */
  publisher: string;
  /** The document itself. "Annual Report 2024-25". */
  document: string;
  /**
   * Where exactly inside the document. Page / table / sheet / cell.
   * This is the field that separates a citation from a gesture.
   */
  locator: string;
  /** Verbatim extract, if short enough to quote. Optional. */
  quote?: string;
  /** What this source establishes — and only that. One sentence. */
  establishes: string;
  /** Public URL for the document, when one exists. */
  url?: string;
  /** ISO date the document was retrieved. */
  retrieved?: string;
  /**
   * For `calculated`: the arithmetic, written out so a reader can repeat it.
   * For `unresolved`: where we looked.
   * For `reported`: how the published wording stands up against the primary
   * document, and what the outlet got right as well as wrong.
   */
  working?: string;
  /**
   * `reported` only. Our verdict on a published claim, judged against the
   * primary document and nothing else.
   */
  assessment?: 'correct' | 'ambiguous' | 'misleading' | 'incorrect';
  /**
   * `reported` only. The verified record of the published article, drawn from
   * archive/sources/manifest.json via content/sources/media.ts. Never typed
   * by hand into an article file.
   */
  media?: MediaRecord;
  /**
   * Internal audit reference — evidence-matrix row IDs and the like. Kept so
   * the site can be reconciled against the matrix row by row. Never rendered,
   * never indexed for search.
   */
  internalRef?: string;
}

export type ArchiveStatus = 'VERIFIED' | 'PENDING' | 'FAILED';

export interface MediaRecord {
  key: string;
  publication: string;
  headline: string;
  /** ISO date of publication. */
  published: string;
  byline: string;
  /** 'PTI' for agency copy, 'Staff' for the outlet's own reporting. */
  sourceType: 'PTI' | 'Staff' | string;
  url: string;
  status: ArchiveStatus;
  /** ISO date the page was retrieved and verified. */
  retrieved: string;
  /** SHA-256 of the private snapshot taken at retrieval. */
  sha256: string | null;
  /** Public Internet Archive snapshot, when one exists. */
  wayback: string | null;
}

/* ------------------------------------------------------------------ */
/* Body blocks                                                         */
/* ------------------------------------------------------------------ */

/**
 * Body copy supports inline citation tokens: `[[S3]]` renders an interactive
 * evidence reference bound to the source with id "S3". Emphasis is `*like this*`,
 * inline code / figures are `` `like this` ``. Nothing else is parsed — the
 * renderer is deliberately small (lib/rich-text.ts).
 */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string; id: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'pull'; text: string; attribution?: string }
  | { type: 'quote'; text: string; attribution: string }
  /** A boxed aside. Use for caveats and scope limits, not for decoration. */
  | { type: 'note'; label: string; text: string }
  /** Renders a registered interactive visual. See components/visuals/registry.tsx */
  | { type: 'visual'; component: VisualKey; caption?: string }
  /**
   * A published figure, judged against the primary document. Used where an
   * article assesses coverage rather than reporting it.
   */
  | {
      type: 'claim';
      figure: string;
      attribution: string;
      /** The `reported` source record for the published claim. Rendered as a
       *  citation beside the attribution. */
      source?: string;
      assessment: 'correct' | 'ambiguous' | 'misleading' | 'incorrect';
      text: string;
    }
  | { type: 'divider' };

export type VisualKey = 'table-i29' | 'returns-structure' | 'number-vs-amount';

export interface ArticleSection {
  /** URL fragment. Stable — these get linked to. */
  id: string;
  /** Short label for the section navigator. */
  nav: string;
  /** Displayed heading. May differ from `nav`. */
  title: string;
  /** Optional eyebrow above the heading. */
  kicker?: string;
  blocks: Block[];
}

/* ------------------------------------------------------------------ */
/* Supporting records                                                  */
/* ------------------------------------------------------------------ */

export interface Correction {
  id: string;
  /** Slug of the article corrected. */
  articleSlug: string;
  articleTitle: string;
  date: string;
  /** What the article said before. */
  published: string;
  /** What it says now. */
  corrected: string;
  reason: string;
  /** How the error came to light. */
  source: string;
  severity: 'typographical' | 'factual' | 'substantive';
}

export interface RelatedLink {
  label: string;
  href: string;
  note?: string;
}

/** A document the article rests on, surfaced as a first-class object. */
export interface DocumentRef {
  id: string;
  title: string;
  publisher: string;
  /** e.g. "Annual report", "Regulatory return", "Circular" */
  type: string;
  year: string;
  url?: string;
}

/* ------------------------------------------------------------------ */
/* Article                                                             */
/* ------------------------------------------------------------------ */

export type ArticleStatus = 'published' | 'updated' | 'corrected' | 'draft';

export interface Article {
  slug: string;
  /** Archive index number. Zero-padded on display: 0001. */
  index: number;
  title: string;
  deck: string;
  /** ISO 8601. */
  published: string;
  /** ISO 8601, only when materially revised. */
  updated?: string;
  status: ArticleStatus;
  /** Minutes. Computed by content/articles/index.ts if omitted. */
  readingTime?: number;
  topics: string[];
  regulators: string[];
  documents: DocumentRef[];
  /** Short summary used for meta description, cards and search. */
  summary: string;
  /**
   * Search-engine-only overrides. Never rendered on the page — the H1 stays
   * `title`, the standfirst stays `deck`, and cards/search stay `summary`.
   * Use these only when the reader-facing text is accurate but too long for
   * a search snippet (Bing and Google both truncate and warn past ~60
   * title characters / ~160 description characters).
   */
  seo?: {
    title?: string;
    description?: string;
  };
  /** The 2–4 things the piece establishes. Rendered as the standfirst box. */
  findings: string[];
  /** Questions the piece could not close. Rendered verbatim; do not soften. */
  openQuestions: string[];
  sections: ArticleSection[];
  sources: Source[];
  related: RelatedLink[];
  /** Populated from content/corrections.ts at read time. */
  corrections?: Correction[];
  /** Social card overrides. */
  social?: {
    figure?: string;
    counterFigure?: string;
    label?: string;
  };
}

/* ------------------------------------------------------------------ */
/* Archive facets                                                      */
/* ------------------------------------------------------------------ */

export interface Facet {
  key: string;
  label: string;
  count: number;
}
