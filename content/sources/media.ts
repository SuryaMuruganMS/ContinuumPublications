import manifest from '@/archive/sources/manifest.json';
import type { MediaRecord } from '@/types/content';

/**
 * The media source registry.
 *
 * Every `reported` source on the site draws its publication, headline, date,
 * byline, URL and archive status from archive/sources/manifest.json, which is
 * written only by scripts/archive-sources.mjs after it has fetched the page and
 * checked each excerpt Continuum relies on.
 *
 * This is the publication gate. If a note cites a media record that is missing
 * or not VERIFIED, the build stops with ARCHIVE REQUIRED — PUBLICATION BLOCKED.
 * There is no way to set a URL on a reported source by hand.
 *
 * Retired sources live in archive/sources/retired.json, which this module
 * deliberately does not import: anything imported here can reach the client
 * bundle. scripts/audit-sources.mjs rejects any note that cites a retired key.
 */

interface ManifestSource {
  key: string;
  claimsUsed: { excerpt: string }[];
  publication: string;
  headline: string;
  published: string;
  byline: string;
  sourceType: string;
  url: string;
  status: string;
  retrieved: string | null;
  snapshot: { sha256: string } | null;
  wayback: string | null;
}

const records = new Map<string, ManifestSource>(
  (manifest.sources as ManifestSource[]).map((record) => [record.key, record]),
);

export class PublicationBlocked extends Error {
  constructor(key: string, reason: string) {
    super(`ARCHIVE REQUIRED — PUBLICATION BLOCKED: media source "${key}" ${reason}. Run \`npm run archive:sources\`.`);
    this.name = 'PublicationBlocked';
  }
}

export function mediaRecord(key: string): MediaRecord {
  const record = records.get(key);
  if (!record) throw new PublicationBlocked(key, 'is not in archive/sources/manifest.json');
  if (record.status !== 'VERIFIED') throw new PublicationBlocked(key, `has status ${record.status}`);
  if (!record.url || !record.retrieved || !record.snapshot) {
    throw new PublicationBlocked(key, 'has no verified URL, retrieval date or snapshot');
  }

  return {
    key: record.key,
    publication: record.publication,
    headline: record.headline,
    published: record.published,
    byline: record.byline,
    sourceType: record.sourceType,
    url: record.url,
    status: 'VERIFIED',
    retrieved: record.retrieved,
    sha256: record.snapshot.sha256,
    wayback: record.wayback,
  };
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "Business Standard, 27 December 2024" */
export function mediaCitation(record: MediaRecord): string {
  const [y, m, d] = record.published.split('-').map(Number);
  return `${record.publication}, ${d} ${MONTHS[m - 1]} ${y}`;
}

/**
 * The fields a `reported` Source takes from the registry. Spread into the
 * source object in the article file:
 *
 *   { id: 'S18', kind: 'reported', ...fromMedia('bs-2024-12-27-rejection-up'), … }
 */
export function fromMedia(key: string, quote?: string) {
  const media = mediaRecord(key);

  // An extract shown to readers must be one the archive script found on the
  // page. Straight and curly quotes are treated as the same character.
  if (quote) {
    const norm = (t: string) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
    const excerpts = records.get(key)!.claimsUsed.map((c) => norm(c.excerpt));
    if (!excerpts.includes(norm(quote))) {
      throw new PublicationBlocked(key, `has no verified excerpt matching "${quote}"`);
    }
  }

  return {
    publisher: media.publication,
    document: `“${media.headline}”`,
    url: media.url,
    retrieved: media.retrieved,
    media,
    ...(quote ? { quote } : {}),
  };
}
