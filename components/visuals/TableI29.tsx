'use client';

import { useState } from 'react';

import { tableI29, type TableCell, type TableRow } from '@/content/data/table-i29';
import { formatFigure } from '@/lib/format';
import { useCountUp, useInView } from '@/hooks/useMotion';
import { FigureShell, Segmented } from './FigureShell';
import styles from './Visuals.module.css';

type View = 'printed' | 'reconciled';

/**
 * VISUAL 1 — Table I.29, both editions examined.
 *
 * Two views, because the article makes two different points about this table.
 *
 *  · As printed — the row as IRDAI prints it, with the brackets. Switching
 *    years re-runs the count, so the reader watches the amount move while the
 *    count stays where it is.
 *
 *  · Reconciled — our arithmetic, shown as arithmetic and labelled as ours.
 *    This is the half of the argument that is easy to assert and hard to see:
 *    the number column reaches its printed total with zero in the disallowed
 *    cell, exactly and with no residual in 2023-24.
 *
 * The markup is a real <table> with real headers and scopes. The hero pair
 * above it is aria-hidden, because it repeats the table's own focus row — a
 * screen reader should hear those figures once, inside a structure it can
 * navigate, not twice.
 */
export function TableI29() {
  const [yearIndex, setYearIndex] = useState(1);
  const [view, setView] = useState<View>('printed');
  const [ref, inView] = useInView<HTMLDivElement>();

  const year = tableI29[yearIndex];
  const focus = year.rows.find((row) => row.focus)!;

  const amount = useCountUp(focus.amount.value ?? 0, inView, 1400);
  const count = useCountUp(focus.number.value ?? 0, inView, 900);

  return (
    <FigureShell
      label="Figure 01"
      title="Table I.29 — status of health claims"
      caption={
        view === 'printed'
          ? 'The table is a flow statement: opening claims plus new claims registered give the total, and the four disposal rows account for it. The number and amount columns each do this on their own.'
          : 'Our arithmetic on IRDAI’s printed values, not a figure IRDAI publishes. The number column reaches its printed total with 0.00 in the disallowed cell; the amount column reaches its total only with the disallowed figure included.'
      }
      source={year.sourceLocator}
      actions={
        <>
          <Segmented
            label="View"
            value={view}
            onChange={setView}
            options={[
              { value: 'printed', label: 'As printed' },
              { value: 'reconciled', label: 'Reconciled' },
            ]}
          />
          <Segmented
            label="Edition"
            value={String(yearIndex)}
            onChange={(value) => setYearIndex(Number(value))}
            options={tableI29.map((entry, index) => ({
              value: String(index),
              label: entry.label,
            }))}
          />
        </>
      }
    >
      <div ref={ref}>
        {/* ---- Hero pair ---- */}
        <div className={styles.hero} aria-hidden="true">
          <div className={styles.heroCell}>
            <span className={styles.heroLabel}>Disallowed — number</span>
            <span className={`${styles.heroValue} u-num`}>{formatFigure(count)}</span>
            <span className={styles.heroUnit}>
              lakh · bracket ({focus.number.percent})
            </span>
          </div>

          <div className={styles.connector}>
            <span className={styles.connectorLine} />
            <span className={styles.connectorWord}>against</span>
          </div>

          <div className={styles.heroCell}>
            <span className={styles.heroLabel}>Disallowed — amount</span>
            <span className={`${styles.heroValue} ${styles['heroValue--signal']} u-num`}>
              ₹{formatFigure(amount)}
            </span>
            <span className={styles.heroUnit}>
              crore · bracket ({focus.amount.percent})
            </span>
          </div>
        </div>

        {/* ---- The table ---- */}
        <div
          className={styles.tableWrap}
          tabIndex={0}
          role="region"
          aria-label={`Table I.29, ${year.label}. Scrollable.`}
        >
          <table className={styles.table}>
            <caption>
              Table I.29 · {year.label} · as printed. Figures in brackets are percentage to total.
            </caption>
            <thead>
              <tr>
                <th scope="col">Particulars</th>
                <th scope="col">
                  Number<span>lakh</span>
                </th>
                <th scope="col">
                  %<span>of total</span>
                </th>
                <th scope="col">
                  Amount<span>₹ crore</span>
                </th>
                <th scope="col">
                  %<span>of total</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {year.rows.map((row) => (
                <Row
                  key={row.key}
                  row={row}
                  liveNumber={row.focus ? count : undefined}
                  liveAmount={row.focus ? amount : undefined}
                />
              ))}
            </tbody>
          </table>
        </div>

        {view === 'reconciled' && (
          <div className={styles.recon}>
            <p className={styles.reconLabel}>
              <span className={styles.reconTag}>Calculated</span>
              Our sums, from IRDAI’s printed values
            </p>

            <dl className={styles.reconList}>
              <ReconRow
                label="Number — opening plus registered"
                working={year.reconciliation.numberInflow}
                residual={0}
              />
              <ReconRow
                label="Number — the four disposal rows"
                working={year.reconciliation.numberDisposal}
                residual={year.reconciliation.numberResidual}
              />
              <ReconRow
                label="Amount — opening plus registered"
                working={year.reconciliation.amountInflow}
                residual={year.reconciliation.amountResidual}
              />
              <ReconRow
                label="Amount — the four disposal rows"
                working={year.reconciliation.amountDisposal}
                residual={year.reconciliation.amountResidual}
              />
            </dl>

            <p className={styles.microcopy}>
              {year.reconciliation.numberResidual === 0 &&
              year.reconciliation.amountResidual === 0 ? (
                <>
                  <b>Every reconciliation in this year is exact.</b> The number column balances to
                  its printed total with `0.00` in the disallowed cell and no rounding slack at
                  all, which leaves no room in the arithmetic for a suppressed count.
                </>
              ) : (
                <>
                  <b>Both columns close to within a hundredth.</b> The `0.01` gaps are rounding.
                  The number column reaches its printed total with `0.00` in the disallowed cell
                  and needs nothing more at that precision; the amount column reaches its total
                  only with the disallowed figure included.
                </>
              )}
            </p>
          </div>
        )}

        {view === 'printed' && (
          <p className={styles.microcopy}>
            <b>Read the two columns separately.</b> The number column is in lakh and the amount
            column in crore, and the table treats them as independent quantities. Claim numbers are
            printed to two decimal places, so `0.00` is what the table prints at that precision —
            not, on its own, a statement that the underlying count was exactly zero.
          </p>
        )}
      </div>
    </FigureShell>
  );
}

function Row({
  row,
  liveNumber,
  liveAmount,
}: {
  row: TableRow;
  liveNumber?: number;
  liveAmount?: number;
}) {
  return (
    <tr
      className={row.focus ? styles.rowFocus : undefined}
      data-role={row.role}
    >
      <th scope="row">{row.label}</th>
      <Cell cell={row.number} live={liveNumber} />
      <PercentCell cell={row.number} />
      <Cell cell={row.amount} live={liveAmount} prefix="₹" />
      <PercentCell cell={row.amount} />
    </tr>
  );
}

function Cell({
  cell,
  live,
  prefix = '',
}: {
  cell: TableCell;
  live?: number;
  prefix?: string;
}) {
  if (cell.value === null) {
    return (
      <td className={styles.cellEmpty}>
        <span aria-hidden="true">—</span>
        <span className="u-sr">Not reproduced in this note</span>
      </td>
    );
  }

  const value = live ?? cell.value;

  return (
    <td>
      <span className={`${styles.cellValue} u-num`} title={cell.note}>
        {prefix}
        {formatFigure(value)}
      </span>
    </td>
  );
}

function PercentCell({ cell }: { cell: TableCell }) {
  if (cell.percent === null) {
    return (
      <td className={styles.cellEmpty}>
        <span aria-hidden="true">—</span>
        <span className="u-sr">No percentage printed on this row</span>
      </td>
    );
  }

  return (
    <td>
      <span className={`${styles.cellPercent} u-num`}>({cell.percent})</span>
    </td>
  );
}

function ReconRow({
  label,
  working,
  residual,
}: {
  label: string;
  working: string;
  residual: number;
}) {
  return (
    <div className={styles.reconRow}>
      <dt className={styles.reconRowLabel}>{label}</dt>
      <dd className={styles.reconRowWorking}>
        <span className="u-num">{working}</span>
        <span
          className={styles.reconResidual}
          data-exact={residual === 0}
        >
          {residual === 0
            ? 'exact'
            : `${residual > 0 ? '+' : '−'}${Math.abs(residual).toFixed(2)} vs printed`}
        </span>
      </dd>
    </div>
  );
}
