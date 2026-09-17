'use client';

import type { ReactNode } from 'react';
import styles from './Visuals.module.css';

/**
 * Every visual sits in the same document shell: an index label, a title, the
 * controls, the body, and the source at the foot. Consistency here is what
 * stops three interactive figures from reading as three unrelated widgets.
 */
export function FigureShell({
  label,
  title,
  actions,
  caption,
  source,
  children,
}: {
  label: string;
  title: string;
  actions?: ReactNode;
  caption?: string;
  source?: string;
  children: ReactNode;
}) {
  return (
    <figure className={styles.figure} data-reveal>
      <div className={styles.head}>
        <span className={styles.headLabel}>{label}</span>
        <span className={styles.headTitle}>{title}</span>
        {actions && <div className={styles.headActions}>{actions}</div>}
      </div>

      <div className={styles.body}>{children}</div>

      {(caption || source) && (
        <figcaption className={styles.caption}>
          {caption}
          {source && <span className={styles.captionSource}>Source — {source}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/** A two-or-more-option switch, used for the year and series toggles. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  const index = Math.max(0, options.findIndex((option) => option.value === value));
  const width = 100 / options.length;

  return (
    <div className={styles.segmented} role="group" aria-label={label}>
      <span
        className={styles.segmentThumb}
        style={{ width: `${width}%`, transform: `translateX(${index * 100}%)` }}
        aria-hidden="true"
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.segment}
          data-on={option.value === value}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
