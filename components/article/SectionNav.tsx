'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useScrollSpy } from '@/hooks/useMotion';
import type { ArticleSection } from '@/types/content';
import styles from './Article.module.css';

/**
 * The section navigator.
 *
 * Doubles as the reading progress indicator: the orange fill on the spine is
 * the article's progress, so there is one instrument reporting position
 * instead of a navigator and a separate bar competing for the same job.
 *
 * Progress is written straight to a CSS custom property on the DOM node —
 * re-rendering a list of links on every scroll frame would be wasteful for
 * something the reader perceives as a continuous line.
 */
export function SectionNav({ sections }: { sections: ArticleSection[] }) {
  const ids = useMemo(() => sections.map((section) => section.id), [sections]);
  const active = useScrollSpy(ids);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const first = document.getElementById(ids[0]);
      const body = document.getElementById('article-body');
      if (!first || !body) return;

      const start = first.getBoundingClientRect().top + window.scrollY;
      const end = body.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.5;
      const span = Math.max(1, end - start);
      const ratio = Math.min(1, Math.max(0, (window.scrollY - start) / span));

      fillRef.current?.style.setProperty('--read', `${(ratio * 100).toFixed(2)}%`);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  /* On narrow screens the navigator is a horizontal strip; keep the active
     item in view as the reader moves down the piece. */
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const item = list.querySelector<HTMLElement>('[data-active="true"]');
    if (!item) return;
    list.scrollTo({
      left: item.offsetLeft - list.clientWidth / 2 + item.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [active]);

  const position = Math.max(1, ids.indexOf(active) + 1);

  return (
    <nav aria-label="Sections in this note">
      <p className={styles.navHead}>
        Contents
        <span className={styles.navProgress}>
          {String(position).padStart(2, '0')}/{String(ids.length).padStart(2, '0')}
        </span>
      </p>

      <ul className={styles.navList} ref={listRef}>
        <span className={styles.navSpine} aria-hidden="true">
          <span ref={fillRef} className={styles.navSpineFill} />
        </span>

        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={styles.navItem}
              data-active={section.id === active}
              aria-current={section.id === active ? 'true' : undefined}
            >
              <span className={styles.navIndex}>{String(index + 1).padStart(2, '0')}</span>
              {section.nav}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
