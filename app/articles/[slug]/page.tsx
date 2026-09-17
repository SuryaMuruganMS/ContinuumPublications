import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/content/articles';
import { site } from '@/content/site';
import { formatDate, isoDate, pad } from '@/lib/format';
import { absoluteUrl, articleMeta, articleSchema, breadcrumbSchema, JsonLd } from '@/lib/seo';

import { EvidenceProvider } from '@/components/article/EvidenceProvider';
import { EvidenceDrawer } from '@/components/article/EvidenceDrawer';
import { EvidenceIndex } from '@/components/article/EvidenceIndex';
import { SectionNav } from '@/components/article/SectionNav';
import { ArticleBody } from '@/components/article/ArticleBody';
import { SourcesList } from '@/components/article/SourcesList';
import { ShareBar } from '@/components/article/ShareBar';
import { Newsletter } from '@/components/site/Newsletter';
import styles from '@/components/article/Article.module.css';

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return articleMeta(article);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug);
  const url = absoluteUrl(`/articles/${article.slug}/`);
  const corrections = article.corrections ?? [];

  return (
    <EvidenceProvider sources={article.sources}>
      <article className={`u-shell ${styles.page}`}>
        {/* ---------------- Masthead ---------------- */}
        <header className={styles.masthead}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Continuum</Link>
            <span className={styles.breadcrumbSep} aria-hidden="true">
              /
            </span>
            <Link href="/research/">Research</Link>
            <span className={styles.breadcrumbSep} aria-hidden="true">
              /
            </span>
            <span aria-current="page">{pad(article.index)}</span>
          </nav>

          <h1 className={styles.title} data-reveal-mask>
            {article.title}
          </h1>

          <p className={styles.deck} data-reveal>
            {article.deck}
          </p>

          <div className={styles.meta}>
            <time dateTime={isoDate(article.published)}>{formatDate(article.published)}</time>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{article.readingTime} min read</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span className={styles.metaSignal}>
              {article.sources.length} citations
            </span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{article.regulators.join(' · ')}</span>
            {article.updated && (
              <>
                <span className={styles.metaDot} aria-hidden="true" />
                <span>Updated {formatDate(article.updated)}</span>
              </>
            )}
          </div>
        </header>

        {/* ---------------- Layout ---------------- */}
        <div className={styles.layout}>
          <div className={styles.nav}>
            <SectionNav sections={article.sections} />
          </div>

          <aside className={styles.rail} aria-label="Context for this note">
            <EvidenceIndex />

            <section className={styles.panel}>
              <h2 className={styles.panelHead}>
                Documents
                <span className={styles.panelCount}>
                  {String(article.documents.length).padStart(2, '0')}
                </span>
              </h2>
              <div className={styles.panelBody}>
                {article.documents.map((doc) => (
                  <div key={doc.id} className={styles.doc}>
                    {doc.url ? (
                      <a
                        className={styles.docTitle}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {doc.title}
                        <span className="u-sr"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className={styles.docTitle}>{doc.title}</span>
                    )}
                    <span className={styles.docMeta}>
                      {doc.publisher} · {doc.type} · {doc.year}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.panel}>
              <h2 className={styles.panelHead}>
                Open questions
                <span className={styles.panelCount}>
                  {String(article.openQuestions.length).padStart(2, '0')}
                </span>
              </h2>
              <div className={styles.panelBody}>
                {article.openQuestions.map((question) => (
                  <p key={question} className={styles.question}>
                    <span>{question}</span>
                  </p>
                ))}
              </div>
            </section>
          </aside>

          <div className={styles.main}>
            {corrections.length > 0 && (
              <div className={styles.correctionNotice} role="note">
                <p className={styles.correctionLabel}>
                  This note has been corrected ({corrections.length})
                </p>
                {corrections.map((correction) => (
                  <p key={correction.id} className={styles.correctionBody}>
                    <strong>{formatDate(correction.date)}</strong> — {correction.reason}{' '}
                    <Link href={`/corrections/#${correction.id}`}>See the full record</Link>.
                  </p>
                ))}
              </div>
            )}

            <div className={styles.findings} data-reveal>
              <h2 className={styles.findingsHead}>What this note establishes</h2>
              <ol className={styles.findingsList}>
                {article.findings.map((finding) => (
                  <li key={finding}>{finding}</li>
                ))}
              </ol>
            </div>

            <div id="article-body">
              <ArticleBody sections={article.sections} sources={article.sources} />
            </div>

            {/* ---------------- Foot ---------------- */}
            <footer className={styles.foot}>
              <section id="sources">
                <h2 className="u-label" style={{ marginBottom: '1.1rem' }}>
                  The evidence, in full
                </h2>
                <SourcesList />
              </section>

              <ShareBar url={url} title={article.title} />

              {corrections.length === 0 && (
                <p className={styles.correctionClean}>
                  No corrections have been issued for this note. If you believe something here is
                  wrong, <Link href="/contact/">tell us</Link> — every change we make is recorded
                  in the <Link href="/corrections/">corrections ledger</Link> with the original
                  wording beside it.
                </p>
              )}

              <section className={styles.related}>
                <h2 className="u-label">Related</h2>
                <div className={styles.relatedGrid}>
                  {related.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/articles/${entry.slug}/`}
                      className={styles.relatedCard}
                    >
                      <span className={styles.relatedLabel}>
                        {pad(entry.index)} · {entry.regulators[0]}
                      </span>
                      <span className={styles.relatedTitle}>{entry.title}</span>
                      <span className={styles.relatedNote}>{entry.readingTime} min</span>
                    </Link>
                  ))}

                  {article.related.map((link) => (
                    <Link key={link.href} href={link.href} className={styles.relatedCard}>
                      <span className={styles.relatedLabel}>Reference</span>
                      <span className={styles.relatedTitle}>{link.label}</span>
                      {link.note && <span className={styles.relatedNote}>{link.note}</span>}
                    </Link>
                  ))}
                </div>
              </section>

              <Newsletter />
            </footer>
          </div>
        </div>
      </article>

      <EvidenceDrawer />

      <JsonLd
        data={[
          articleSchema(article),
          breadcrumbSchema([
            { name: site.shortName, path: '/' },
            { name: 'Research', path: '/research/' },
            { name: article.title, path: `/articles/${article.slug}/` },
          ]),
        ]}
      />
    </EvidenceProvider>
  );
}
