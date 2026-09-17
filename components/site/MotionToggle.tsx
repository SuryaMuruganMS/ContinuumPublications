'use client';

import { useEffect, useState } from 'react';
import styles from './Footer.module.css';

const KEY = 'continuum:motion';

/**
 * A reader-facing motion switch, in addition to prefers-reduced-motion.
 * Some readers want the OS default everywhere else and stillness here; the
 * preference is stored locally and applied before first paint by a small
 * inline script in app/layout.tsx.
 */
export function MotionToggle() {
  const [on, setOn] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = (() => {
      try {
        return localStorage.getItem(KEY);
      } catch {
        return null;
      }
    })();

    const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const enabled = stored ? stored !== 'off' : !systemReduced;

    setOn(enabled);
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    document.documentElement.dataset.motion = next ? 'on' : 'off';
    try {
      localStorage.setItem(KEY, next ? 'on' : 'off');
    } catch {
      /* private mode: the preference simply does not persist */
    }
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      data-on={on}
      aria-pressed={on}
      // Until we have read the preference, do not announce a state we may flip.
      aria-hidden={!ready}
    >
      <span className={styles.toggleState} aria-hidden="true" />
      Motion {on ? 'on' : 'off'}
    </button>
  );
}
