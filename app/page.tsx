import type { Metadata } from 'next';
import Link from 'next/link';

import {
  deskEvidenceTotals,
  deskStats,
  evidenceCounts,
  getAllArticles,
  getLatestArticle,
} from '@/content/articles';
import { site } from '@/content/site';
import { evidenceOrder } from '@/content/evidence-states';
import { formatDateCompact, pad } from '@/lib/format';
import { pageMeta } from '@/lib/seo';

import { Opening } from '@/components/home/Opening';
import { EvidenceSignal, EvidenceSystem, Finding, Pipeline } from '@/components/home/sections';
import { Newsletter } from '@/components/site/Newsletter';
import styles from '@/components/home/Home.module.css';

export const metadata: Metadata = pageMeta({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: '/',
  bare: true,
});

/** Placeholder slots in the archive preview, so the index reads as a ledger. */
const ARCHIVE_SLOTS = 3;

/** Keeps the headline true if a state is ever added or removed. */
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];

const TRANSPARENCY = [
  {
    label: 'Standards',
    title: 'What we will and will not print',
    body: 'The rules the desk works to: evidence, sourcing, certainty, interpretation, conflicts, and where AI assistance sits in all of it.',
    href: '/standards/',
  },
  {
    label: 'Methods',
    title: 'How a note is actually built',
    body: 'Eight stages from primary document to publication, including the adversarial pass we run against our own draft before anyone else sees it.',
    href: '/methods/',
  },
  {
    label: 'Corrections',
    title: 'Every change, with the original beside it',
    body: 'We do not silently edit published text. The ledger records what was published, what it says now, and why it changed.',
    href: '/corrections/',
  },
];

export default function HomePage() {
  const stats = deskStats();
  const totals = deskEvidenceTotals();
  const feature = getLatestArticle();
  const counts = evidenceCounts(feature);
  const all = getAllArticles();

  return (
    <>
      <Opening stats={stats} />

      {/* ============ 02 — CURRENT INVESTIGATION ============ */}
      <section className="u-section u-section--band" id="current" aria-labelledby="current-title">
        <div className="u-shell">
          <div className={styles.feature}>
            <div className={styles.featureMain}>
              <p className={styles.featureIndex} data-reveal>
                <span className={styles.featureIndexNumber}>{pad(feature.index)}</span>
                <span>Current investigation</span>
              </p>

              <h2 id="current-title" className={styles.featureTitle} data-reveal>
                <Link href={`/articles/${feature.slug}/`}>{feature.title}</Link>
              </h2>

              <p className={styles.featureDeck} data-reveal>
                {feature.deck}
              </p>

              <div className={styles.featureMeta} data-reveal>
                <span>{formatDateCompact(feature.published)}</span>
                <span>{feature.readingTime} min</span>
                <span>{feature.regulators.join(' · ')}</span>
                <span>{feature.topics.slice(0, 2).join(' · ')}</span>
              </div>

              <Link href={`/articles/${feature.slug}/`} className={styles.cta} data-reveal>
                <span>Read the note</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div data-reveal>
              <EvidenceSignal counts={counts} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 03 — THE FINDING ============ */}
      <section className="u-section" aria-labelledby="finding-title">
        <div className="u-shell">
          <div className="u-head">
            <p className="u-label u-label--signal" data-reveal>
              The finding
            </p>
            <h2 id="finding-title" data-reveal>
              One row, two numbers, no reconciliation
            </h2>
            <p data-reveal>
              The health claims table prints a disallowed-claims amount beside a disallowed-claims
              count of nothing — and prints the same pair, to the paise, in both of the years we
              examined.
            </p>
          </div>

          <Finding />
        </div>
      </section>

      {/* ============ 04 — WHY IT MATTERS ============ */}
      <section className="u-section u-section--band" aria-labelledby="matters-title">
        <div className="u-shell">
          <div className={styles.matters}>
            <div className="u-head" style={{ marginBottom: 0 }}>
              <p className="u-label u-label--signal" data-reveal>
                Why it matters
              </p>
              <h2 id="matters-title" data-reveal>
                A public figure that cannot be interpreted is not a disclosure
              </h2>
              <p data-reveal>
                The desk takes no position on whether anything improper occurred. The finding is
                narrower and more durable than that: a number this size is published annually,
                and the record does not say what it counts.
              </p>
            </div>

            <div className={styles.mattersList}>
              {feature.findings.map((finding, index) => (
                <div key={finding} className={styles.mattersItem} data-reveal>
                  <span className={styles.mattersNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <p className={styles.mattersText}>{finding}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 05 — THE EVIDENCE SYSTEM ============ */}
      <section className="u-section" aria-labelledby="system-title">
        <div className="u-shell">
          <div className="u-head">
            <p className="u-label u-label--signal" data-reveal>
              The evidence system
            </p>
            <h2 id="system-title" data-reveal>
              Every claim resolves to one of {NUMBER_WORDS[evidenceOrder.length] ?? evidenceOrder.length}{' '}
              states
            </h2>
            <p data-reveal>
              Attached to each claim, visible in the text, and countable. A reader should never
              have to guess whether a sentence rests on a document or on us.
            </p>
          </div>

          <div data-reveal>
            <EvidenceSystem totals={totals} />
          </div>
        </div>
      </section>

      {/* ============ 06 — RESEARCH ARCHIVE ============ */}
      <section className="u-section u-section--band" aria-labelledby="archive-title">
        <div className="u-shell">
          <div className="u-head">
            <p className="u-label u-label--signal" data-reveal>
              Research archive
            </p>
            <h2 id="archive-title" data-reveal>
              The index
            </h2>
            <p data-reveal>
              Every note the desk has published, numbered in order. It is short. We would rather
              it stayed short and stayed right.
            </p>
          </div>

          <div className={styles.archive}>
            {all.map((entry) => (
              <Link
                key={entry.slug}
                href={`/articles/${entry.slug}/`}
                className={styles.archiveRow}
                data-reveal
              >
                <span className={styles.archiveIndex}>{pad(entry.index)}</span>
                <span className={styles.archiveTitle}>{entry.title}</span>
                <span className={styles.archiveTopics}>{entry.topics.join(' · ')}</span>
                <span className={styles.archiveDate}>{formatDateCompact(entry.published)}</span>
              </Link>
            ))}

            {Array.from({ length: ARCHIVE_SLOTS }).map((_, index) => (
              <div key={index} className={styles.archiveEmpty} aria-hidden="true">
                <span className={styles.archiveEmptyIndex}>{pad(all.length + index + 1)}</span>
                <span className={styles.archiveEmptyRule} />
              </div>
            ))}
          </div>

          <div className={styles.archiveFoot}>
            <p className={styles.archiveNote}>
              Slots below the line are not forthcoming articles. They are the shape of the index.
            </p>
            <Link href="/archive/" className={styles.cta}>
              <span>Open the archive</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 07 — HOW WE WORK ============ */}
      <section className="u-section" aria-labelledby="work-title">
        <div className="u-shell">
          <div className="u-head">
            <p className="u-label u-label--signal" data-reveal>
              How we work
            </p>
            <h2 id="work-title" data-reveal>
              Primary documents to published note
            </h2>
            <p data-reveal>
              Six stages, in order. The last one is not an afterthought — a desk that cannot
              correct itself in public has not published anything you can rely on.
            </p>
          </div>

          <Pipeline />
        </div>
      </section>

      {/* ============ 08 — TRANSPARENCY ============ */}
      <section className="u-section u-section--band" aria-labelledby="transparency-title">
        <div className="u-shell">
          <div className="u-head">
            <p className="u-label u-label--signal" data-reveal>
              Transparency
            </p>
            <h2 id="transparency-title" data-reveal>
              The rules we hold ourselves to
            </h2>
          </div>

          <div className={styles.transparency}>
            {TRANSPARENCY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.transparencyCard}
                data-reveal
              >
                <span className={styles.transparencyLabel}>{item.label}</span>
                <span className={styles.transparencyTitle}>{item.title}</span>
                <span className={styles.transparencyBody}>{item.body}</span>
                <span className={styles.transparencyGo}>
                  Read <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 09 — EMAIL ============ */}
      <section className="u-section" aria-labelledby="email-title">
        <div className="u-shell">
          <div className={styles.email}>
            <div className="u-head" style={{ marginBottom: 0 }}>
              <p className="u-label u-label--signal" data-reveal>
                Email
              </p>
              <h2 id="email-title" data-reveal>
                {site.newsletter.heading}
              </h2>
              <p data-reveal>
                We publish infrequently and only when a document supports it. Subscribing gets you
                the note, and nothing else.
              </p>
            </div>

            <div data-reveal>
              <Newsletter heading="Subscribe" sub={site.newsletter.sub} as="h3" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
