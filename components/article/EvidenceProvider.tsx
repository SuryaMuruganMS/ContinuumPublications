'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { EvidenceKind, Source } from '@/types/content';

/**
 * The evidence system's single source of truth for one article.
 *
 * It owns three things:
 *   · which source is open in the drawer
 *   · which evidence state (if any) is being isolated from the Evidence Index
 *   · the ?evidence= deep link, kept in sync both ways
 */

interface EvidenceContextValue {
  sources: Source[];
  /** Currently open source, or null. */
  open: Source | null;
  openSource: (id: string) => void;
  close: () => void;
  next: () => void;
  previous: () => void;
  /** Position of the open source, 1-indexed, for "04 / 15". */
  position: number;
  total: number;
  /** Evidence state currently isolated by the Evidence Index, or null. */
  filter: EvidenceKind | null;
  setFilter: (kind: EvidenceKind | null) => void;
  /** Deep link to the open source. */
  permalink: string;
}

const EvidenceContext = createContext<EvidenceContextValue | null>(null);

export function EvidenceProvider({
  sources,
  children,
}: {
  sources: Source[];
  children: ReactNode;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<EvidenceKind | null>(null);

  const open = useMemo(
    () => (openId ? (sources.find((s) => s.id === openId) ?? null) : null),
    [openId, sources],
  );

  /* ---- Deep link in ---- */
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('evidence');
    if (!id) return;
    if (!sources.some((s) => s.id === id)) return;
    setOpenId(id);
    // Bring the matching reference into view behind the drawer, so closing it
    // leaves the reader where the claim actually is.
    window.setTimeout(() => {
      document
        .querySelector(`[data-citation="${id}"]`)
        ?.scrollIntoView({ block: 'center', behavior: 'auto' });
    }, 60);
  }, [sources]);

  /* ---- Deep link out ---- */
  useEffect(() => {
    const url = new URL(window.location.href);
    if (openId) url.searchParams.set('evidence', openId);
    else url.searchParams.delete('evidence');
    window.history.replaceState(window.history.state, '', url.toString());
  }, [openId]);

  const openSource = useCallback((id: string) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);

  const step = useCallback(
    (delta: number) => {
      setOpenId((current) => {
        if (!current) return current;
        const index = sources.findIndex((s) => s.id === current);
        if (index === -1) return current;
        const nextIndex = (index + delta + sources.length) % sources.length;
        return sources[nextIndex].id;
      });
    },
    [sources],
  );

  const next = useCallback(() => step(1), [step]);
  const previous = useCallback(() => step(-1), [step]);

  /* ---- Keyboard, while the drawer is open ---- */
  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previous();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId, next, previous]);

  const position = open ? sources.findIndex((s) => s.id === open.id) + 1 : 0;

  const permalink = useMemo(() => {
    if (typeof window === 'undefined' || !openId) return '';
    const url = new URL(window.location.href);
    url.searchParams.set('evidence', openId);
    url.hash = '';
    return url.toString();
  }, [openId]);

  const value: EvidenceContextValue = {
    sources,
    open,
    openSource,
    close,
    next,
    previous,
    position,
    total: sources.length,
    filter,
    setFilter,
    permalink,
  };

  return <EvidenceContext.Provider value={value}>{children}</EvidenceContext.Provider>;
}

/**
 * Returns null outside an article. Citation references degrade to plain,
 * non-interactive markers rather than throwing — the same component is used
 * in cards and previews where no provider exists.
 */
export function useEvidence(): EvidenceContextValue | null {
  return useContext(EvidenceContext);
}
