import { getAllArticles } from '@/content/articles';
import { evidenceStates } from '@/content/evidence-states';
import { primaryNav, footerNav } from '@/content/site';
import { toPlainText } from '@/lib/rich-text';
import type { SearchRecord } from '@/lib/search';
import type { Article } from '@/types/content';

/**
 * Builds the search index. BUILD TIME ONLY.
 *
 * This module imports the whole content layer, so it must never be imported by
 * a client component. It is used by app/search-index.json/route.ts, which the
 * static export writes to /search-index.json; the search page and the quick
 * search overlay fetch that file when a reader first opens them.
 *
 * Keeping it out of the client bundle matters for more than size: the raw
 * content modules carry internal editorial references (evidence-matrix row IDs)
 * that are stripped before rendering and must not ship to readers at all.
 */

function articleBody(article: Article): string {
  return article.sections
    .flatMap((section) =>
      section.blocks.map((block) => {
        switch (block.type) {
          case 'p':
          case 'pull':
          case 'quote':
          case 'note':
            return toPlainText(block.text);
          case 'list':
            return block.items.map(toPlainText).join(' ');
          case 'claim':
            return `${block.figure} ${block.attribution} ${toPlainText(block.text)}`;
          case 'h':
            return block.text;
          default:
            return '';
        }
      }),
    )
    .join(' ');
}

export function buildSearchIndex(): SearchRecord[] {
  const records: SearchRecord[] = [];
  const articles = getAllArticles();

  for (const article of articles) {
    const body = articleBody(article);

    records.push({
      id: `article:${article.slug}`,
      kind: 'article',
      title: article.title,
      meta: `${article.regulators.join(', ')} · ${article.readingTime} min`,
      haystack: [
        article.title,
        article.deck,
        article.summary,
        article.topics.join(' '),
        article.regulators.join(' '),
        article.documents.map((d) => `${d.publisher} ${d.title}`).join(' '),
        body,
      ]
        .join(' ')
        .toLowerCase(),
      excerpt: article.deck,
      href: `/articles/${article.slug}/`,
      weight: 100,
    });

    for (const section of article.sections) {
      const text = section.blocks
        .map((b) =>
          b.type === 'p' || b.type === 'pull' || b.type === 'note' || b.type === 'quote'
            ? toPlainText(b.text)
            : b.type === 'list'
              ? b.items.map(toPlainText).join(' ')
              : b.type === 'claim'
                ? `${b.figure} ${toPlainText(b.text)}`
                : '',
        )
        .join(' ');

      records.push({
        id: `section:${article.slug}:${section.id}`,
        kind: 'section',
        title: section.title,
        meta: article.title,
        haystack: `${section.title} ${section.nav} ${text}`.toLowerCase(),
        excerpt: text.slice(0, 180),
        href: `/articles/${article.slug}/#${section.id}`,
        weight: 55,
      });
    }

    for (const source of article.sources) {
      records.push({
        id: `source:${article.slug}:${source.id}`,
        kind: 'document',
        title: `${source.publisher} — ${source.document}`,
        meta: source.locator,
        haystack:
          `${source.publisher} ${source.document} ${source.locator} ${source.establishes} ${source.quote ?? ''} ${source.working ?? ''}`.toLowerCase(),
        excerpt: source.establishes,
        href: `/articles/${article.slug}/?evidence=${source.id}`,
        weight: 45,
      });
    }
  }

  const topics = new Set(articles.flatMap((a) => a.topics));
  for (const topic of topics) {
    const count = articles.filter((a) => a.topics.includes(topic)).length;
    records.push({
      id: `topic:${topic}`,
      kind: 'topic',
      title: topic,
      meta: `${count} note${count === 1 ? '' : 's'}`,
      haystack: topic.toLowerCase(),
      excerpt: `Every note filed under ${topic}.`,
      href: `/archive/?topic=${encodeURIComponent(topic)}`,
      weight: 40,
    });
  }

  const regulators = new Set(articles.flatMap((a) => a.regulators));
  for (const regulator of regulators) {
    const count = articles.filter((a) => a.regulators.includes(regulator)).length;
    records.push({
      id: `regulator:${regulator}`,
      kind: 'regulator',
      title: regulator,
      meta: `${count} note${count === 1 ? '' : 's'}`,
      haystack: regulator.toLowerCase(),
      excerpt: `Everything the desk has published on ${regulator}.`,
      href: `/archive/?regulator=${encodeURIComponent(regulator)}`,
      weight: 42,
    });
  }

  for (const state of Object.values(evidenceStates)) {
    records.push({
      id: `evidence:${state.kind}`,
      kind: 'evidence',
      title: state.label,
      meta: 'Evidence state',
      haystack: `${state.label} ${state.definition} ${state.standard}`.toLowerCase(),
      excerpt: state.definition,
      href: `/standards/#evidence`,
      weight: 30,
    });
  }

  const pages = [
    ...primaryNav,
    ...footerNav.flatMap((group) => group.items),
    { label: 'Subscribe', href: '/subscribe/', hint: 'One research note when we publish.' },
    { label: 'Contact', href: '/contact/', hint: 'Corrections, documents, questions.' },
  ];
  const seen = new Set<string>();
  for (const page of pages) {
    if (seen.has(page.href)) continue;
    seen.add(page.href);
    records.push({
      id: `page:${page.href}`,
      kind: 'page',
      title: page.label,
      meta: page.href.replace(/\//g, '') || 'home',
      haystack: `${page.label} ${page.hint ?? ''}`.toLowerCase(),
      excerpt: page.hint ?? '',
      href: page.href,
      weight: 20,
    });
  }

  return records;
}
