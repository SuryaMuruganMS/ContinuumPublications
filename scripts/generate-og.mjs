/**
 * Build the Open Graph cards as real .png files in public/og/.
 *
 * WHY NOT the built-in opengraph-image convention: under `output: 'export'` it
 * emits an extensionless file at /opengraph-image, and most static hosts serve
 * a file with no extension as application/octet-stream. X and LinkedIn reject
 * that. Writing actual .png files into public/ sidesteps the whole problem and
 * works identically on every host.
 *
 * Run automatically by `npm run build` (see the prebuild script). Safe to run
 * on its own: `npm run og`.
 *
 * Fonts are downloaded once into .cache/og-fonts and reused. With no network
 * and no cache the script still succeeds, falling back to the renderer's own
 * font — the cards are then plainer, and the build is not blocked.
 */

import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'og');
const fontCache = join(root, '.cache', 'og-fonts');

const SIZE = { width: 1200, height: 630 };

const COLOR = {
  bg: '#050505',
  panel: '#0B0B0B',
  fg: '#F2F0EA',
  muted: '#A5A5A5',
  dim: '#6F6F6F',
  faint: '#4A4A4A',
  orange: '#FF5A00',
  orangeBright: '#FF6A00',
  line: 'rgba(242,240,234,0.12)',
};

/* ------------------------------------------------------------------ */
/* Fonts                                                               */
/* ------------------------------------------------------------------ */

const FONTS = [
  { file: 'archivo-700', name: 'Archivo', weight: 700, family: 'Archivo:wght@700' },
  { file: 'archivo-400', name: 'Archivo', weight: 400, family: 'Archivo:wght@400' },
  { file: 'jetbrains-500', name: 'JetBrains Mono', weight: 500, family: 'JetBrains+Mono:wght@500' },
];

/** An old user agent makes the Google Fonts API return TrueType, which the
 *  renderer can read. Modern agents get woff2, which it cannot. */
const LEGACY_UA =
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0 Safari/537.36';

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Fonts are requested with an explicit `text=` parameter listing every
 * character the cards actually use. Without it Google returns the Latin
 * subset, which has no rupee sign — and ₹ is the single most important glyph
 * on this publication's cards.
 */
async function loadFonts(charset) {
  await mkdir(fontCache, { recursive: true });

  const chars = [...new Set(charset.split(''))].sort().join('');
  const key = createHash('sha1').update(chars).digest('hex').slice(0, 10);
  const loaded = [];

  for (const font of FONTS) {
    const cached = join(fontCache, `${font.file}-${key}.ttf`);

    if (!(await exists(cached))) {
      try {
        const cssUrl = `https://fonts.googleapis.com/css2?family=${font.family}&text=${encodeURIComponent(chars)}`;
        const cssResponse = await fetch(cssUrl, { headers: { 'User-Agent': LEGACY_UA } });
        if (!cssResponse.ok) throw new Error(`css ${cssResponse.status}`);
        const css = await cssResponse.text();
        const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
        if (!url) throw new Error('no font url in css');
        const fontResponse = await fetch(url);
        if (!fontResponse.ok) throw new Error(`font ${fontResponse.status}`);
        await writeFile(cached, Buffer.from(await fontResponse.arrayBuffer()));
        console.log(`  fetched ${font.file}`);
      } catch (error) {
        console.warn(`  could not fetch ${font.file} (${error.message}); using fallback`);
        continue;
      }
    }

    loaded.push({
      name: font.name,
      weight: font.weight,
      style: 'normal',
      data: await readFile(cached),
    });
  }

  return loaded;
}

/** Every string that ends up rendered, so the subset request covers all of it. */
function collectText(node, into = []) {
  if (node == null || node === false) return into;
  if (typeof node === 'string' || typeof node === 'number') {
    into.push(String(node));
    return into;
  }
  if (Array.isArray(node)) {
    for (const child of node) collectText(child, into);
    return into;
  }
  if (node.props?.children !== undefined) collectText(node.props.children, into);
  return into;
}

/* ------------------------------------------------------------------ */
/* Element helpers — plain objects, no JSX, so this runs in bare node   */
/* ------------------------------------------------------------------ */

const el = (type, style, children) => ({ type, props: { style, children } });
const text = (value, style) => el('div', style, value);

const MONO = { fontFamily: 'JetBrains Mono', fontWeight: 500 };
const SANS = { fontFamily: 'Archivo' };

function frame(children) {
  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: COLOR.bg,
      padding: '64px 72px',
      color: COLOR.fg,
      position: 'relative',
    },
    [
      // Corner brackets — the evidence motif.
      el('div', {
        position: 'absolute',
        top: 32,
        left: 32,
        width: 34,
        height: 34,
        borderLeft: `2px solid ${COLOR.orange}`,
        borderTop: `2px solid ${COLOR.orange}`,
      }),
      el('div', {
        position: 'absolute',
        bottom: 32,
        right: 32,
        width: 34,
        height: 34,
        borderRight: `2px solid ${COLOR.orange}`,
        borderBottom: `2px solid ${COLOR.orange}`,
      }),
      ...children,
    ],
  );
}

function masthead(right) {
  return el(
    'div',
    { display: 'flex', alignItems: 'center', width: '100%' },
    [
      el('div', { display: 'flex', alignItems: 'center', gap: 14 }, [
        el('div', { width: 13, height: 13, background: COLOR.orange }),
        text('CONTINUUM PUBLICATIONS', {
          ...SANS,
          fontWeight: 700,
          fontSize: 23,
          letterSpacing: 6,
          color: COLOR.fg,
        }),
      ]),
      right
        ? text(right, {
            ...MONO,
            fontSize: 19,
            letterSpacing: 4,
            color: COLOR.dim,
            marginLeft: 'auto',
          })
        : el('div', { marginLeft: 'auto' }),
    ],
  );
}

function footRule(label) {
  return el('div', { display: 'flex', alignItems: 'center', gap: 18, width: '100%' }, [
    el('div', { height: 2, width: 78, background: COLOR.orange }),
    text(label, { ...MONO, fontSize: 19, letterSpacing: 4, color: COLOR.faint }),
  ]);
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

function defaultCard() {
  return frame([
    masthead('INDEPENDENT RESEARCH DESK'),
    el('div', { display: 'flex', flexDirection: 'column', gap: 8 }, [
      text('Primary documents.', {
        ...SANS,
        fontWeight: 700,
        fontSize: 68,
        letterSpacing: -2.5,
        lineHeight: 1.1,
      }),
      text('Public data.', {
        ...SANS,
        fontWeight: 700,
        fontSize: 68,
        letterSpacing: -2.5,
        lineHeight: 1.1,
      }),
      text('What the evidence supports.', {
        ...SANS,
        fontWeight: 700,
        fontSize: 68,
        letterSpacing: -2.5,
        lineHeight: 1.1,
        color: COLOR.muted,
      }),
      text('What it does not.', {
        ...SANS,
        fontWeight: 700,
        fontSize: 68,
        letterSpacing: -2.5,
        lineHeight: 1.1,
        color: COLOR.orangeBright,
      }),
    ]),
    footRule('CONTINUUMPUBLICATIONS.ORG'),
  ]);
}

/**
 * The article card. The two figures are the card — the headline is the caption
 * under them. A social card for this desk should be the evidence, not a title
 * in a box.
 */
function articleCard({ index, figure, counterFigure, label, title }) {
  return frame([
    masthead(index),

    el('div', { display: 'flex', flexDirection: 'column', gap: 26, width: '100%' }, [
      el('div', { display: 'flex', alignItems: 'flex-end', gap: 34, width: '100%' }, [
        // The counter figure, small and grey.
        el('div', { display: 'flex', flexDirection: 'column', gap: 8 }, [
          text('NUMBER', { ...MONO, fontSize: 17, letterSpacing: 5, color: COLOR.faint }),
          text(counterFigure, {
            ...MONO,
            fontSize: 54,
            letterSpacing: -1,
            color: COLOR.dim,
            lineHeight: 1,
          }),
        ]),

        el('div', {
          width: 2,
          height: 74,
          background: COLOR.orange,
          marginBottom: 6,
        }),

        // The headline figure.
        el('div', { display: 'flex', flexDirection: 'column', gap: 8 }, [
          text('AMOUNT', { ...MONO, fontSize: 17, letterSpacing: 5, color: COLOR.faint }),
          el('div', { display: 'flex', alignItems: 'baseline', gap: 16 }, [
            text(figure, {
              ...MONO,
              fontSize: 88,
              letterSpacing: -3,
              color: COLOR.orangeBright,
              lineHeight: 1,
            }),
            text('crore', {
              ...MONO,
              fontSize: 30,
              letterSpacing: 1,
              color: COLOR.dim,
              lineHeight: 1,
            }),
          ]),
        ]),
      ]),

      el('div', { height: 1, width: '100%', background: COLOR.line }),

      text(title, {
        ...SANS,
        fontWeight: 700,
        fontSize: 38,
        letterSpacing: -1.2,
        lineHeight: 1.22,
        color: COLOR.fg,
        maxWidth: 1000,
      }),
    ]),

    footRule(label),
  ]);
}

/* ------------------------------------------------------------------ */
/* Run                                                                 */
/* ------------------------------------------------------------------ */

async function main() {
  console.log('Generating Open Graph cards…');

  const { ImageResponse } = await import('next/dist/server/og/image-response.js');
  await mkdir(outDir, { recursive: true });

  /* Article cards are described here rather than imported from the TypeScript
     content layer, so this script stays runnable by plain node with no build
     step. Add an entry when you publish a note. */
  const articles = [
    {
      slug: 'irdai-health-claims-disallowed-row',
      index: 'NOTE 0001',
      figure: '₹18,521.02',
      counterFigure: '0.00 lakh',
      label: 'IRDAI HEALTH CLAIMS · TABLE I.29',
      title:
        'IRDAI’s health claims table prints ₹18,521 crore against a disallowed count of 0.00 lakh',
    },
    {
      slug: 'disallowed-vs-repudiated-claims-irdai',
      index: 'NOTE 0002',
      figure: '₹18,521.02',
      counterFigure: '29.51 lakh',
      label: 'IRDAI · DISALLOWED vs REPUDIATED',
      title:
        'Disallowed vs repudiated claims in IRDAI health data: what each row shows',
    },
  ];

  const cards = [
    { name: 'default.png', element: defaultCard() },
    ...articles.map((article) => ({
      name: `${article.slug}.png`,
      element: articleCard(article),
    })),
  ];

  const charset = cards.flatMap((card) => collectText(card.element)).join('');
  const fonts = await loadFonts(charset);

  for (const card of cards) {
    const response = new ImageResponse(card.element, {
      ...SIZE,
      ...(fonts.length > 0 ? { fonts } : {}),
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(join(outDir, card.name), buffer);
    console.log(`  wrote og/${card.name} (${Math.round(buffer.length / 1024)} kB)`);
  }

  console.log('Done.');
}

main().catch((error) => {
  console.error('OG generation failed:', error);
  process.exit(1);
});
