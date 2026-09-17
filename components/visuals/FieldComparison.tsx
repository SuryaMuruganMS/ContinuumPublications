import { FigureShell } from './FigureShell';
import styles from './Visuals.module.css';

/**
 * VISUAL 04 — the two rows, side by side.
 *
 * Deliberately not a dashboard. It is a reading aid for one question: what
 * apparatus each of the two fields carries in the documents examined. Every
 * cell is a fact from a located source; where the documents are silent the
 * cell says so rather than inferring the absence means something.
 *
 * The three states are distinguished by glyph and label as well as colour, so
 * the comparison survives a monochrome print or a colour-blind reader.
 */

type State = 'present' | 'absent' | 'open';

interface Row {
  dimension: string;
  disallowed: { state: State; value: string };
  repudiated: { state: State; value: string };
}

const ROWS: Row[] = [
  {
    dimension: 'Printed in Table I.29, 2024-25',
    disallowed: { state: 'present', value: '0.00 lakh · ₹18,521.02 crore' },
    repudiated: { state: 'present', value: '29.51 lakh · ₹11,412.42 crore' },
  },
  {
    dimension: 'Printed in Table I.29, 2023-24',
    disallowed: { state: 'present', value: '0.00 lakh · ₹15,100.42 crore' },
    repudiated: { state: 'present', value: '36.40 lakh · ₹10,937.18 crore' },
  },
  {
    dimension: 'Field in RET_194 and RET_197',
    disallowed: { state: 'absent', value: 'Amount, with no paired count column' },
    repudiated: { state: 'present', value: 'Count column and amount column' },
  },
  {
    dimension: 'Cells in RET_196',
    disallowed: { state: 'open', value: 'Count cells exist; template unfilled' },
    repudiated: { state: 'present', value: 'Count cells and amount cells' },
  },
  {
    dimension: 'Definition in the documents examined',
    disallowed: { state: 'open', value: 'None located' },
    repudiated: { state: 'present', value: '“Rejected in full” — RET_194 note' },
  },
  {
    dimension: 'Ageing schedule',
    disallowed: { state: 'absent', value: 'None' },
    repudiated: { state: 'present', value: 'Required, by bucket' },
  },
  {
    dimension: 'Ratio defined in the returns',
    disallowed: { state: 'absent', value: 'None' },
    repudiated: { state: 'present', value: 'Repudiation ratio — RET_191' },
  },
];

const STATE_LABEL: Record<State, string> = {
  present: 'Specified',
  absent: 'Not carried',
  open: 'Unresolved',
};

function Cell({ state, value }: { state: State; value: string }) {
  return (
    <div className={styles.compareCell} data-state={state}>
      <span className={styles.compareMark} aria-hidden="true" />
      <span className={styles.compareValue}>{value}</span>
      <span className="u-sr">{STATE_LABEL[state]}</span>
    </div>
  );
}

export function FieldComparison() {
  return (
    <FigureShell
      label="Figure 04"
      title="What each row carries"
      caption="Each cell is a located fact. “Unresolved” marks a place where the documents examined do not settle the question — it is not shorthand for absence, and it is not evidence of what the field means."
      source="IRDAI Annual Reports 2023–24 and 2024–25, Table I.29, printed page 43; returns annexure RET_191, RET_194, RET_196, RET_197"
    >
      <div className={styles.compare}>
        <div
          className={styles.tableWrap}
          tabIndex={0}
          role="region"
          aria-label="Disallowed against repudiated, by reporting apparatus. Scrollable."
        >
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th scope="col">
                  <span className="u-sr">Reporting apparatus</span>
                </th>
                <th scope="col" data-term="disallowed">
                  Disallowed
                </th>
                <th scope="col" data-term="repudiated">
                  Repudiated
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.dimension}>
                  <th scope="row">{row.dimension}</th>
                  <td>
                    <Cell {...row.disallowed} />
                  </td>
                  <td>
                    <Cell {...row.repudiated} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className={styles.compareLegend}>
          {(['present', 'absent', 'open'] as State[]).map((state) => (
            <li key={state} className={styles.compareLegendItem} data-state={state}>
              <span className={styles.compareMark} aria-hidden="true" />
              {STATE_LABEL[state]}
            </li>
          ))}
        </ul>
      </div>
    </FigureShell>
  );
}
