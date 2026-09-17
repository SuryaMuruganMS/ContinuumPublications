'use client';

import {
  narrativeMismatch,
  residual,
  settlementModes,
  settlementModesMeta,
  settlementTotals,
  spread,
  type ModeShare,
} from '@/content/data/settlement-modes';
import { formatFigure } from '@/lib/format';
import { useCountUp, useInView } from '@/hooks/useMotion';
import { FigureShell } from './FigureShell';
import styles from './Visuals.module.css';

/**
 * VISUAL 3 — number against amount.
 *
 * Two bars per mode on the same scale, so the gap between "share of claims"
 * and "share of rupees" is what the eye lands on. The series are distinguished
 * by fill pattern as well as position, so the comparison survives a
 * monochrome print or a colour-blind reader.
 *
 * The point of the figure is the panel underneath it: the report's own
 * narrative paragraph pairs one share of each kind and calls both numbers,
 * which is why they total more than a hundred.
 */
export function NumberVsAmount() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const gap = residual();

  return (
    <FigureShell
      label="Figure 03"
      title="Share of claims against share of rupees"
      caption="The same book of business, measured twice. A mode can be large by count and smaller by value, or the reverse — which is why a table reporting both must be read column by column."
      source={settlementModesMeta.sourceLocator}
    >
      <div ref={ref} className={styles.modes}>
        {settlementModes.map((mode) => (
          <Mode key={mode.key} mode={mode} active={inView} />
        ))}

        <p className={styles.residual}>
          <span className={styles.residualTag}>Calculated</span>
          <span>
            {settlementModesMeta.residualLabel}:{' '}
            <span className={styles.residualValue}>{gap.byNumber.toFixed(2)}%</span> by number,{' '}
            <span className={styles.residualValue}>{gap.byAmount.toFixed(2)}%</span> by amount.
            Derived by subtraction against totals of {settlementTotals.claims} lakh claims and ₹
            {formatFigure(settlementTotals.amount)} crore.
          </span>
        </p>
      </div>

      {/* ---- The sentence on the same page ---- */}
      <div className={styles.mismatch}>
        <p className={styles.mismatchHead}>
          <span className={styles.mismatchTag}>The paragraph on the same page</span>
          {narrativeMismatch.locator}
        </p>

        <div className={styles.mismatchRows}>
          {narrativeMismatch.claimed.map((entry) => (
            <div key={entry.label} className={styles.mismatchRow}>
              <span className={styles.mismatchLabel}>{entry.label}</span>
              <span className={styles.mismatchStated}>
                <span className="u-num">{entry.stated}%</span>
                <span className={styles.mismatchBasis}>stated as a number share</span>
              </span>
              <span
                className={styles.mismatchActual}
                data-mismatch={entry.actualBasis === 'amount'}
              >
                <span className="u-num">{entry.numberBasis}%</span>
                <span className={styles.mismatchBasis}>
                  {entry.actualBasis === 'amount'
                    ? 'the actual number share — the stated figure is the amount share'
                    : 'the actual number share — matches'}
                </span>
              </span>
            </div>
          ))}

          <div className={styles.mismatchTotal}>
            <span className={styles.mismatchLabel}>As stated, they total</span>
            <span className={`${styles.mismatchTotalValue} u-num`}>
              {narrativeMismatch.statedTotal}%
            </span>
          </div>
        </div>

        <p className={styles.mismatchBody}>{narrativeMismatch.reading}</p>
        <p className={styles.mismatchFollowing}>{narrativeMismatch.followingYear}</p>
      </div>
    </FigureShell>
  );
}

function Mode({ mode, active }: { mode: ModeShare; active: boolean }) {
  const byNumber = useCountUp(mode.byNumber, active, 1000);
  const byAmount = useCountUp(mode.byAmount, active, 1200);
  const delta = spread(mode);

  return (
    <div className={styles.mode}>
      <div className={styles.modeHead}>
        <h3 className={styles.modeName}>{mode.label}</h3>
        <span className={styles.modeCounts}>
          {mode.claims} lakh claims · ₹{formatFigure(mode.amount)} crore
        </span>
        <span className={styles.spread} data-sign={delta > 0 ? 'up' : 'down'}>
          {delta > 0 ? '+' : '−'}
          {Math.abs(delta).toFixed(2)} pts by amount
        </span>
      </div>

      <div className={styles.bars}>
        <Bar
          label="By number"
          series="number"
          value={active ? byNumber : 0}
          display={mode.byNumber}
          printed={mode.printed}
        />
        <Bar
          label="By amount"
          series="amount"
          value={active ? byAmount : 0}
          display={mode.byAmount}
          printed={mode.printed}
        />
      </div>

      <p className={styles.modeReading}>{mode.reading}</p>
    </div>
  );
}

function Bar({
  label,
  series,
  value,
  display,
  printed,
}: {
  label: string;
  series: 'number' | 'amount';
  value: number;
  display: number;
  printed: boolean;
}) {
  return (
    <div className={styles.bar}>
      <span className={styles.barLabel}>{label}</span>
      <div
        className={styles.barTrack}
        role="meter"
        aria-valuenow={display}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${display.toFixed(2)} per cent`}
      >
        <span
          className={styles.barFill}
          data-series={series}
          style={{ ['--w' as string]: `${value}%` }}
          aria-hidden="true"
        />
      </div>
      <span className={`${styles.barValue} u-num`} aria-hidden="true">
        {value.toFixed(2)}%
        <span className={styles.barPrinted} title={printed ? 'Printed in the table as a bracket' : 'Our division'}>
          {printed ? 'printed' : 'ours'}
        </span>
      </span>
    </div>
  );
}
