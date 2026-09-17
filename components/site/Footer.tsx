import Link from 'next/link';

import { footerNav, site } from '@/content/site';
import { deskStats } from '@/content/articles';
import { MotionToggle } from '@/components/site/MotionToggle';
import styles from './Footer.module.css';

export function Footer() {
  const stats = deskStats();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root} data-print="hide">
      <div className="u-shell">
        <div className={styles.top}>
          <div className={styles.identity}>
            <Link href="/" className={styles.wordmark} aria-label={`${site.name} — home`}>
              CONTINUUM
              <span className={styles.wordmarkDot} aria-hidden="true" />
            </Link>

            <div className={styles.identityLines}>
              <span className={styles.identityLine}>
                <b>{site.tagline}</b>
              </span>
              <span className={styles.identityLine}>{site.descriptor}</span>
            </div>

            <p className={styles.positioning}>{site.positioning}</p>
          </div>

          <nav className={styles.columns} aria-label="Footer">
            {footerNav.map((group) => (
              <div key={group.heading}>
                <h2 className={styles.heading}>{group.heading}</h2>
                <ul className={styles.list}>
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={styles.link}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <div className={styles.meta}>
            <span>© {year} {site.name}</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>
              {String(stats.notes).padStart(2, '0')} note{stats.notes === 1 ? '' : 's'}
            </span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>
              {String(stats.citations).padStart(2, '0')} citations
            </span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>
              {String(stats.corrections).padStart(2, '0')} corrections
            </span>
          </div>

          <MotionToggle />
        </div>
      </div>
    </footer>
  );
}
