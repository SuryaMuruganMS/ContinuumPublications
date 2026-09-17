'use client';

import { useId, useRef, useState } from 'react';

import { apparatus, fieldStateMeta, returns, type FieldState } from '@/content/data/returns';
import { FigureShell } from './FigureShell';
import styles from './Visuals.module.css';

/**
 * VISUAL 2 — the three health returns.
 *
 * This diagram describes the SHAPE of each return template: which cells exist
 * at each claims row. It does not say which return the published table is
 * compiled from, because the article does not establish that — and a visual
 * implying it would be making a claim the prose refuses to make.
 *
 * RET_196 is tagged "against this reading" in the interface itself. The
 * strongest fact against the article belongs in the body of it, at the same
 * weight as the facts that support it.
 *
 * Implemented as a proper tablist so arrow keys work as a keyboard user
 * expects them to.
 */
export function ReturnsStructure() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const current = returns[active];

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = returns.length - 1;
    let next = active;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    else return;

    event.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <FigureShell
      label="Figure 02"
      title="Field structure at the disallowed row"
      caption="What each return template carries, not what was filed in it. A template with no count field cannot report a count; a blank template reports nothing at all. Which return the published table is compiled from is not established."
      source="IRDAI returns annexure — health returns RET_191, RET_194, RET_196, RET_197"
    >
      <div className={styles.returns}>
        <div
          className={styles.returnList}
          role="tablist"
          aria-label="Health returns"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
        >
          {returns.map((entry, index) => (
            <button
              key={entry.id}
              ref={(node) => {
                tabsRef.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={index === active}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={index === active ? 0 : -1}
              className={styles.returnTab}
              data-stance={entry.stance}
              onClick={() => setActive(index)}
            >
              <span className={styles.returnId}>{entry.id}</span>
              <span className={styles.returnRole}>{entry.role}</span>
            </button>
          ))}
        </div>

        <div
          className={styles.returnPanel}
          role="tabpanel"
          id={`${baseId}-panel-${active}`}
          aria-labelledby={`${baseId}-tab-${active}`}
          tabIndex={0}
        >
          <div className={styles.returnMeta}>
            <span
              className={styles.returnStatus}
              data-blank={current.status === 'Unfilled template'}
            >
              {current.status}
            </span>
            <span className={styles.returnStance} data-stance={current.stance}>
              {current.stance === 'against' ? 'Against this reading' : 'Supports this reading'}
            </span>
          </div>

          <p className={styles.returnScope}>{current.scope}</p>

          <div className={styles.grid} role="table" aria-label={`${current.id} field structure`}>
            <div className={`${styles.gridCell} ${styles.gridHead}`} role="columnheader">
              Row
            </div>
            <div className={`${styles.gridCell} ${styles.gridHead}`} role="columnheader">
              Count
            </div>
            <div className={`${styles.gridCell} ${styles.gridHead}`} role="columnheader">
              Amount
            </div>

            {current.rows.map((row) => (
              <div key={row.key} role="row" style={{ display: 'contents' }}>
                <div className={styles.gridCell} data-focus={row.focus} role="rowheader">
                  <span className={styles.gridRowLabel}>{row.label}</span>
                </div>
                <div className={styles.gridCell} data-focus={row.focus} role="cell">
                  <StateMark state={row.count} />
                </div>
                <div className={styles.gridCell} data-focus={row.focus} role="cell">
                  <StateMark state={row.amount} />
                </div>
              </div>
            ))}
          </div>

          <p className={styles.observation} data-stance={current.stance}>
            <b>
              {current.id} — {current.stanceNote}
            </b>
            {current.keyObservation}
          </p>

          <p className={styles.returnLocator}>{current.locator}</p>

          <div className={styles.legend}>
            {(Object.keys(fieldStateMeta) as FieldState[]).map((state) => (
              <span key={state} className={styles.legendItem}>
                <span className={styles.state} data-state={state}>
                  <span className={styles.stateMark} aria-hidden="true" />
                </span>
                {fieldStateMeta[state].label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---- The second half of the structural argument ---- */}
      <div className={styles.apparatus}>
        <p className={styles.apparatusHead}>
          What else each outcome carries, across the health returns
        </p>

        <div className={styles.apparatusGrid} role="table" aria-label="Apparatus by outcome">
          <div className={`${styles.apparatusCell} ${styles.apparatusHeadCell}`} role="columnheader">
            &nbsp;
          </div>
          <div className={`${styles.apparatusCell} ${styles.apparatusHeadCell}`} role="columnheader">
            Repudiated
          </div>
          <div className={`${styles.apparatusCell} ${styles.apparatusHeadCell}`} role="columnheader">
            Disallowed
          </div>

          {apparatus.map((item) => (
            <div key={item.key} role="row" style={{ display: 'contents' }}>
              <div className={styles.apparatusCell} role="rowheader">
                <span className={styles.apparatusLabel}>{item.label}</span>
              </div>
              <div className={styles.apparatusCell} role="cell">
                <ApparatusMark has={item.repudiated.has} detail={item.repudiated.detail} />
              </div>
              <div className={styles.apparatusCell} role="cell">
                <ApparatusMark has={item.disallowed.has} detail={item.disallowed.detail} />
              </div>
            </div>
          ))}
        </div>

        <p className={styles.microcopy}>
          <b>This establishes that the two are treated differently.</b> It does not establish that
          disallowed is a deduction. Disallowance could still be a claim-level rejection that IRDAI
          happens not to count.
        </p>
      </div>
    </FigureShell>
  );
}

function StateMark({ state }: { state: FieldState }) {
  const meta = fieldStateMeta[state];
  return (
    <span className={styles.state} data-state={state} title={meta.description}>
      <span className={styles.stateMark} aria-hidden="true" />
      <span>{meta.label}</span>
      <span className="u-sr">{meta.description}</span>
    </span>
  );
}

function ApparatusMark({ has, detail }: { has: boolean; detail: string }) {
  return (
    <span className={styles.apparatusMark} data-has={has}>
      <span className={styles.apparatusDot} aria-hidden="true" />
      <span className={styles.apparatusDetail}>{detail}</span>
      <span className="u-sr">{has ? 'Yes.' : 'No.'}</span>
    </span>
  );
}
