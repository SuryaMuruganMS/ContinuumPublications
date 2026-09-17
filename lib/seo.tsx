import type { Metadata } from 'next';
import { site } from '@/content/site';
import type { Article } from '@/types/content';

/**
 * ▸ EDIT SOCIAL METADATA HERE.
 * Every page's title, description, canonical and Open Graph card is produced
 * by one of these two helpers. The OG image itself is generated at build time
 * from app/opengraph-image.tsx and app/articles/[slug]/opengraph-image.tsx.
 */

export function absoluteUrl(path = '/'): string {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Social cards are real .png files under /og/, generated at build time by
 * scripts/generate-og.mjs. They are referenced explicitly rather than through
 * Next's opengraph-image convention, which under `output: 'export'` emits an
 * extensionless file that most static hosts serve as octet-stream.
 */
export const DEFAULT_OG = '/og/default.png';

export function ogImage(path = DEFAULT_OG, alt = `${site.name} — ${site.tagline}`) {
  return [{ url: absoluteUrl(path), width: 1200, height: 630, alt, type: 'image/png' }];
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Suppress the "| Continuum Publications" suffix (used on the homepage). */
  bare?: boolean;
  noIndex?: boolean;
}

export function pageMeta({
  title,
  description,
  path,
  bare = false,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = bare ? title : `${title} — ${site.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      images: ogImage(),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [absoluteUrl(DEFAULT_OG)],
    },
  };
}

export function articleMeta(article: Article): Metadata {
  const url = absoluteUrl(`/articles/${article.slug}/`);
  const card = `/og/${article.slug}.png`;
  const cardAlt = [article.social?.counterFigure, article.social?.figure, article.social?.label]
    .filter(Boolean)
    .join(' · ') || article.title;

  // Search engines see these; the page always renders the full `title` (H1)
  // and `summary` (standfirst, cards, search). `seo` only shortens what a
  // results snippet displays — it changes nothing a reader sees on the site.
  const seoTitle = article.seo?.title ?? article.title;
  const seoDescription = article.seo?.description ?? article.summary;

  return {
    title: `${seoTitle} — ${site.name}`,
    description: seoDescription,
    alternates: { canonical: url },
    keywords: [...article.topics, ...article.regulators],
    openGraph: {
      type: 'article',
      title: seoTitle,
      description: seoDescription,
      url,
      siteName: site.name,
      locale: site.locale,
      publishedTime: article.published,
      modifiedTime: article.updated ?? article.published,
      tags: article.topics,
      images: ogImage(card, cardAlt),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [absoluteUrl(card)],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Structured data                                                     */
/* ------------------------------------------------------------------ */

export function organisationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.url}/#organisation`,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    description: site.positioning,
    email: site.email.general,
    publishingPrinciples: absoluteUrl('/standards/'),
    correctionsPolicy: absoluteUrl('/corrections/'),
    actionableFeedbackPolicy: absoluteUrl('/contact/'),
    ethicsPolicy: absoluteUrl('/standards/'),
    diversityPolicy: absoluteUrl('/about/'),
    knowsAbout: ['Indian financial regulation', 'Regulatory disclosure', 'Public data'],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: site.language,
    publisher: { '@id': `${site.url}/#organisation` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site.url}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function articleSchema(article: Article) {
  const url = absoluteUrl(`/articles/${article.slug}/`);

  return {
    '@context': 'https://schema.org',
    '@type': 'ReportageNewsArticle',
    '@id': `${url}#article`,
    headline: article.title,
    alternativeHeadline: article.deck,
    description: article.summary,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: [absoluteUrl(`/og/${article.slug}.png`)],
    datePublished: article.published,
    dateModified: article.updated ?? article.published,
    inLanguage: site.language,
    isAccessibleForFree: true,
    keywords: [...article.topics, ...article.regulators].join(', '),
    about: article.topics.map((topic) => ({ '@type': 'Thing', name: topic })),
    /* The desk publishes as an organisation and does not attribute notes to
       named individuals. Attributing to the organisation is the accurate
       representation, not a placeholder. */
    author: { '@id': `${site.url}/#organisation` },
    publisher: { '@id': `${site.url}/#organisation` },
    citation: [
      ...article.sources
        .filter((source) => source.kind === 'documented')
        .map((source) => ({
          '@type': 'CreativeWork',
          name: `${source.document} — ${source.locator}`,
          publisher: { '@type': 'Organization', name: source.publisher },
          ...(source.url ? { url: source.url } : {}),
        })),
      // Each verified news article once, however many claims cite it.
      ...[
        ...new Map(
          article.sources
            .filter((source) => source.media)
            .map((source) => [source.media!.key, source.media!]),
        ).values(),
      ].map((media) => ({
        '@type': 'NewsArticle',
        headline: media.headline,
        datePublished: media.published,
        url: media.url,
        publisher: { '@type': 'Organization', name: media.publication },
        author:
          media.sourceType === 'PTI'
            ? { '@type': 'Organization', name: media.byline }
            : { '@type': 'Person', name: media.byline },
      })),
    ],
    ...(article.corrections && article.corrections.length > 0
      ? {
          correction: article.corrections.map((correction) => ({
            '@type': 'CorrectionComment',
            text: correction.corrected,
            datePublished: correction.date,
          })),
        }
      : {}),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(entries: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

/** Renders a JSON-LD block. Next inlines this into the static HTML. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Content is our own structured data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
