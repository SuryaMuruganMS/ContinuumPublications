import type { ReactNode } from 'react';
import styles from './Page.module.css';

/**
 * The masthead every editorial page shares. Kicker, title, deck, and a row of
 * machine-ish metadata — the same grammar as an article, so the site reads as
 * one publication rather than a research section bolted to a set of policies.
 */
export function PageHeader({
  kicker,
  title,
  deck,
  meta,
  aside,
}: {
  kicker: string;
  title: string;
  deck?: string;
  meta?: string[];
  aside?: ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerGrid}>
        <div>
          <p className={styles.kicker}>{kicker}</p>
          <h1 className={styles.title} data-reveal-mask>
            {title}
          </h1>
          {meta && meta.length > 0 && (
            <div className={styles.headerMeta}>
              {meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          )}
        </div>

        <div>
          {deck && (
            <p className={styles.deck} data-reveal>
              {deck}
            </p>
          )}
          {aside}
        </div>
      </div>
    </header>
  );
}

/** A numbered editorial section with a rule under its heading. */
export function NumberedSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section} data-reveal>
      <header className={styles.sectionHead}>
        <span className={styles.sectionIndex}>{String(index).padStart(2, '0')}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </header>
      {children}
    </section>
  );
}

/** A sticky contents rail for long policy pages. */
export function ContentsRail({
  items,
}: {
  items: { id: string; title: string }[];
}) {
  return (
    <nav className={styles.rail} aria-label="On this page">
      <p className={styles.railHead}>On this page</p>
      <ul className={styles.railList}>
        {items.map((item, index) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={styles.railLink}>
              <span className={styles.railIndex}>{String(index + 1).padStart(2, '0')}</span>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Callout({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.callout} data-reveal>
      <p className={styles.calloutLabel}>{label}</p>
      <div className={styles.calloutBody}>{children}</div>
    </div>
  );
}
