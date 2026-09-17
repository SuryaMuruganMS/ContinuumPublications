import Link from 'next/link';

import { getLatestArticle, deskStats } from '@/content/articles';
import { pad } from '@/lib/format';
import styles from '@/components/site/NotFound.module.css';

/**
 * 404.
 *
 * The one page on the site with no evidence behind it, so it says that rather
 * than apologising. With `output: 'export'` this is emitted as 404.html, which
 * Netlify, Cloudflare Pages and GitHub Pages all serve automatically.
 */
export default function NotFound() {
  const latest = getLatestArticle();
  const stats = deskStats();

  return (
    <div className={`u-shell ${styles.root}`}>
      <div className={styles.frame}>
        <p className={styles.status}>
          <span className={styles.statusCode}>404</span>
          <span className={styles.statusRule} aria-hidden="true" />
          <span>No record at this address</span>
        </p>

        <h1 className={styles.title} data-reveal-mask>
          The document could not be found.
        </h1>

        <p className={styles.body}>
          Every other page on this site can tell you where its contents came from. This one cannot,
          because there is nothing here to cite. The address may be mistyped, or it may point at
          something that never existed.
        </p>

        <div className={styles.working}>
          <p className={styles.workingLabel}>Where we looked</p>
          <ul className={styles.workingList}>
            <li>The research index — {pad(stats.notes, 2)} published notes</li>
            <li>The archive, by regulator, topic, document type and year</li>
            <li>Every cited document and evidence record in the search index</li>
          </ul>
          <p className={styles.workingResult}>Not found in any of them.</p>
        </div>

        <div className={styles.actions}>
          <Link href={`/articles/${latest.slug}/`} className={styles.action} data-signal="true">
            Read the current note <span aria-hidden="true">→</span>
          </Link>
          <Link href="/research/" className={styles.action}>
            Research index
          </Link>
          <Link href="/archive/" className={styles.action}>
            Archive
          </Link>
          <Link href="/search/" className={styles.action}>
            Search
          </Link>
        </div>

        <p className={styles.foot}>
          If you followed a link from somewhere on this site to get here, that is our error and we
          would like to fix it. <Link href="/contact/">Tell us where it was</Link>.
        </p>
      </div>
    </div>
  );
}
