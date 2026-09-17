'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useFocusTrap, useScrollLock } from '@/hooks/useMotion';
import { useSearchIndex } from '@/hooks/useSearchIndex';
import { highlight } from '@/lib/rich-text';
import { kindLabel, search, type ResultKind, type ScoredResult } from '@/lib/search';
import styles from './CommandSearch.module.css';

const SUGGESTIONS = [
  'disallowed',
  'IRDAI',
  'RET_196',
  '18,521.02',
  'unresolved',
  'methods',
];

const GROUP_ORDER: ResultKind[] = [
  'article',
  'section',
  'document',
  'regulator',
  'topic',
  'evidence',
  'page',
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CommandSearch({ open, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useScrollLock(open);
  useFocusTrap(panelRef, open, onClose);

  const indexState = useSearchIndex(open);
  const index = indexState.index;

  const results = useMemo(
    () => (index && query.trim().length > 1 ? search(index, query, 18) : []),
    [index, query],
  );

  /* Results are grouped for scanning, but arrow keys move through one flat
     list — so the visual grouping never fights the keyboard model. */
  const grouped = useMemo(() => {
    const map = new Map<ResultKind, ScoredResult[]>();
    for (const result of results) {
      const bucket = map.get(result.kind) ?? [];
      bucket.push(result);
      map.set(result.kind, bucket);
    }
    return GROUP_ORDER.filter((kind) => map.has(kind)).map((kind) => ({
      kind,
      items: map.get(kind)!,
    }));
  }, [results]);

  const flat = useMemo(() => grouped.flatMap((group) => group.items), [grouped]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
    // Autofocus after the open animation begins, not before it exists.
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [open]);

  /* Keep the highlighted row in view when arrowing past the fold. */
  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [cursor, open]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((c) => (flat.length === 0 ? 0 : (c + 1) % flat.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((c) => (flat.length === 0 ? 0 : (c - 1 + flat.length) % flat.length));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = flat[cursor];
      if (target) go(target.href);
      else if (query.trim()) go(`/search/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const typed = query.trim().length > 1;
  const showLoading = typed && (indexState.status === 'loading' || indexState.status === 'idle');
  const showError = typed && indexState.status === 'error';
  const showEmpty = typed && indexState.status === 'ready' && flat.length === 0;
  const showIdle = !typed;

  return (
    <div
      className={styles.scrim}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Search Continuum"
        onKeyDown={onKeyDown}
      >
        <div className={styles.field}>
          <span className={styles.prompt} aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            value={query}
            placeholder="Search notes, documents, regulators, evidence…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Search query"
            aria-describedby="command-search-status"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" className={styles.esc} onClick={onClose}>
            ESC
          </button>
        </div>

        <div className={styles.body} ref={listRef}>
          <p id="command-search-status" className="u-sr" role="status" aria-live="polite">
            {showIdle
              ? 'Type at least two characters to search.'
              : showLoading
                ? 'Loading the search index.'
                : showError
                  ? 'The search index could not be loaded.'
                  : `${flat.length} result${flat.length === 1 ? '' : 's'} for ${query}.`}
          </p>

          {showIdle && (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Search the desk</p>
              <p className={styles.emptyBody}>
                Notes, the sections inside them, every cited document, and the evidence attached
                to each claim. Start typing, or try one of these.
              </p>
              <div className={styles.suggestions}>
                {SUGGESTIONS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className={styles.suggestion}
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showLoading && (
            <div className={styles.empty}>
              <p className={styles.emptyBody}>Loading the index…</p>
            </div>
          )}

          {showError && (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>The search index did not load.</p>
              <p className={styles.emptyBody}>
                Check your connection and try again, or browse the archive directly.
              </p>
              <div className={styles.suggestions}>
                <button type="button" className={styles.suggestion} onClick={() => go('/archive/')}>
                  Browse the archive
                </button>
              </div>
            </div>
          )}

          {showEmpty && (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Nothing in the index matches “{query.trim()}”.</p>
              <p className={styles.emptyBody}>
                The desk is small and deliberately so. If you are looking
                for something we have not covered, or you hold a document we should read, send it
                to us.
              </p>
              <div className={styles.suggestions}>
                <button type="button" className={styles.suggestion} onClick={() => go('/archive/')}>
                  Browse the archive
                </button>
                <button type="button" className={styles.suggestion} onClick={() => go('/contact/')}>
                  Send a document
                </button>
              </div>
            </div>
          )}

          {grouped.map((group) => (
            <section key={group.kind}>
              <div className={styles.group}>
                <span className={styles.groupLabel}>{kindLabel(group.kind)}</span>
                <span className={styles.groupRule} aria-hidden="true" />
              </div>
              {group.items.map((item) => {
                const index = flat.indexOf(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.item}
                    data-active={index === cursor}
                    onMouseEnter={() => setCursor(index)}
                    onClick={() => go(item.href)}
                  >
                    <span>
                      <span className={styles.itemTitle}>{highlight(item.title, query)}</span>
                      <span className={styles.itemMeta}>{item.meta}</span>
                    </span>
                    <span className={styles.itemGo} aria-hidden="true">
                      ↵
                    </span>
                  </button>
                );
              })}
            </section>
          ))}
        </div>

        <div className={styles.foot}>
          <span className={styles.footKey}>
            <b>↑</b>
            <b>↓</b> Move
          </span>
          <span className={styles.footKey}>
            <b>↵</b> Open
          </span>
          <span className={styles.footKey}>
            <b>esc</b> Close
          </span>
          <span className={styles.count}>
            {flat.length > 0 ? `${String(flat.length).padStart(2, '0')} results` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
