'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * One observer for the whole site.
 *
 * Server components mark themselves with `data-reveal`, `data-reveal-mask` or
 * `data-reveal-line` and stay server components — this is the only client code
 * involved. On entering the viewport the attribute flips to "in" and CSS does
 * the rest. Elements are unobserved once revealed; nothing re-animates on the
 * way back up, which would be irritating in a long read.
 */
export function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'off';

    const selector = '[data-reveal],[data-reveal-mask],[data-reveal-line]';
    const attrOf = (el: Element) =>
      el.hasAttribute('data-reveal')
        ? 'data-reveal'
        : el.hasAttribute('data-reveal-mask')
          ? 'data-reveal-mask'
          : 'data-reveal-line';

    const showAll = () => {
      document.querySelectorAll(selector).forEach((el) => el.setAttribute(attrOf(el), 'in'));
    };

    if (reduced || typeof IntersectionObserver === 'undefined') {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute(attrOf(entry.target), 'in');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    const observeAll = () => {
      document.querySelectorAll(selector).forEach((el) => {
        if (el.getAttribute(attrOf(el)) === 'in') return;
        // Anything already on screen at load reveals immediately rather than
        // waiting for a scroll that may never come.
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          el.setAttribute(attrOf(el), 'in');
          return;
        }
        observer.observe(el);
      });
    };

    // Two frames: one for hydration, one for layout to settle.
    const raf = requestAnimationFrame(() => requestAnimationFrame(observeAll));

    // Content that mounts later (filtered archive rows, drawer panels).
    const mutations = new MutationObserver(() => observeAll());
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mutations.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
