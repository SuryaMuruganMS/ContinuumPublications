'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { primaryNav, site } from '@/content/site';
import { useScrollLock } from '@/hooks/useMotion';
import { CommandSearch } from '@/components/site/CommandSearch';
import styles from './Nav.module.css';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  // Article pages light up "Research" in the bar.
  if (href === '/research/') return pathname.startsWith('/research') || pathname.startsWith('/articles');
  return pathname.startsWith(href.replace(/\/$/, ''));
}

export function Nav() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const barRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useScrollLock(menuOpen);

  /* Compact state + global scroll progress, both on one rAF-throttled
     listener. The progress bar is written straight to the DOM: re-rendering
     React on every scroll frame for a 1px line would be indefensible. */
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      setCompact(y > 24);

      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? Math.min(1, Math.max(0, y / total)) : 0;
      progressRef.current?.style.setProperty('--progress', ratio.toFixed(4));
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
  }, [pathname]);

  /* Close transient chrome when the route changes. */
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  /* Keyboard: ⌘K / Ctrl-K anywhere, and "/" when not already typing. */
  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
        return;
      }

      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        ref={barRef}
        className={styles.root}
        data-compact={compact || menuOpen}
        data-print="hide"
      >
        <nav className={`u-shell ${styles.inner}`} aria-label="Primary">
          <Link href="/" className={styles.brand} aria-label={`${site.name} — home`}>
            <span className={styles.mark}>CONTINUUM</span>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.descriptor}>Publications</span>
          </Link>

          <ul className={styles.links}>
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.link}
                    data-active={active}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.utils}>
            <button
              type="button"
              className={styles.search}
              onClick={openSearch}
              aria-label="Search the desk"
            >
              <SearchGlyph />
              <span className={styles.searchLabel}>Search</span>
              <kbd className={styles.kbd}>/</kbd>
            </button>

            <button
              type="button"
              className={styles.searchIcon}
              onClick={openSearch}
              aria-label="Search the desk"
            >
              <SearchGlyph />
            </button>

            <Link href="/subscribe/" className={styles.subscribe}>
              Subscribe
            </Link>

            <button
              type="button"
              className={styles.burger}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="nav-sheet"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className={styles.burgerBars} aria-hidden="true" />
            </button>
          </div>

          <span ref={progressRef} className={styles.progress} aria-hidden="true" />
        </nav>

      </header>

      {menuOpen && (
        <div className={styles.sheet} id="nav-sheet">
          <ul className={styles.sheetNav}>
            {primaryNav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.sheetLink}
                    data-active={active}
                    style={{ ['--i' as string]: i }}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className={styles.sheetIndex}>{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div>
            <div className={styles.sheetFoot}>
              <button
                type="button"
                className={styles.sheetAction}
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
              >
                Search the desk
                <SearchGlyph />
              </button>
              <Link href="/subscribe/" className={styles.sheetAction} data-signal="true">
                Subscribe
                <ArrowGlyph />
              </Link>
            </div>
            <p className={styles.sheetMeta}>{site.tagline}</p>
          </div>
        </div>
      )}

      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function SearchGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9.2 9.2 12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
      <path d="M0 5h12M8.5 1 12.5 5l-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
