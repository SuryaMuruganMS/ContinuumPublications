'use client';

import { evidenceMeta } from '@/content/evidence-states';
import { useEvidence } from '@/components/article/EvidenceProvider';
import type { Source } from '@/types/content';
import styles from './Evidence.module.css';

/**
 * An inline evidence reference.
 *
 * It is a real button with a real accessible name — "Evidence S4, documented:
 * IRDAI Annual Report 2024-25, Table I.29" — so a screen-reader user learns
 * what kind of claim they are standing next to before deciding to open it.
 *
 * Outside an article (cards, previews) there is no provider, and this renders
 * as a static marker instead of a control that would go nowhere.
 */
export function CitationRef({ source }: { source: Source }) {
  const evidence = useEvidence();
  const meta = evidenceMeta(source.kind);

  const label = `Evidence ${source.id}, ${meta.label.toLowerCase()}: ${source.publisher}, ${source.document}, ${source.locator}`;

  if (!evidence) {
    return (
      <span
        className={`${styles.kind} ${styles.ref} ${styles.refStatic}`}
        data-kind={source.kind}
        aria-hidden="true"
      >
        <span className={styles.glyph} data-kind={source.kind} />
        {source.id}
      </span>
    );
  }

  const isOpen = evidence.open?.id === source.id;
  const filtering = evidence.filter !== null;
  const matches = evidence.filter === source.kind;

  return (
    <button
      type="button"
      className={`${styles.kind} ${styles.ref}`}
      data-kind={source.kind}
      data-citation={source.id}
      data-open={isOpen}
      data-dim={filtering && !matches}
      data-lit={filtering && matches}
      aria-expanded={isOpen}
      aria-label={label}
      onClick={() => (isOpen ? evidence.close() : evidence.openSource(source.id))}
    >
      <span className={styles.glyph} data-kind={source.kind} aria-hidden="true" />
      {source.id}
    </button>
  );
}
