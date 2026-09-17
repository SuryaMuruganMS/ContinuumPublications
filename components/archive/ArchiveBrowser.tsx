'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { formatDateCompact, isoDate, pad } from '@/lib/format';
import type { Article, Facet } from '@/types/content';
import styles from './Archive.module.css';

type SortKey = 'newest' | 'oldest' | 'index' | 'citations';

interface Props {
  articles: Article[];
  facets: {
    topics: Facet[];
    regulators: Facet[];
    years: Facet[];
    documentTypes: Facet[];
  };
  /** Empty ledger slots drawn below the last entry. */
  slots?: number;
}

/**
 * The archive.
 *
 * Filtering happens in the browser over the full index, which is the right
 * trade at this scale and stays right into the hundreds: the whole index is
 * smaller than a single photograph. Filters are reflected into the URL so a
 * filtered view can be linked to, and read back out of it on load so links
 * from the search overlay and the topic tags land where they should.
 */
export function ArchiveBrowser({ articles, facets, slots = 4 }: Props) {
  const [query, setQuery] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [regulators, setRegulators] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('newest');

  /* ---- Read the incoming link ---- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const read = (key: string) => params.getAll(key).filter(Boolean);
    setQuery(params.get('q') ?? '');
    setTopics(read('topic'));
    setRegulators(read('regulator'));
    setYears(read('year'));
    setTypes(read('type'));
    const incomingSort = params.get('sort');
    if (incomingSort && ['newest', 'oldest', 'index', 'citations'].includes(incomingSort)) {
      setSort(incomingSort as SortKey);
    }
  }, []);

  /* ---- Write the outgoing link ---- */
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    for (const t of topics) params.append('topic', t);
    for (const r of regulators) params.append('regulator', r);
    for (const y of years) params.append('year', y);
    for (const t of types) params.append('type', t);
    if (sort !== 'newest') params.set('sort', sort);

    const search = params.toString();
    const url = `${window.location.pathname}${search ? `?${search}` : ''}`;
    window.history.replaceState(window.history.state, '', url);
  }, [query, topics, regulators, years, types, sort]);

  const toggle = (
    value: string,
    list: string[],
    setList: (next: string[]) => void,
  ) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matched = articles.filter((article) => {
      if (topics.length && !topics.some((t) => article.topics.includes(t))) return false;
      if (regulators.length && !regulators.some((r) => article.regulators.includes(r)))
        return false;
      if (
        years.length &&
        !years.includes(new Date(article.published).getUTCFullYear().toString())
      )
        return false;
      if (types.length && !types.some((t) => article.documents.some((d) => d.type === t)))
        return false;

      if (!q) return true;
      const haystack = [
        article.title,
        article.deck,
        article.summary,
        article.topics.join(' '),
        article.regulators.join(' '),
        article.documents.map((d) => `${d.publisher} ${d.title} ${d.type}`).join(' '),
        article.findings.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });

    const sorted = [...matched];
    switch (sort) {
      case 'oldest':
        sorted.sort((a, b) => +new Date(a.published) - +new Date(b.published));
        break;
      case 'index':
        sorted.sort((a, b) => a.index - b.index);
        break;
      case 'citations':
        sorted.sort((a, b) => b.sources.length - a.sources.length);
        break;
      default:
        sorted.sort((a, b) => +new Date(b.published) - +new Date(a.published));
    }
    return sorted;
  }, [articles, query, topics, regulators, years, types, sort]);

  const activeFilters = [
    ...topics.map((v) => ({ label: v, clear: () => toggle(v, topics, setTopics) })),
    ...regulators.map((v) => ({ label: v, clear: () => toggle(v, regulators, setRegulators) })),
    ...years.map((v) => ({ label: v, clear: () => toggle(v, years, setYears) })),
    ...types.map((v) => ({ label: v, clear: () => toggle(v, types, setTypes) })),
  ];

  const hasFilters = activeFilters.length > 0 || query.trim().length > 0;

  const resetAll = () => {
    setQuery('');
    setTopics([]);
    setRegulators([]);
    setYears([]);
    setTypes([]);
    setSort('newest');
  };

  return (
    <div className={styles.layout}>
      {/* ---------------- Filters ---------------- */}
      <div className={styles.filters}>
        <div className={styles.search}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="4.25" stroke="var(--fg-dim)" strokeWidth="1.2" />
            <path d="M9.2 9.2 12.5 12.5" stroke="var(--fg-dim)" strokeWidth="1.2" />
          </svg>
          <label className="u-sr" htmlFor="archive-search">
            Filter the archive
          </label>
          <input
            id="archive-search"
            className={styles.searchInput}
            type="search"
            value={query}
            placeholder="Filter…"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button type="button" className={styles.searchClear} onClick={() => setQuery('')}>
              Clear
            </button>
          )}
        </div>

        <FacetGroup
          heading="Regulator"
          facets={facets.regulators}
          selected={regulators}
          onToggle={(v) => toggle(v, regulators, setRegulators)}
        />
        <FacetGroup
          heading="Topic"
          facets={facets.topics}
          selected={topics}
          onToggle={(v) => toggle(v, topics, setTopics)}
        />
        <FacetGroup
          heading="Document type"
          facets={facets.documentTypes}
          selected={types}
          onToggle={(v) => toggle(v, types, setTypes)}
        />
        <FacetGroup
          heading="Year"
          facets={facets.years}
          selected={years}
          onToggle={(v) => toggle(v, years, setYears)}
        />

        {hasFilters && (
          <button type="button" className={styles.reset} onClick={resetAll}>
            Clear all filters
          </button>
        )}
      </div>

      {/* ---------------- Results ---------------- */}
      <div className={styles.results}>
        <div className={styles.toolbar}>
          <p className={styles.count} role="status" aria-live="polite">
            <span className={styles.countValue}>{pad(filtered.length, 2)}</span>{' '}
            {filtered.length === 1 ? 'entry' : 'entries'}
            {hasFilters ? ` of ${pad(articles.length, 2)}` : ''}
          </p>

          <div className={styles.toolbarRight}>
            <label className="u-sr" htmlFor="archive-sort">
              Sort the archive
            </label>
            <select
              id="archive-sort"
              className={styles.select}
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="index">Index order</option>
              <option value="citations">Most cited</option>
            </select>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className={styles.active}>
            {activeFilters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                className={styles.chip}
                onClick={filter.clear}
              >
                {filter.label}
                <span aria-hidden="true">×</span>
                <span className="u-sr">Remove this filter</span>
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyMark}>No entries</p>
            <p className={styles.emptyTitle}>Nothing in the index matches those filters.</p>
            <p className={styles.emptyBody}>
              The desk is small and deliberately so. If you are looking for something we have not
              covered, or you hold a document we should read, send it to us.
            </p>
            <div className={styles.active}>
              <button type="button" className={styles.chip} onClick={resetAll}>
                Clear all filters
              </button>
              <Link href="/contact/" className={styles.chip}>
                Send a document
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ol className={styles.ledger}>
              {filtered.map((article) => (
                <li key={article.slug}>
                  <Link href={`/articles/${article.slug}/`} className={styles.row}>
                    <span className={styles.rowIndex}>{pad(article.index)}</span>

                    <span className={styles.rowMain}>
                      <span className={styles.rowTitle}>{article.title}</span>
                      <span className={styles.rowDeck}>{article.deck}</span>
                    </span>

                    <span className={styles.rowMeta}>
                      {article.regulators.join(' · ')}
                      <br />
                      {article.topics.slice(0, 2).join(' · ')}
                      <br />
                      {article.sources.length} citations
                    </span>

                    <span className={styles.rowDate}>
                      <time dateTime={isoDate(article.published)}>
                        {formatDateCompact(article.published)}
                      </time>
                      <span className={styles.rowStatus} data-status={article.status}>
                        {article.status === 'corrected' ? 'Corrected' : 'Published'}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            {!hasFilters &&
              Array.from({ length: slots }).map((_, index) => (
                <div key={index} className={styles.slot} aria-hidden="true">
                  <span className={styles.slotIndex}>{pad(articles.length + index + 1)}</span>
                  <span className={styles.slotRule} />
                </div>
              ))}

            {!hasFilters && (
              <p className={styles.note}>
                Numbered slots below the last entry are the shape of the index, not forthcoming
                articles. The archive is built to hold hundreds and currently holds{' '}
                {articles.length === 1 ? 'one' : articles.length}.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FacetGroup({
  heading,
  facets,
  selected,
  onToggle,
}: {
  heading: string;
  facets: Facet[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (facets.length === 0) return null;

  return (
    <div className={styles.group}>
      <p className={styles.groupHead}>
        {heading}
        <span className={styles.groupCount}>{pad(facets.length, 2)}</span>
      </p>
      {facets.map((facet) => (
        <button
          key={facet.key}
          type="button"
          className={styles.facet}
          aria-pressed={selected.includes(facet.label)}
          onClick={() => onToggle(facet.label)}
        >
          <span className={styles.facetBox} aria-hidden="true" />
          <span className={styles.facetLabel}>{facet.label}</span>
          <span className={styles.facetCount}>{pad(facet.count, 2)}</span>
        </button>
      ))}
    </div>
  );
}
