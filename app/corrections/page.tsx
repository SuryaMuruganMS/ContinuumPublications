import type { Metadata } from 'next';
import Link from 'next/link';

import { site } from '@/content/site';
import { allCorrections, correctionSeverity } from '@/content/corrections';
import { deskStats, getAllArticles } from '@/content/articles';
import { formatDate, isoDate, pad } from '@/lib/format';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { PageHeader } from '@/components/site/PageHeader';
import styles from '@/components/site/Page.module.css';
import corrections from '@/components/site/Corrections.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Corrections',
  description:
    'The Continuum Publications corrections ledger. Every change to a published note, with the original wording printed beside the new one.',
  path: '/corrections/',
});

export default function CorrectionsPage() {
  const ledger = allCorrections();
  const stats = deskStats();
  const notes = getAllArticles();

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Corrections"
        title="Every change, with the original beside it"
        deck="We do not silently change substantive claims. When we confirm an error we correct it within 48 hours, the note carries a dated notice, and the change is recorded here with the wording it replaced."
        meta={[
          `${pad(ledger.length, 2)} corrections`,
          `${pad(stats.notes, 2)} notes published`,
          'Corrected within 48 hours of confirmation',
        ]}
      />

      <div className={styles.body}>
        {ledger.length === 0 ? (
          <>
            <div className={corrections.empty} data-reveal>
              <p className={corrections.emptyMark}>Ledger status</p>
              <p className={corrections.emptyTitle}>No corrections have been issued.</p>
              <p className={corrections.emptyBody}>
                {stats.notes === 1
                  ? 'One note has been published and no error in it has been confirmed.'
                  : `${stats.notes} notes have been published and no error in them has been confirmed.`}{' '}
                That is a statement about a short record, not a claim about our accuracy. The ledger
                below is live: the first correction we confirm will appear here, and on the note it
                belongs to, on the day we make it.
              </p>
              <div className={corrections.emptyActions}>
                <a
                  className={styles.action}
                  data-signal="true"
                  href={`mailto:${site.email.corrections}`}
                >
                  Report an error <span aria-hidden="true">→</span>
                </a>
                <Link className={styles.action} href="/standards/#corrections">
                  The corrections policy
                </Link>
              </div>
            </div>

            <section className={corrections.anatomy} data-reveal>
              <p className={corrections.anatomyHead}>What a correction will record</p>
              <div className={corrections.anatomyGrid}>
                {[
                  { label: 'Note', body: 'Which note was corrected, linked, with its index number.' },
                  { label: 'Published', body: 'The sentence exactly as it was published.' },
                  { label: 'Corrected', body: 'The sentence exactly as it reads now.' },
                  { label: 'Reason', body: 'What was wrong, in plain words.' },
                  { label: 'Source', body: 'How the error came to light, including who raised it.' },
                  { label: 'Date', body: 'When the correction was made, not when the error was made.' },
                ].map((field) => (
                  <div key={field.label} className={corrections.anatomyCell}>
                    <span className={corrections.anatomyLabel}>{field.label}</span>
                    <span className={corrections.anatomyBody}>{field.body}</span>
                  </div>
                ))}
              </div>
              <p className={corrections.anatomyFoot}>
                Severity is recorded too:{' '}
                {Object.entries(correctionSeverity).map(([key, meta], index, list) => (
                  <span key={key}>
                    <strong>{meta.label.toLowerCase()}</strong>
                    {index < list.length - 1 ? ', ' : '. '}
                  </span>
                ))}
                Typographical fixes and broken links are repaired without a note.
              </p>
            </section>
          </>
        ) : (
          <ol className={corrections.list}>
            {ledger.map((entry) => (
              <li key={entry.id} id={entry.id}>
                <article className={corrections.item} data-reveal>
                  <header className={corrections.itemHead}>
                    <span className={corrections.itemId}>{entry.id}</span>
                    <time className={corrections.itemDate} dateTime={isoDate(entry.date)}>
                      {formatDate(entry.date)}
                    </time>
                    <span className={corrections.itemSeverity} data-severity={entry.severity}>
                      {correctionSeverity[entry.severity].label}
                    </span>
                  </header>

                  <h2 className={corrections.itemTitle}>
                    <Link href={`/articles/${entry.articleSlug}/`}>{entry.articleTitle}</Link>
                  </h2>

                  <div className={corrections.diff}>
                    <div className={corrections.diffSide} data-side="published">
                      <span className={corrections.diffLabel}>As published</span>
                      <p className={corrections.diffText}>{entry.published}</p>
                    </div>
                    <div className={corrections.diffSide} data-side="corrected">
                      <span className={corrections.diffLabel}>As corrected</span>
                      <p className={corrections.diffText}>{entry.corrected}</p>
                    </div>
                  </div>

                  <dl className={corrections.itemMeta}>
                    <div>
                      <dt>Reason</dt>
                      <dd>{entry.reason}</dd>
                    </div>
                    <div>
                      <dt>How it came to light</dt>
                      <dd>{entry.source}</dd>
                    </div>
                  </dl>
                </article>
              </li>
            ))}
          </ol>
        )}

        <section className={corrections.notes} data-reveal>
          <p className={corrections.notesHead}>Correction status of every published note</p>
          <ul className={corrections.notesList}>
            {notes.map((note) => (
              <li key={note.slug} className={corrections.notesItem}>
                <span className={corrections.notesIndex}>{pad(note.index)}</span>
                <Link href={`/articles/${note.slug}/`} className={corrections.notesTitle}>
                  {note.title}
                </Link>
                <span
                  className={corrections.notesStatus}
                  data-clean={(note.corrections?.length ?? 0) === 0}
                >
                  {(note.corrections?.length ?? 0) === 0
                    ? 'No corrections'
                    : `${note.corrections!.length} correction${note.corrections!.length === 1 ? '' : 's'}`}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className={styles.footer}>
          <div className={styles.callout}>
            <p className={styles.calloutLabel}>Found an error?</p>
            <div className={styles.calloutBody}>
              Write to <a href={`mailto:${site.email.corrections}`}>{site.email.corrections}</a>{' '}
              with the note, the specific sentence, what you think is wrong, and the source you
              think we should have used. We keep a table behind every note listing each claim, its
              source and the exact passage supporting it — we will go to that row. If we disagree,
              we will tell you why, and we log the challenge either way.
            </div>
          </div>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Corrections', path: '/corrections/' },
        ])}
      />
    </div>
  );
}
