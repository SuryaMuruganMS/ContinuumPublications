import type { Metadata } from 'next';
import Link from 'next/link';

import { site } from '@/content/site';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { PageHeader } from '@/components/site/PageHeader';
import { ContactForm } from '@/components/site/ContactForm';
import styles from '@/components/site/Page.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Contact',
  description:
    'Report a correction, send a document, or put a research question to Continuum Publications.',
  path: '/contact/',
});

export default function ContactPage() {
  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Contact"
        title="Tell us what we got wrong"
        deck="Corrections, documents and research questions are the three things this desk most wants to receive. Pick a category and the form composes the email for you."
        meta={['No form service', 'No tracking', 'Corrected within 48 hours of confirmation']}
      />

      <div className={styles.body}>
        <div className={styles.split}>
          <div className={styles.rail}>
            <p className={styles.railHead}>Direct addresses</p>
            <ul className={styles.railList}>
              <li>
                <a className={styles.railLink} href={`mailto:${site.email.corrections}`}>
                  <span className={styles.railIndex}>01</span>
                  Corrections
                </a>
              </li>
              <li>
                <a className={styles.railLink} href={`mailto:${site.email.documents}`}>
                  <span className={styles.railIndex}>02</span>
                  Documents
                </a>
              </li>
              <li>
                <a className={styles.railLink} href={`mailto:${site.email.general}`}>
                  <span className={styles.railIndex}>03</span>
                  Everything else
                </a>
              </li>
            </ul>
          </div>

          <div>
            <ContactForm />

            <div className={styles.footer}>
              <div className={styles.grid}>
                <div className={styles.gridCell}>
                  <span className={styles.gridLabel}>What we do</span>
                  <span className={styles.gridTitle}>Read every challenge</span>
                  <span className={styles.gridBody}>
                    We keep a table behind every note listing each claim, its source and the exact
                    passage supporting it. A challenge sends us to that row. If our source does not
                    support what we wrote, we correct it and log it. If we disagree, we tell you
                    why — and we log it either way. See{' '}
                    <Link href="/corrections/">the corrections ledger</Link>.
                  </span>
                </div>

                <div className={styles.gridCell}>
                  <span className={styles.gridLabel}>What we do not do</span>
                  <span className={styles.gridTitle}>Guest posts and placements</span>
                  <span className={styles.gridBody}>
                    We do not accept guest posts, sponsored placements, affiliate arrangements or
                    link requests, and we do not take payment for coverage. See{' '}
                    <Link href="/standards/#conflicts">editorial standards</Link>.
                  </span>
                </div>

                <div className={styles.gridCell}>
                  <span className={styles.gridLabel}>What we ask for</span>
                  <span className={styles.gridTitle}>As little as possible</span>
                  <span className={styles.gridBody}>
                    A category, a subject and a message. No name, no organisation, no phone number.
                    Whatever is in your email reaches us; nothing else does. See{' '}
                    <Link href="/privacy/">privacy</Link>.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Contact', path: '/contact/' },
        ])}
      />
    </div>
  );
}
