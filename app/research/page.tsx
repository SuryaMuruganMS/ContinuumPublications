import type { Metadata } from 'next';
import Link from 'next/link';

import { deskEvidenceTotals, deskStats, evidenceCounts, getAllArticles } from '@/content/articles';
import { evidenceOrder, evidenceStates } from '@/content/evidence-states';
import { formatDate, isoDate, pad } from '@/lib/format';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { PageHeader } from '@/components/site/PageHeader';
import { Newsletter } from '@/components/site/Newsletter';
import { site } from '@/content/site';
import styles from '@/components/site/Page.module.css';
import research from '@/components/site/Research.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Research',
  description:
    'Every note Continuum Publications has published, most recent first. Each one carries its documents, its arithmetic and the questions it could not close.',
  path: '/research/',
});

export default function ResearchPage() {
  const articles = getAllArticles();
  const stats = deskStats();
  const totals = deskEvidenceTotals();

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Research"
        title="Everything the desk has published"
        deck="Notes are published when a document supports one, and not on a schedule. Each carries the documents it rests on, the arithmetic we ran, and the questions we could not close."
        meta={[
          `${pad(stats.notes, 2)} notes`,
          `${pad(stats.citations, 2)} citations`,
          `${pad(stats.unresolved, 2)} unresolved`,
          `${pad(stats.corrections, 2)} corrections`,
        ]}
      />

      <div className={styles.body}>
        <ol className={research.list}>
          {articles.map((entry) => {
            const counts = evidenceCounts(entry);
            return (
              <li key={entry.slug}>
                <article className={research.item} data-reveal>
                  <div className={research.itemIndex}>
                    <span className={research.itemNumber}>{pad(entry.index)}</span>
                    <time className={research.itemDate} dateTime={isoDate(entry.published)}>
                      {formatDate(entry.published)}
                    </time>
                  </div>

                  <div className={research.itemMain}>
                    <h2 className={research.itemTitle}>
                      <Link href={`/articles/${entry.slug}/`}>{entry.title}</Link>
                    </h2>
                    <p className={research.itemDeck}>{entry.deck}</p>

                    <ul className={research.itemFindings}>
                      {entry.findings.slice(0, 2).map((finding) => (
                        <li key={finding}>{finding}</li>
                      ))}
                    </ul>

                    <div className={research.itemTags}>
                      {entry.regulators.map((regulator) => (
                        <span key={regulator} className={research.tagSignal}>
                          {regulator}
                        </span>
                      ))}
                      {entry.topics.map((topic) => (
                        <span key={topic} className={research.tag}>
                          {topic}
                        </span>
                      ))}
                      <span className={research.tagPlain}>{entry.readingTime} min</span>
                    </div>
                  </div>

                  <div className={research.itemEvidence}>
                    <p className={research.evidenceHead}>Evidence</p>
                    {evidenceOrder.map((kind) => (
                      <p key={kind} className={research.evidenceRow} data-kind={kind}>
                        <span className={research.evidenceGlyph} aria-hidden="true" />
                        <span className={research.evidenceLabel}>
                          {evidenceStates[kind].label}
                        </span>
                        <span className={research.evidenceCount}>
                          {pad(counts[kind], 2)}
                        </span>
                      </p>
                    ))}
                    <Link href={`/articles/${entry.slug}/`} className={research.itemGo}>
                      Read <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <section className={research.totals} data-reveal>
          <p className={research.totalsHead}>The desk, in totals</p>
          <div className={research.totalsGrid}>
            {evidenceOrder.map((kind) => (
              <div key={kind} className={research.totalsCell} data-kind={kind}>
                <span className={research.totalsValue}>{pad(totals[kind], 2)}</span>
                <span className={research.totalsLabel}>{evidenceStates[kind].label}</span>
                <span className={research.totalsDefinition}>
                  {evidenceStates[kind].definition}
                </span>
              </div>
            ))}
          </div>
          <p className={research.totalsFoot}>
            Counted from the sources attached to every published note. Nothing here is typed in by
            hand. <Link href="/standards/#evidence">What each state commits us to</Link>.
          </p>
        </section>

        <div className={styles.footer}>
          <Newsletter />
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Research', path: '/research/' },
        ])}
      />
    </div>
  );
}
