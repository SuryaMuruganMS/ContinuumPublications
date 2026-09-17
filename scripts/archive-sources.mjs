/**
 * Archive the secondary (media) sources a note relies on.
 *
 *   npm run archive:sources
 *
 * For every record in archive/sources/manifest.json this script:
 *   1. fetches the canonical URL (tracking parameters stripped),
 *   2. checks it returns HTTP 200 and that the page's own canonical URL,
 *      headline, publication date and byline match the manifest,
 *   3. checks that every excerpt Continuum relies on is present in the page,
 *   4. stores a private snapshot of the raw HTML in archive/sources/raw/
 *      (git-ignored, never deployed) with its SHA-256 recorded in the manifest,
 *   5. asks the Internet Archive for a public snapshot and records it if one is
 *      made. If the Internet Archive is unavailable, `wayback` stays null and
 *      is reported as pending. No archive URL is ever written that was not
 *      returned by the Internet Archive itself.
 *
 * Any mismatch sets the record's status to FAILED and the script exits
 * non-zero. content/sources/media.ts refuses to build a note whose sources are
 * not VERIFIED, so a failed check blocks publication.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'archive', 'sources', 'manifest.json');
const rawDir = join(root, 'archive', 'sources', 'raw');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/** Local calendar date for the desk (IST), not the UTC date. */
const today = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

const pick = (html, pattern) => {
  const match = html.match(pattern);
  return match ? decode(match[1]).trim() : null;
};

/** Strip tags and normalise whitespace and curly quotes, for excerpt matching. */
const plain = (html) =>
  decode(html.replace(/<[^>]+>/g, ' '))
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E₹]/g, ' ')
    .replace(/\s+/g, ' ');

async function wayback(url) {
  try {
    const response = await fetch(`https://web.archive.org/save/${url}`, {
      headers: { 'User-Agent': UA },
      redirect: 'manual',
      signal: AbortSignal.timeout(60_000),
    });
    const location = response.headers.get('content-location') || response.headers.get('location');
    if (location && /\/web\/\d{14}\//.test(location)) {
      return location.startsWith('http') ? location : `https://web.archive.org${location}`;
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  await mkdir(rawDir, { recursive: true });
  let failed = 0;

  for (const record of manifest.sources) {
    const problems = [];
    console.log(`\n${record.key}  ${record.url}`);

    let html = '';
    try {
      const response = await fetch(record.url, {
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(45_000),
      });
      if (response.status !== 200) problems.push(`HTTP ${response.status}`);
      html = await response.text();
    } catch (error) {
      problems.push(`fetch failed: ${error.message}`);
    }

    if (html) {
      const canonical = pick(html, /<link rel="canonical" href="([^"]+)"/i);
      const headline = pick(html, /<meta property="og:title" content="([^"]+)"/i);
      const published = pick(html, /"datePublished"\s*:\s*"([^"]+)"/i);
      const byline = pick(html, /"author"\s*:\s*\[?\s*\{[^}]*?"name"\s*:\s*"([^"]+)"/i);

      if (canonical !== record.url) problems.push(`canonical is ${canonical}`);
      if (headline !== record.headline) problems.push(`headline is "${headline}"`);
      if (!published?.startsWith(record.published)) problems.push(`published is ${published}`);
      if (byline !== record.byline) problems.push(`byline is ${byline}`);

      const text = plain(html);
      for (const claim of record.claimsUsed) {
        if (!text.includes(plain(claim.excerpt))) problems.push(`excerpt not found: "${claim.excerpt}"`);
      }

      const sha256 = createHash('sha256').update(html).digest('hex');
      await writeFile(join(rawDir, `${record.key}.html`), html);
      record.snapshot = { file: `raw/${record.key}.html`, sha256, bytes: Buffer.byteLength(html) };
      record.publishedAt = published;
    }

    record.retrieved = today();

    if (!record.wayback) {
      record.wayback = await wayback(record.url);
    }

    if (problems.length) {
      failed += 1;
      record.status = 'FAILED';
      record.problems = problems;
      problems.forEach((p) => console.log(`  ✗ ${p}`));
    } else {
      record.status = 'VERIFIED';
      delete record.problems;
      console.log('  ✓ canonical URL, headline, date, byline and every excerpt match');
      console.log(`  ✓ snapshot ${record.snapshot.sha256.slice(0, 16)}…`);
      console.log(record.wayback ? `  ✓ wayback ${record.wayback}` : '  · wayback snapshot pending (Internet Archive unavailable)');
    }
  }

  manifest.checked = new Date().toISOString();
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  if (failed) {
    console.error(`\n${failed} source(s) failed verification. ARCHIVE REQUIRED — PUBLICATION BLOCKED.`);
    process.exit(1);
  }
  console.log('\nAll media sources verified.');
}

main();
