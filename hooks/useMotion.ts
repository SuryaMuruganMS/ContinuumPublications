'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/* Reduced motion                                                      */
/* ------------------------------------------------------------------ */

/**
 * True when the reader has asked for reduced motion, either at the OS level or
 * via the toggle in the footer. Every animation in the site checks this before
 * it does anything; nothing depends on motion to become readable.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () =>
      setReduced(mq.matches || document.documentElement.dataset.motion === 'off');

    read();
    mq.addEventListener('change', read);

    // The footer toggle writes data-motion on <html>.
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion'],
    });

    return () => {
      mq.removeEventListener('change', read);
      observer.disconnect();
    };
  }, []);

  return reduced;
}

/* ------------------------------------------------------------------ */
/* Media query                                                         */
/* ------------------------------------------------------------------ */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const read = () => setMatches(mq.matches);
    read();
    mq.addEventListener('change', read);
    return () => mq.removeEventListener('change', read);
  }, [query]);

  return matches;
}

/* ------------------------------------------------------------------ */
/* Scroll position                                                     */
/* ------------------------------------------------------------------ */

/** Pixels scrolled from the top, sampled on a rAF so it never thrashes layout. */
export function useScrollY(): number {
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setY(window.scrollY);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return y;
}

/**
 * Progress (0..1) through a target element. Used by the article reading bar.
 * Writes to a ref-held DOM node directly rather than through state, so a
 * long article does not re-render React on every scroll frame.
 */
export function useElementProgress(
  targetRef: React.RefObject<HTMLElement | null>,
  onProgress: (value: number) => void,
) {
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = rect.height - viewport;
      if (total <= 0) {
        callback.current(rect.bottom <= viewport ? 1 : 0);
        return;
      }
      const passed = -rect.top;
      callback.current(Math.min(1, Math.max(0, passed / total)));
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
  }, [targetRef]);
}

/* ------------------------------------------------------------------ */
/* Scroll spy                                                          */
/* ------------------------------------------------------------------ */

/**
 * Returns the id of the section currently under the reading line. Uses
 * rAF-throttled geometry rather than IntersectionObserver thresholds, because
 * sections vary hugely in height and thresholds give a jumpy result.
 */
export function useScrollSpy(ids: string[], offset = 140): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (ids.length === 0) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // At the very bottom, always show the last section — short final
      // sections otherwise never become active.
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = ids[ids.length - 1];
      }
      setActive((prev) => (prev === current ? prev : current));
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
  }, [ids, offset]);

  return active;
}

/* ------------------------------------------------------------------ */
/* In-view                                                             */
/* ------------------------------------------------------------------ */

/** Fires once when the element first enters the viewport. */
export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15, ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}

/* ------------------------------------------------------------------ */
/* Count up                                                            */
/* ------------------------------------------------------------------ */

/**
 * Animates a number towards `target`. Returns the current display value.
 * Resolves instantly under reduced motion — the figure is the point, the
 * animation is not.
 */
export function useCountUp(target: number, active: boolean, duration = 1100): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }

    const from = fromRef.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo — fast arrival, long settle. Reads as a value locking in.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(from + (target - from) * eased);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration, reduced]);

  return value;
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

/** Locks body scroll while an overlay or drawer is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

/** Traps Tab inside a container while it is open. */
export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  onClose?: () => void,
) {
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const previous = document.activeElement as HTMLElement | null;
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

    const focusFirst = () => {
      const items = node.querySelectorAll<HTMLElement>(selector);
      (items[0] ?? node).focus();
    };
    focusFirst();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close.current?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [...node.querySelectorAll<HTMLElement>(selector)].filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [ref, active]);
}

/** Copy-to-clipboard with a transient "copied" state. */
export function useCopy(resetAfter = 2000): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    (text: string) => {
      const done = () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), resetAfter);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => undefined);
      } else {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand('copy');
          done();
        } catch {
          /* nothing we can do; the URL is in the address bar anyway */
        }
        document.body.removeChild(area);
      }
    },
    [resetAfter],
  );

  return [copied, copy];
}
