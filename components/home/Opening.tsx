'use client';

import { useEffect, useRef } from 'react';

import type { deskStats } from '@/content/articles';
import { useReducedMotion } from '@/hooks/useMotion';
import styles from './Home.module.css';

const STATEMENTS = [
  { text: 'Primary documents.', signal: false },
  { text: 'Public data.', signal: false },
  { text: 'What the evidence supports.', signal: false },
  { text: 'What it does not.', signal: true },
];

/**
 * The opening frame.
 *
 * A masthead, not a hero: the desk identifies itself, states the contract in
 * four lines, and shows what it actually holds. The last line — the one about
 * what the evidence does not support — is the one that carries the signal
 * colour, because it is the one the rest of the site is organised around.
 */
export function Opening({
  stats,
}: {
  stats: ReturnType<typeof deskStats>;
}) {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  /* The coordinate field follows the pointer. Written straight to CSS custom
     properties on a rAF — no React state, no re-render, no cost when idle. */
  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const field = fieldRef.current;
    if (!field) return;

    let frame = 0;
    let x = 50;
    let y = 40;

    const apply = () => {
      frame = 0;
      field.style.setProperty('--mx', `${x}%`);
      field.style.setProperty('--my', `${y}%`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = field.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width) * 100;
      y = ((event.clientY - rect.top) / rect.height) * 100;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section className={styles.opening} aria-labelledby="opening-title">
      <div ref={fieldRef} className={styles.openingField} aria-hidden="true" />

      <div className={`u-shell ${styles.openingShell}`}>
        <div className={styles.openingRule}>
          <span>Independent research desk</span>
          <span className={styles.openingRuleSignal}>
            Index {String(stats.notes).padStart(4, '0')}
          </span>
        </div>

        <div className={styles.openingMain}>
          <h1 id="opening-title" className={styles.wordmark}>
            <span className={styles.wordmarkLine}>
              <span style={{ ['--i' as string]: 0 }}>Continuum</span>
            </span>
            <span className={`${styles.wordmarkLine} ${styles.wordmarkSecond}`}>
              <span style={{ ['--i' as string]: 1 }}>Publications</span>
            </span>
          </h1>

          <div className={styles.statements}>
            {STATEMENTS.map((statement, index) => (
              <p
                key={statement.text}
                className={styles.statement}
                data-signal={statement.signal}
                style={{ ['--i' as string]: index }}
              >
                <span className={styles.statementMark} aria-hidden="true" />
                {statement.text}
              </p>
            ))}
          </div>
        </div>

        <div className={styles.openingFoot}>
          <div className={styles.stats}>
            <Stat value={stats.notes} label="Notes published" pad={2} />
            <Stat value={stats.documents} label="Documents read" pad={2} />
            <Stat value={stats.citations} label="Citations" pad={2} />
            <Stat value={stats.openQuestions} label="Open questions" pad={2} signal />
          </div>

          <a className={styles.scrollCue} href="#current">
            <span className={styles.scrollCueLine} aria-hidden="true" />
            Current investigation
          </a>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  pad,
  signal = false,
}: {
  value: number;
  label: string;
  pad: number;
  signal?: boolean;
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue} data-signal={signal}>
        {String(value).padStart(pad, '0')}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
