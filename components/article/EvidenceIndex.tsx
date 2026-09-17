'use client';

import { evidenceOrder, evidenceStates } from '@/content/evidence-states';
import { useEvidence } from '@/components/article/EvidenceProvider';
import styles from './Evidence.module.css';

/**
 * THE EVIDENCE INDEX.
 *
 * Continuum's signature instrument. It sits in the article rail and reports
 * the composition of the note's evidence — how much of it is documented, how
 * much is our arithmetic, how much is our reading, and how much we could not
 * close.
 *
 * Every number here is counted from the article's own `sources` array. None of
 * it is decoration, and none of it can drift away from the article: add a
 * source and the count moves.
 *
 * Selecting a state isolates it — matching references in the body light up,
 * the rest recede — so a sceptical reader can see at a glance exactly which
 * sentences rest on a document and which rest on us.
 */
export function EvidenceIndex({ compact = false }: { compact?: boolean }) {
  const evidence = useEvidence();
  if (!evidence) return null;

  const counts = evidenceOrder.map((kind) => ({
    kind,
    meta: evidenceStates[kind],
    count: evidence.sources.filter((source) => source.kind === kind).length,
  }));

  const total = evidence.sources.length;

  return (
    <div className={styles.index}>
      <div className={styles.indexHead}>
        <span className={styles.indexTitle}>Evidence index</span>
        <span className={styles.indexTotal}>{String(total).padStart(2, '0')}</span>
      </div>

      {counts.map(({ kind, meta, count }) => {
        const on = evidence.filter === kind;
        return (
          <button
            key={kind}
            type="button"
            className={`${styles.kind} ${styles.row}`}
            data-kind={kind}
            data-on={on}
            aria-pressed={on}
            disabled={count === 0}
            onClick={() => evidence.setFilter(on ? null : kind)}
            title={meta.definition}
          >
            <span className={styles.glyph} data-kind={kind} aria-hidden="true" />
            <span className={styles.rowLabel}>{meta.label}</span>
            <span className={styles.rowCount}>
              {String(count).padStart(2, '0')}
              <span className="u-sr">
                {' '}
                {meta.label} {count === 1 ? 'reference' : 'references'}.{' '}
                {on ? 'Isolated. Select again to clear.' : 'Select to isolate.'}
              </span>
            </span>
          </button>
        );
      })}

      {!compact && (
        <p className={styles.indexFoot} role="status" aria-live="polite">
          {evidence.filter ? (
            <>
              Isolating {evidenceStates[evidence.filter].label.toLowerCase()} references.{' '}
              <button
                type="button"
                className={styles.indexReset}
                onClick={() => evidence.setFilter(null)}
              >
                Show all
              </button>
            </>
          ) : (
            <>Select a state to isolate it in the text.</>
          )}
        </p>
      )}
    </div>
  );
}
