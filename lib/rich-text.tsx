import { Fragment, type ReactNode } from 'react';
import { CitationRef } from '@/components/article/CitationRef';
import type { Source } from '@/types/content';

/**
 * A deliberately tiny inline renderer.
 *
 *   [[S4]]        an interactive evidence reference
 *   *emphasis*    <em>
 *   `18,521.02`   a tabular figure, set in mono
 *
 * There is no general-purpose markdown here on purpose. Body copy on this site
 * is written by a person into a typed structure, not pasted from elsewhere, and
 * a small grammar means the output is predictable and the bundle stays small.
 */

const TOKEN = /(\[\[[A-Za-z0-9_-]+\]\]|\*[^*\n]+\*|`[^`\n]+`)/g;

export interface RichTextProps {
  text: string;
  /** Sources available for citation. Missing ids render as plain text. */
  sources?: Source[];
  /** Disable citations (used in cards, meta descriptions and the search index). */
  plain?: boolean;
}

export function RichText({ text, sources = [], plain = false }: RichTextProps) {
  const parts = text.split(TOKEN).filter((part) => part !== '');

  return (
    <>
      {parts.map((part, index) => {
        const key = `${index}-${part.slice(0, 12)}`;

        if (part.startsWith('[[') && part.endsWith(']]')) {
          const id = part.slice(2, -2);
          const source = sources.find((s) => s.id === id);
          if (!source || plain) return null;
          return <CitationRef key={key} source={source} />;
        }

        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return <em key={key}>{part.slice(1, -1)}</em>;
        }

        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <span key={key} className="rt-figure">
              {part.slice(1, -1)}
            </span>
          );
        }

        return <Fragment key={key}>{part}</Fragment>;
      })}
    </>
  );
}

/** Strips all markup. Used for meta descriptions, cards and the search index. */
export function toPlainText(text: string): string {
  return text
    .replace(/\[\[[A-Za-z0-9_-]+\]\]/g, '')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Highlights query matches inside a string. Used by search results. */
export function highlight(text: string, query: string): ReactNode {
  const needle = query.trim();
  if (!needle) return text;

  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'ig'));

  return parts.map((part, i) =>
    part.toLowerCase() === needle.toLowerCase() ? (
      <mark key={i} className="rt-mark">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
