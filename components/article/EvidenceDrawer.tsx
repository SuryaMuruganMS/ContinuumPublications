'use client';

import { useRef } from 'react';

import { assessmentMeta, evidenceMeta } from '@/content/evidence-states';
import { formatDate } from '@/lib/format';
import { useCopy, useFocusTrap } from '@/hooks/useMotion';
import { useEvidence } from '@/components/article/EvidenceProvider';
import styles from './Evidence.module.css';

/**
 * The citation drawer.
 *
 * Every field a reader needs to go and check the claim themselves: who
 * published it, which document, where inside that document, what it
 * establishes, and which evidence state it carries. Arrow keys walk the whole
 * chain of evidence without closing it.
 */
export function EvidenceDrawer() {
  const evidence = useEvidence();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [copied, copy] = useCopy();

  const open = evidence?.open ?? null;
  useFocusTrap(panelRef, Boolean(open), () => evidence?.close());

  if (!evidence || !open) return null;

  const meta = evidenceMeta(open.kind);
  const media = open.media;

  return (
    <>
      <div className={styles.drawerScrim} onMouseDown={evidence.close} aria-hidden="true" />

      <div
        ref={panelRef}
        className={`${styles.kind} ${styles.drawer}`}
        data-kind={open.kind}
        role="dialog"
        aria-modal="false"
        aria-label={`Evidence ${open.id}: ${meta.label}`}
      >
        <header className={styles.drawerHead}>
          <span className={styles.drawerState}>
            <span className={styles.glyph} data-kind={open.kind} aria-hidden="true" />
            {meta.label}
          </span>
          <span className={styles.drawerId}>{open.id}</span>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={evidence.close}
            aria-label="Close evidence"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M1 1l9 9M10 1l-9 9" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </header>

        <div className={styles.drawerBody}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Source</span>
            <span className={styles.fieldValue}>{open.publisher}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{media ? 'Headline' : 'Document'}</span>
            <span className={styles.fieldValue}>{open.document}</span>
          </div>

          {media && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Published</span>
              <span className={styles.fieldValue}>
                {formatDate(media.published)} ·{' '}
                {media.sourceType === 'PTI'
                  ? 'Press Trust of India copy'
                  : `Staff report, ${media.byline}`}
              </span>
            </div>
          )}

          <div className={styles.field}>
            <span className={styles.fieldLabel}>
              {media ? 'Where in the article' : 'Page / sheet / cell'}
            </span>
            <span className={`${styles.fieldValue} ${styles['fieldValue--mono']}`}>
              {open.locator}
            </span>
          </div>

          {open.quote && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Extract</span>
              <blockquote className={styles.quote}>“{open.quote}”</blockquote>
            </div>
          )}

          <div className={styles.field}>
            <span className={styles.fieldLabel}>What it establishes</span>
            <span className={styles.fieldValue}>{open.establishes}</span>
          </div>

          {open.assessment && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Our assessment</span>
              <span className={styles.assessment} data-assessment={open.assessment}>
                {assessmentMeta[open.assessment].label}
              </span>
              <span className={styles.assessmentNote}>
                {assessmentMeta[open.assessment].description}
              </span>
            </div>
          )}

          {open.working && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>
                {open.kind === 'calculated'
                  ? 'Working'
                  : open.kind === 'unresolved'
                    ? 'Where we looked'
                    : open.kind === 'reported'
                      ? 'Judged against the document'
                      : 'Note'}
              </span>
              <div className={styles.working}>{open.working}</div>
            </div>
          )}

          {media ? (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Provenance</span>
              <dl className={styles.provenance}>
                <div>
                  <dt>Status</dt>
                  <dd data-status={media.status}>{media.status === 'VERIFIED' ? 'Verified · archived' : media.status}</dd>
                </div>
                <div>
                  <dt>Retrieved</dt>
                  <dd>{formatDate(media.retrieved)}</dd>
                </div>
                <div>
                  <dt>URL</dt>
                  <dd className={styles.provenanceUrl}>{media.url}</dd>
                </div>
                {media.sha256 && (
                  <div>
                    <dt>Snapshot</dt>
                    <dd title={media.sha256}>SHA-256 {media.sha256.slice(0, 12)}…</dd>
                  </div>
                )}
                <div>
                  <dt>Internet Archive</dt>
                  <dd>
                    {media.wayback ? (
                      <a href={media.wayback} target="_blank" rel="noreferrer">
                        Snapshot<span className="u-sr"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      'Pending'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            open.retrieved && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Retrieved</span>
                <span className={`${styles.fieldValue} ${styles['fieldValue--muted']}`}>
                  {formatDate(open.retrieved)}
                </span>
              </div>
            )
          )}

          {open.url && (
            <a className={styles.sourceLink} href={open.url} target="_blank" rel="noreferrer">
              {media ? `Open the article on ${media.publication}` : 'Open the document'}
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path
                  d="M1 10 10 1M4 1h6v6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="square"
                />
              </svg>
              <span className="u-sr">(opens in a new tab)</span>
            </a>
          )}

          <p className={styles.standard}>
            <strong>{meta.label}.</strong> {meta.standard}
          </p>
        </div>

        <footer className={styles.drawerFoot}>
          <button
            type="button"
            className={styles.step}
            onClick={evidence.previous}
            aria-label="Previous evidence"
          >
            ← Prev
          </button>

          <span className={styles.position}>
            {String(evidence.position).padStart(2, '0')} / {String(evidence.total).padStart(2, '0')}
          </span>

          <button
            type="button"
            className={styles.copy}
            data-copied={copied}
            onClick={() => copy(evidence.permalink)}
            aria-label="Copy a link to this evidence"
          >
            {copied ? 'Copied' : 'Link'}
          </button>

          <button
            type="button"
            className={styles.step}
            onClick={evidence.next}
            aria-label="Next evidence"
          >
            Next →
          </button>
        </footer>
      </div>
    </>
  );
}
