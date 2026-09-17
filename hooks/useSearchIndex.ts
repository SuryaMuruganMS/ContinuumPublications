'use client';

import { useEffect, useState } from 'react';
import { loadSearchIndex, type SearchRecord } from '@/lib/search';

export type SearchIndexState =
  | { status: 'idle' | 'loading'; index: null }
  | { status: 'ready'; index: SearchRecord[] }
  | { status: 'error'; index: null };

/**
 * Fetches /search-index.json the first time `active` is true. The overlay
 * passes its open state, so a reader who never searches never downloads it.
 */
export function useSearchIndex(active: boolean): SearchIndexState {
  const [state, setState] = useState<SearchIndexState>({ status: 'idle', index: null });

  useEffect(() => {
    if (!active || state.status === 'ready' || state.status === 'loading') return;
    let cancelled = false;
    setState({ status: 'loading', index: null });
    loadSearchIndex()
      .then((index) => {
        if (!cancelled) setState({ status: 'ready', index });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', index: null });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return state;
}
