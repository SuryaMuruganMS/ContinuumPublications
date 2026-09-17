/**
 * Source-consistency audit.
 *
 *   node scripts/audit-sources.mjs          before a build (runs in prebuild)
 *   node scripts/audit-sources.mjs --built  after a build, against out/ (runs in postbuild)
 *
 * Before a build it checks that:
 *   · every fromMedia('key') in a note names a VERIFIED record in the manifest,
 *   · the manifest's usedBy lists match what the notes actually cite,
 *   · no retired source's publication name appears anywhere that is published.
 *
 * After a build it checks that the exported site contains:
 *   · no internal evidence-matrix references,
 *   · no retired source names,
 *   · every verified media URL a note relies on.
 *
 * Any failure exits non-zero, which stops `npm run build`.
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const built = process.argv.includes('--built');
const problems = [];

const manifest = JSON.parse(await readFile(join(root, 'archive/sources/manifest.json'), 'utf8'));
const verified = new Map(manifest.sources.map((s) => [s.key, s]));
const retiredLog = JSON.parse(await readFile(join(root, 'archive/sources/retired.json'), 'utf8'));
const retiredNames = retiredLog.retired.map((r) => r.publication);
const retiredKeys = new Set(retiredLog.retired.map((r) => r.key));

async function walk(dir, test, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, test, out);
    else if (test(entry.name)) out.push(path);
  }
  return out;
}

const rel = (p) => relative(root, p).replace(/\\/g, '/');

if (!built) {
  /* ---- Notes against the manifest ---- */
  const articleDir = join(root, 'content/articles');
  const notes = (await walk(articleDir, (n) => n.endsWith('.ts')))
    .filter((p) => !/[\\/](index|_TEMPLATE)\.ts$/.test(p));

  const cited = new Map(); // key -> Set of "slug:S18"

  for (const file of notes) {
    // Normalise line endings: a CRLF checkout must not silently skip the gate.
    const text = (await readFile(file, 'utf8')).replace(/\r\n/g, '\n');
    const slug = text.match(/slug:\s*'([^']+)'/)?.[1];
    const blocks = text.split(/\n    \{\n      id: '/).slice(1);
    for (const block of blocks) {
      const id = block.slice(0, block.indexOf("'"));
      const key = block.match(/fromMedia\(\s*'([^']+)'/)?.[1];
      const kind = block.match(/kind: '([^']+)'/)?.[1];
      if (kind === 'reported' && !key) {
        problems.push(`${rel(file)} ${id}: reported source not drawn from the media registry`);
      }
      if (kind === 'reported' && /\burl:\s*'/.test(block)) {
        problems.push(`${rel(file)} ${id}: reported source sets a URL by hand`);
      }
      if (!key) continue;
      const record = verified.get(key);
      if (retiredKeys.has(key)) problems.push(`${rel(file)} ${id}: ${key} is RETIRED and may not be cited`);
      else if (!record) problems.push(`${rel(file)} ${id}: unknown media key ${key} — ARCHIVE REQUIRED, PUBLICATION BLOCKED`);
      if (record && record.status !== 'VERIFIED') problems.push(`${rel(file)} ${id}: ${key} is ${record.status} — ARCHIVE REQUIRED, PUBLICATION BLOCKED`);
      if (!cited.has(key)) cited.set(key, new Set());
      cited.get(key).add(`${slug}:${id}`);
    }
  }

  for (const record of manifest.sources) {
    const declared = new Set(record.usedBy.flatMap((u) => u.sourceIds.map((id) => `${u.article}:${id}`)));
    const actual = cited.get(record.key) ?? new Set();
    for (const x of actual) if (!declared.has(x)) problems.push(`manifest ${record.key}: usedBy is missing ${x}`);
    for (const x of declared) if (!actual.has(x)) problems.push(`manifest ${record.key}: usedBy lists ${x}, which does not cite it`);
  }

  /* ---- Retired names in anything that ships ---- */
  const shipping = [
    ...(await walk(join(root, 'app'), () => true)),
    ...(await walk(join(root, 'components'), () => true)),
    ...(await walk(join(root, 'content'), () => true)),
    ...(await walk(join(root, 'lib'), () => true)),
    ...(await walk(join(root, 'public'), (n) => !n.endsWith('.png'))),
  ];
  for (const file of shipping) {
    const text = await readFile(file, 'utf8');
    for (const name of retiredNames) {
      if (text.toLowerCase().includes(name.toLowerCase())) {
        problems.push(`${rel(file)}: mentions retired source "${name}"`);
      }
    }
  }

  console.log(`Source audit: ${notes.length} note(s), ${cited.size} media record(s) cited, ${retiredNames.length} retired source(s) checked.`);
} else {
  /* ---- The exported site ---- */
  const out = join(root, 'out');
  const files = await walk(out, (n) => /\.(html|txt|js|json|xml)$/.test(n));
  const corpus = new Map();
  for (const file of files) corpus.set(file, await readFile(file, 'utf8'));

  for (const [file, text] of corpus) {
    if (/Matrix C\d|internalRef|evidence matrix row/i.test(text)) {
      problems.push(`${rel(file)}: exposes an internal matrix reference`);
    }
    for (const name of retiredNames) {
      if (text.toLowerCase().includes(name.toLowerCase())) problems.push(`${rel(file)}: mentions retired source "${name}"`);
    }
  }

  const all = [...corpus.values()].join('\n');
  for (const record of manifest.sources) {
    if (record.usedBy.length && !all.includes(record.url)) {
      problems.push(`out/: verified URL for ${record.key} is not present in the built site`);
    }
  }

  console.log(`Built-site audit: ${files.length} file(s) scanned.`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log('  ✓ no problems');
