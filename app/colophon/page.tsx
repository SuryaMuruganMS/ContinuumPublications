import type { Metadata } from 'next';
import Link from 'next/link';

import { site } from '@/content/site';
import { deskStats } from '@/content/articles';
import { evidenceOrder, evidenceStates } from '@/content/evidence-states';
import { pad } from '@/lib/format';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { ContentsRail, NumberedSection, PageHeader } from '@/components/site/PageHeader';
import styles from '@/components/site/Page.module.css';
import colophon from '@/components/site/Colophon.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Colophon',
  description:
    'How this site is built: the typefaces, the colour system, the evidence markers, and why a research desk is set in black and orange.',
  path: '/colophon/',
});

const SECTIONS = [
  { id: 'palette', title: 'Colour' },
  { id: 'type', title: 'Typography' },
  { id: 'markers', title: 'Evidence markers' },
  { id: 'build', title: 'How it is built' },
];

const SWATCHES = [
  { token: '--ink-0', name: 'Page', value: '#050505', role: 'The ground everything sits on.' },
  { token: '--ink-1', name: 'Band', value: '#0B0B0B', role: 'Alternating sections and panels.' },
  { token: '--ink-2', name: 'Surface', value: '#111111', role: 'Inputs, quotes, raised cells.' },
  { token: '--orange', name: 'Signal', value: '#FF5A00', role: 'Evidence, active state, the thing to act on.' },
  { token: '--orange-hot', name: 'Hot', value: '#FF7A18', role: 'Hover, and the far end of a gradient.' },
  { token: '--fg', name: 'Text', value: '#F2F0EA', role: 'Warm off-white. Never pure white.' },
  { token: '--fg-muted', name: 'Muted', value: '#A5A5A5', role: 'Decks, secondary prose.' },
  { token: '--fg-dim', name: 'Dim', value: '#949494', role: 'Metadata, captions, labels.' },
  { token: '--fg-faint', name: 'Faint', value: '#808080', role: 'The quietest label that still clears AA.' },
];

export default function ColophonPage() {
  const stats = deskStats();

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Colophon"
        title="How this site is built"
        deck="A publication that asks readers to check its working should be willing to show how its own pages are made. Nothing here affects what we publish; it is here because it is the same instinct."
        meta={[
          'Static HTML',
          'Three typefaces',
          `${pad(evidenceOrder.length, 2)} evidence markers`,
          'No trackers',
        ]}
      />

      <div className={styles.body}>
        <div className={styles.split}>
          <ContentsRail items={SECTIONS} />

          <div className={styles.sections}>
            <NumberedSection id="palette" index={1} title="Colour">
              <div className="prose prose--wide">
                <p>
                  Black is the information space. Orange is the evidence signal. Orange never fills
                  a large area — it marks a citation, an active state, a figure that matters, or
                  something you are meant to act on. When everything is a signal, nothing is.
                </p>
              </div>

              <div className={colophon.swatches}>
                {SWATCHES.map((swatch) => (
                  <div key={swatch.token} className={colophon.swatch}>
                    <span
                      className={colophon.swatchChip}
                      style={{ background: swatch.value }}
                      aria-hidden="true"
                    />
                    <span className={colophon.swatchName}>{swatch.name}</span>
                    <span className={colophon.swatchValue}>{swatch.value}</span>
                    <span className={colophon.swatchToken}>{swatch.token}</span>
                    <span className={colophon.swatchRole}>{swatch.role}</span>
                  </div>
                ))}
              </div>

              <p className={colophon.note}>
                Every colour in the site is a custom property defined in one file. There are no hex
                values anywhere else in the codebase.
              </p>
            </NumberedSection>

            <NumberedSection id="type" index={2} title="Typography">
              <div className="prose prose--wide">
                <p>
                  Three faces, each with a job. All three are self-hosted and served from the same
                  origin as the page, so reading this does not involve a request to a font service.
                </p>
              </div>

              <div className={colophon.typeGrid}>
                <div className={colophon.typeCell}>
                  <span className={colophon.typeLabel}>Headlines and interface</span>
                  <span className={colophon.typeSpecimen} data-face="sans">
                    Archivo
                  </span>
                  <span className={colophon.typeBody}>
                    An editorial grotesk. Tight, slightly condensed, and comfortable at the very
                    large sizes the mastheads use.
                  </span>
                </div>

                <div className={colophon.typeCell}>
                  <span className={colophon.typeLabel}>The reading column</span>
                  <span className={colophon.typeSpecimen} data-face="serif">
                    Source Serif 4
                  </span>
                  <span className={colophon.typeBody}>
                    Long-form on screen. Notes run to several thousand words and a serif carries
                    them better than a sans does.
                  </span>
                </div>

                <div className={colophon.typeCell}>
                  <span className={colophon.typeLabel}>Data and locators</span>
                  <span className={colophon.typeSpecimen} data-face="mono">
                    JetBrains Mono
                  </span>
                  <span className={colophon.typeBody}>
                    Every figure that came off a document is set in mono with tabular figures, so a
                    number in the prose is visibly a number from somewhere.
                  </span>
                </div>
              </div>
            </NumberedSection>

            <NumberedSection id="markers" index={3} title="Evidence markers">
              <div className="prose prose--wide">
                <p>
                  Each evidence state has its own colour, its own marker shape and its own label.
                  The system never depends on colour alone — a reader who cannot distinguish the
                  hues still has the glyph and the word, and a screen reader announces the state
                  before the citation.
                </p>
              </div>

              <div className={colophon.markers}>
                {evidenceOrder.map((kind) => (
                  <div key={kind} className={colophon.marker} data-kind={kind}>
                    <span className={colophon.markerGlyph} aria-hidden="true" />
                    <span className={colophon.markerName}>{evidenceStates[kind].label}</span>
                    <span className={colophon.markerDefinition}>
                      {evidenceStates[kind].definition}
                    </span>
                  </div>
                ))}
              </div>

              <p className={colophon.note}>
                The counts beside these markers on a note are grouped from that note&rsquo;s own
                sources at build time. They are derived, never authored — which is the point of
                having them. See <Link href="/standards/#evidence">editorial standards</Link>.
              </p>
            </NumberedSection>

            <NumberedSection id="build" index={4} title="How it is built">
              <div className="prose prose--wide">
                <dl>
                  <dt>Output</dt>
                  <dd>
                    Static HTML. Every page is a file, generated at build time and served as it was
                    built. There is no application server and no database.
                  </dd>

                  <dt>Framework</dt>
                  <dd>Next.js with the App Router, TypeScript, and React.</dd>

                  <dt>Styling</dt>
                  <dd>
                    Hand-written CSS with custom properties and CSS modules. No utility framework
                    and no runtime CSS-in-JS.
                  </dd>

                  <dt>Motion</dt>
                  <dd>
                    CSS transitions driven by a single IntersectionObserver, with counters on
                    requestAnimationFrame. No animation library. Everything resolves to its final
                    state under <code>prefers-reduced-motion</code>, and the footer carries a toggle
                    for readers who want stillness here and motion elsewhere.
                  </dd>

                  <dt>Content</dt>
                  <dd>
                    Typed objects in the repository. A note is one file; its figures live in
                    separate data files that the interactive figures read. Adding a note changes no
                    component.
                  </dd>

                  <dt>Third-party code</dt>
                  <dd>
                    None at runtime. No analytics, no embeds, no tag manager, no font CDN. See{' '}
                    <Link href="/privacy/">privacy</Link>.
                  </dd>
                </dl>

                <p className="small">
                  The desk currently holds {stats.notes === 1 ? 'one note' : `${stats.notes} notes`},{' '}
                  {stats.citations} citations across {stats.documents} documents, and{' '}
                  {stats.unresolved} questions recorded as unresolved.
                </p>
              </div>
            </NumberedSection>
          </div>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Colophon', path: '/colophon/' },
        ])}
      />
    </div>
  );
}
