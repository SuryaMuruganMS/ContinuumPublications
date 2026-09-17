import type { Metadata } from 'next';
import Link from 'next/link';

import { getAllArticles } from '@/content/articles';
import { formatDate, isoDate, pad } from '@/lib/format';
import { absoluteUrl, pageMeta } from '@/lib/seo';
import { PageHeader } from '@/components/site/PageHeader';
import styles from '@/components/site/Page.module.css';
import research from '@/components/site/Research.module.css';

/**
 * /articles/ is the parent of every note's URL, so a reader who trims the
 * slug off the address bar lands somewhere sensible rather than on a 404.
 * The canonical points at /research/, which is the page meant to be indexed.
 */
export const metadata: Metadata = {
  ...pageMeta({
    title: 'Notes',
    description: 'An index of every research note published by Continuum Publications.',
    path: '/articles/',
  }),
  alternates: { canonical: absoluteUrl('/research/') },
};

export default function ArticlesIndexPage() {
  const articles = getAllArticles();

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Notes"
        title="Index of notes"
        deck="Every published note by its permanent address. The full research index, with findings and evidence, is on the Research page."
      />

      <div className={styles.body}>
        <ol className={research.list}>
          {articles.map((entry) => (
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
                </div>
              </article>
            </li>
          ))}
        </ol>

        <div className={styles.footer}>
          <Link href="/research/" className={styles.action} data-signal="true">
            Open the research index <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
