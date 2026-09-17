'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import { highlight } from '@/lib/rich-text';
import { kindLabel, search, type ResultKind } from '@/lib/search';
import { pad } from '@/lib/format';
import { useSearchIndex } from '@/hooks/useSearchIndex';
import styles from './Search.module.css';

const KINDS: ResultKind[] = [
  'article',
  'section',
  'document',
  'regulator',
  'topic',
  'evidence',
  'page',
];

const EXAMPLES = [
  'disallowed',
  'RET_196',
  '18,521.02',
  'repudiated',
  'Table I.28',
  'incurred claims ratio',
];

/**
 * The full search page.
 *
 * Same index as the ⌘K overlay — this is the version you land on from a link,
 * can filter by record type, and can share. The index is one static file,
 * fetched once; after that every keystroke is computed in memory.
 */
export function SearchView() {
  const [query, setQuery] = useState('');
  const [kinds, setKinds] = useState<ResultKind[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* Land on a query from a link, and focus the field. */
  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search).get('q');
    if (incoming) setQuery(incoming);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    const suffix = params.toString();
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${suffix ? `?${suffix}` : ''}`,
    );
  }, [query]);

  const indexState = useSearchIndex(true);
  const index = indexState.index;
  const all = useMemo(() => (index ? search(index, query, 60) : []), [index, query]);

  const counts = useMemo(() => {
    const map = new Map<ResultKind, number>();
    for (const result of all) map.set(result.kind, (map.get(result.kind) ?? 0) + 1);
    return map;
  }, [all]);

  const results = useMemo(
    () => (kinds.length === 0 ? all : all.filter((r) => kinds.includes(r.kind))),
    [all, kinds],
  );

  const toggleKind = (kind: ResultKind) =>
    setKinds((current) =>
      current.includes(kind) ? current.filter((k) => k !== kind) : [...current, kind],
    );

  const typed = query.trim().length > 1;
  const ready = indexState.status === 'ready';

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        <span className={styles.prompt} aria-hidden="true">
          &gt;
        </span>
        <label className="u-sr" htmlFor="search-field">
          Search Continuum
        </label>
        <input
          ref={inputRef}
          id="search-field"
          className={styles.input}
          type="search"
          value={query}
          placeholder="Search notes, sections, documents, evidence…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button type="button" className={styles.clear} onClick={() => setQuery('')}>
            Clear
          </button>
        )}
      </div>

      {typed && (
        <div className={styles.filters}>
          <span className={styles.filtersLabel}>Filter</span>
          {KINDS.filter((kind) => counts.has(kind)).map((kind) => (
            <button
              key={kind}
              type="button"
              className={styles.filter}
              aria-pressed={kinds.includes(kind)}
              onClick={() => toggleKind(kind)}
            >
              {kindLabel(kind)}
              <span className={styles.filterCount}>{pad(counts.get(kind) ?? 0, 2)}</span>
            </button>
          ))}
          {kinds.length > 0 && (
            <button type="button" className={styles.filterReset} onClick={() => setKinds([])}>
              Reset
            </button>
          )}
        </div>
      )}

      <p className={styles.status} role="status" aria-live="polite">
        {!typed
          ? 'Type at least two characters.'
          : indexState.status === 'error'
            ? 'The search index could not be loaded. Check your connection and reload.'
            : !ready
              ? 'Loading the search index…'
              : `${pad(results.length, 2)} ${results.length === 1 ? 'result' : 'results'} for “${query.trim()}”.`}
      </p>

      {!typed && (
        <div className={styles.idle}>
          <p className={styles.idleTitle}>Search the desk</p>
          <p className={styles.idleBody}>
            The index covers every note, every section inside them, every cited document with its
            page or cell reference, and the evidence attached to each claim. Press{' '}
            <kbd className={styles.kbd}>/</kbd> anywhere on the site to open the quick search.
          </p>
          <div className={styles.examples}>
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                className={styles.example}
                onClick={() => {
                  setQuery(example);
                  inputRef.current?.focus();
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {typed && ready && results.length === 0 && (
        <div className={styles.idle}>
          <p className={styles.idleTitle}>Nothing in the index matches that.</p>
          <p className={styles.idleBody}>
            The desk is small and deliberately so. If you are looking for something we have not
            covered, or you hold a document we should read, we would like to hear from you.
          </p>
          <div className={styles.examples}>
            <Link href="/archive/" className={styles.example}>
              Browse the archive
            </Link>
            <Link href="/contact/" className={styles.example}>
              Send a document
            </Link>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <ol className={styles.results}>
          {results.map((result) => (
            <li key={result.id}>
              <Link href={result.href} className={styles.result}>
                <span className={styles.resultKind}>{kindLabel(result.kind)}</span>
                <span className={styles.resultMain}>
                  <span className={styles.resultTitle}>{highlight(result.title, query)}</span>
                  {result.excerpt && (
                    <span className={styles.resultExcerpt}>
                      {highlight(result.excerpt, query)}
                    </span>
                  )}
                  <span className={styles.resultMeta}>{result.meta}</span>
                </span>
                <span className={styles.resultGo} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
