'use client';

import { useState } from 'react';

import { evidenceOrder, evidenceStates } from '@/content/evidence-states';
import { headlineFigure } from '@/content/data/table-i29';
import { formatFigure } from '@/lib/format';
import { useCountUp, useInView } from '@/hooks/useMotion';
import type { EvidenceKind } from '@/types/content';
import styles from './Home.module.css';

/* =====================================================================
   Evidence signal — the readout beside the feature note
   ===================================================================== */

/**
 * The composition of a note's evidence, one bar per state. Every value is
 * counted from the note's own sources; the bars are scaled against the largest
 * count so the shape of the evidence is legible at a glance.
 */
export function EvidenceSignal({ counts }: { counts: Record<EvidenceKind, number> }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const total = evidenceOrder.reduce((sum, kind) => sum + counts[kind], 0);
  const max = Math.max(1, ...evidenceOrder.map((kind) => counts[kind]));

  return (
    <div className={styles.signal} ref={ref}>
      <div className={styles.signalHead}>
        <span className={styles.signalPulse} aria-hidden="true" />
        Evidence signal
      </div>

      <div className={styles.signalRows}>
        {evidenceOrder.map((kind, index) => (
          <div
            key={kind}
            className={styles.signalRow}
            data-in={inView}
            style={{
              ['--ev' as string]: `var(--ev-${kind})`,
              ['--reveal-delay' as string]: `${index * 110}ms`,
            }}
          >
            <span>{evidenceStates[kind].label}</span>
            <span className={styles.signalBar} aria-hidden="true">
              <span
                className={styles.signalBarFill}
                style={{ ['--w' as string]: `${(counts[kind] / max) * 100}%` }}
              />
            </span>
            <span className={styles.signalCount}>{String(counts[kind]).padStart(2, '0')}</span>
          </div>
        ))}
      </div>

      <p className={styles.signalFoot}>
        {total} claims in this note carry a source. {counts.unresolved} of them record something
        we looked for and did not find.
      </p>
    </div>
  );
}

/* =====================================================================
   The finding
   ===================================================================== */

/**
 * The two figures the note turns on, and the relationship between them drawn
 * as a line that has to travel from one to the other. The readout underneath
 * is the arithmetic that relationship permits — every value derived in
 * content/data/table-i29.ts, not typed into the markup.
 */
export function Finding() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const amount = useCountUp(headlineFigure.amount, inView, 1600);
  const count = useCountUp(headlineFigure.count, inView, 900);

  return (
    <div className={styles.finding} ref={ref}>
      <div className={styles.findingStage}>
        <div className={styles.findingSide}>
          <span className={styles.findingLabel}>Claims disallowed — number</span>
          <span className={`${styles.findingValue} u-num`}>{formatFigure(count)}</span>
          <span className={styles.findingUnit}>lakh</span>
        </div>

        <div className={styles.findingLink} aria-hidden="true">
          <svg className={styles.findingLinkSvg} viewBox="0 0 84 96" preserveAspectRatio="none">
            <path
              className={styles.findingLinkPath}
              data-in={inView}
              d="M0 48 C 28 48, 22 12, 42 12 C 62 12, 56 84, 84 84"
            />
          </svg>
          <span className={styles.findingLinkWord}>against</span>
        </div>

        <div className={styles.findingSide} data-align="end">
          <span className={styles.findingLabel}>Claims disallowed — amount</span>
          <span className={`${styles.findingValue} u-num`} data-signal="true">
            ₹{formatFigure(amount)}
          </span>
          <span className={styles.findingUnit}>crore</span>
        </div>
      </div>

      <div className={styles.findingReadout}>
        <div className={styles.findingReadoutCell}>
          <span className={styles.findingReadoutLabel}>Share by number</span>
          <span className={styles.findingReadoutValue}>({headlineFigure.countPercent})</span>
          <span className={styles.findingReadoutBody}>
            The bracket printed under the disallowed count. A note beneath the table makes every
            bracket a percentage of the total.
          </span>
        </div>

        <div className={styles.findingReadoutCell}>
          <span className={styles.findingReadoutLabel}>Share by amount</span>
          <span className={styles.findingReadoutValue}>({headlineFigure.amountPercent})</span>
          <span className={styles.findingReadoutBody}>
            The same row, the other column: 13.98 per cent of every rupee claimed that year.
          </span>
        </div>

        <div className={styles.findingReadoutCell}>
          <span className={styles.findingReadoutLabel}>The year before</span>
          <span className={styles.findingReadoutValue}>
            {headlineFigure.priorAmountDisplay}
          </span>
          <span className={styles.findingReadoutBody}>
            2023-24 prints the same 0.00 lakh against this amount — and every column reconciles
            exactly, with no residual at all.
          </span>
        </div>

        <div className={styles.findingReadoutCell}>
          <span className={styles.findingReadoutLabel}>Times defined</span>
          <span className={styles.findingReadoutValue}>None</span>
          <span className={styles.findingReadoutBody}>
            “Disallow” occurs once in the {headlineFigure.reportPages}-page English report — in the
            column header itself. No definition appears anywhere we looked.
          </span>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   The evidence system
   ===================================================================== */

/**
 * The evidence states, with the desk's running totals. Expanding a card shows
 * what the state commits us to — the standard, not a slogan.
 */
export function EvidenceSystem({ totals }: { totals: Record<EvidenceKind, number> }) {
  const [open, setOpen] = useState<EvidenceKind | null>('documented');

  return (
    <div className={styles.system}>
      {evidenceOrder.map((kind) => {
        const meta = evidenceStates[kind];
        const isOpen = open === kind;

        return (
          <button
            key={kind}
            type="button"
            className={styles.systemCard}
            data-kind={kind}
            data-open={isOpen}
            aria-expanded={isOpen}
            onClick={() => setOpen(isOpen ? null : kind)}
          >
            <span className={styles.systemGlyph} aria-hidden="true" />
            <span className={styles.systemName}>{meta.label}</span>
            <span className={styles.systemCount}>
              {String(totals[kind]).padStart(2, '0')}
              <span className="u-sr"> {meta.label} citations across the desk</span>
            </span>
            <span className={styles.systemDefinition}>{meta.definition}</span>

            <span className={styles.systemStandard}>
              <span className={styles.systemStandardInner}>{meta.standard}</span>
            </span>

            <span className={styles.systemToggle}>
              {isOpen ? '— The standard' : '+ The standard'}
            </span>
          </button>
        );
      })}

      <div className={styles.systemNote}>
        <span className={styles.systemNoteLabel}>The contract</span>
        <span className={styles.systemNoteBody}>
          Every count above is grouped from the sources attached to published notes. Nothing on
          this site is marked by hand, so a state cannot drift away from the claims it governs.
        </span>
        <span className={styles.systemNoteBody}>
          Select a state inside a note and the references carrying it light up while the rest
          recede — which is how you check, in one movement, how much of a piece rests on a document
          and how much rests on us.
        </span>
        <a className={styles.systemNoteLink} href="/standards/#evidence">
          The standards <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

/* =====================================================================
   How we work
   ===================================================================== */

const STAGES = [
  {
    name: 'Primary documents',
    body: 'Annual reports, regulatory returns, filings, circulars. We start at the document, not at the coverage of it.',
  },
  {
    name: 'Extraction',
    body: 'Figures are pulled cell by cell and recorded with the page, table or sheet they came from.',
  },
  {
    name: 'Checking',
    body: 'Every extracted figure is read back against the source, and every sum is recomputed.',
  },
  {
    name: 'Analysis',
    body: 'What the figures support is separated from what we are inferring, and each is marked.',
  },
  {
    name: 'Publication',
    body: 'A note publishes only with its evidence attached and its open questions stated.',
  },
  {
    name: 'Corrections',
    body: 'Changes are recorded with the original wording beside them. Nothing is edited away.',
  },
];

export function Pipeline() {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div className={styles.pipeline} ref={ref} data-in={inView}>
      {STAGES.map((stage, index) => (
        <div key={stage.name} className={styles.stage} style={{ ['--i' as string]: index }}>
          <span className={styles.stageIndex}>{String(index + 1).padStart(2, '0')}</span>
          <span className={styles.stageName}>{stage.name}</span>
          <span className={styles.stageBody}>{stage.body}</span>
        </div>
      ))}
    </div>
  );
}
