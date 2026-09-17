import type { Metadata } from 'next';
import Link from 'next/link';

import { site } from '@/content/site';
import { deskStats, getLatestArticle } from '@/content/articles';
import { formatDate, pad } from '@/lib/format';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { PageHeader } from '@/components/site/PageHeader';
import { Newsletter } from '@/components/site/Newsletter';
import styles from '@/components/site/Page.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Subscribe',
  description:
    'One research note when Continuum Publications publishes. No spam, no schedule, no subscriber-only paywall.',
  path: '/subscribe/',
});

export default function SubscribePage() {
  const stats = deskStats();
  const latest = getLatestArticle();

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Subscribe"
        title={site.newsletter.heading}
        deck={`${site.newsletter.sub} We publish when a document supports a note and not on a schedule, so this is a quiet list by design.`}
        meta={[
          `${pad(stats.notes, 2)} notes published`,
          `Last published ${formatDate(latest.published)}`,
          'Unsubscribe from any issue',
        ]}
      />

      <div className={styles.body}>
        <div className={styles.split}>
          <div className={styles.rail}>
            <p className={styles.railHead}>What you get</p>
            <ul className={styles.railList}>
              <li>
                <span className={styles.railLink}>
                  <span className={styles.railIndex}>01</span>
                  The note itself
                </span>
              </li>
              <li>
                <span className={styles.railLink}>
                  <span className={styles.railIndex}>02</span>
                  Its open questions
                </span>
              </li>
              <li>
                <span className={styles.railLink}>
                  <span className={styles.railIndex}>03</span>
                  Any correction we issue
                </span>
              </li>
            </ul>
          </div>

          <div>
            <Newsletter as="h2" heading="Subscribe" sub={site.newsletter.sub} />

            <div className={styles.sections} style={{ marginTop: 'clamp(2rem, 5vw, 3rem)' }}>
              <section className={styles.section} data-reveal>
                <header className={styles.sectionHead}>
                  <span className={styles.sectionIndex}>01</span>
                  <h2 className={styles.sectionTitle}>What arrives, and how often</h2>
                </header>
                <div className="prose prose--wide">
                  <p>
                    One email when a note is published. Nothing between notes, no weekly digest, no
                    round-up of other people&rsquo;s links, and no schedule we have to fill. If the
                    documents do not support a note in a given month, nothing arrives that month.
                  </p>
                  <p>
                    If we issue a correction to a note you were sent, you get that too. A
                    corrections policy that only reaches people who return to the site is not much
                    of a policy.
                  </p>
                  <p>
                    Everything we publish is free to read on this site. There is no subscriber-only
                    tier and no paywall, and there are no plans for one.
                  </p>
                </div>
              </section>

              <section className={styles.section} data-reveal>
                <header className={styles.sectionHead}>
                  <span className={styles.sectionIndex}>02</span>
                  <h2 className={styles.sectionTitle}>What happens to your address</h2>
                </header>
                <div className="prose prose--wide">
                  <p>
                    It is used to send you the research note, and for nothing else. We do not sell
                    it, rent it, or pass it to anyone for advertising. We do not publish subscriber
                    numbers, and we will not tell you to join thousands of other readers, because we
                    are not going to invent a figure to make a list look bigger than it is.
                  </p>
                  <p>
                    Every issue carries an unsubscribe link, and unsubscribing removes the address.
                    The full detail is on <Link href="/privacy/">the privacy page</Link>.
                  </p>
                </div>
              </section>

              <section className={styles.section} data-reveal>
                <header className={styles.sectionHead}>
                  <span className={styles.sectionIndex}>03</span>
                  <h2 className={styles.sectionTitle}>Start with the current note</h2>
                </header>
                <div className="prose prose--wide">
                  <p>
                    If you want to know what you would be signing up for, the most recent note is
                    the answer. It is the same thing that arrives by email.
                  </p>
                </div>
                <Link
                  href={`/articles/${latest.slug}/`}
                  className={styles.action}
                  data-signal="true"
                >
                  Read {pad(latest.index)} <span aria-hidden="true">→</span>
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Subscribe', path: '/subscribe/' },
        ])}
      />
    </div>
  );
}
