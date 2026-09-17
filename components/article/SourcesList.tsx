'use client';

import { evidenceMeta } from '@/content/evidence-states';
import { formatDate } from '@/lib/format';
import { useEvidence } from '@/components/article/EvidenceProvider';
import evidenceStyles from './Evidence.module.css';
import styles from './Article.module.css';

/**
 * The full chain of evidence, printed at the foot of the piece.
 *
 * Rows open the same drawer the inline markers do, so a reader who scrolls
 * straight to the sources can walk the whole chain from here without hunting
 * for the sentence each one belongs to.
 */
export function SourcesList() {
  const evidence = useEvidence();
  if (!evidence) return null;

  return (
    <div className={styles.sourcesList}>
      {evidence.sources.map((source) => {
        const meta = evidenceMeta(source.kind);
        return (
          <button
            key={source.id}
            type="button"
            className={`${evidenceStyles.kind} ${styles.sourceRow}`}
            data-kind={source.kind}
            onClick={() => evidence.openSource(source.id)}
            aria-label={`Open evidence ${source.id}, ${meta.label}`}
          >
            <span className={styles.sourceId}>
              <span
                className={evidenceStyles.glyph}
                data-kind={source.kind}
                aria-hidden="true"
              />
              {source.id}
            </span>

            <span className={styles.sourceMain}>
              <span className={styles.sourceDoc}>
                {source.publisher} — {source.document}
                {source.media && `, ${formatDate(source.media.published)}`}
              </span>
              <span className={styles.sourceLocator}>{source.locator}</span>
              <span className={styles.sourceEstablishes}>{source.establishes}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
