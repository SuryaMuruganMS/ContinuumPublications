import { RichText } from '@/lib/rich-text';
import { CitationRef } from '@/components/article/CitationRef';
import { assessmentMeta } from '@/content/evidence-states';
import { Visual } from '@/components/visuals/registry';
import type { ArticleSection, Block, Source } from '@/types/content';
import styles from './Article.module.css';

/**
 * The reading column.
 *
 * A server component — the prose ships as HTML, and only the citation markers
 * and the visuals inside it are interactive. That is what keeps a long,
 * heavily animated article cheap to load and searchable as plain text.
 */
export function ArticleBody({
  sections,
  sources,
}: {
  sections: ArticleSection[];
  sources: Source[];
}) {
  return (
    <>
      {sections.map((section, index) => (
        <section key={section.id} id={section.id} className={styles.section}>
          <header className={styles.sectionHead} data-reveal>
            {section.kicker && (
              <p className={styles.kicker}>
                <span>
                  {String(index + 1).padStart(2, '0')} · {section.kicker}
                </span>
              </p>
            )}
            <h2 className={styles.sectionTitle}>
              {section.title}
              <a
                className={styles.anchor}
                href={`#${section.id}`}
                aria-label={`Link to “${section.title}”`}
              >
                §
              </a>
            </h2>
          </header>

          <div className={`prose ${styles.blocks}`}>
            {section.blocks.map((block, blockIndex) => (
              <BlockView
                key={`${section.id}-${blockIndex}`}
                block={block}
                sources={sources}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function BlockView({ block, sources }: { block: Block; sources: Source[] }) {
  switch (block.type) {
    case 'p':
      return (
        <p data-reveal>
          <RichText text={block.text} sources={sources} />
        </p>
      );

    case 'h':
      return (
        <h3 id={block.id} data-reveal>
          {block.text}
        </h3>
      );

    case 'list': {
      const List = block.ordered ? 'ol' : 'ul';
      return (
        <List data-reveal>
          {block.items.map((item, index) => (
            <li key={index}>
              <RichText text={item} sources={sources} />
            </li>
          ))}
        </List>
      );
    }

    case 'pull':
      return (
        <p className={styles.pull} data-reveal>
          <RichText text={block.text} sources={sources} />
          {block.attribution && (
            <span className={styles.pullAttribution}>{block.attribution}</span>
          )}
        </p>
      );

    case 'quote':
      return (
        <blockquote data-reveal>
          <RichText text={block.text} sources={sources} />
          <cite>{block.attribution}</cite>
        </blockquote>
      );

    case 'note':
      return (
        <aside className={styles.note} data-reveal>
          <p className={styles.noteLabel}>{block.label}</p>
          <div className={styles.noteBody}>
            <RichText text={block.text} sources={sources} />
          </div>
        </aside>
      );

    case 'claim':
      return (
        <div className={styles.claim} data-assessment={block.assessment} data-reveal>
          <p className={styles.claimLabel}>As published</p>
          <p className={styles.claimFigure}>{block.figure}</p>
          <p className={styles.claimAttribution}>
            {block.attribution}
            {(() => {
              const cited = block.source
                ? sources.find((source) => source.id === block.source)
                : undefined;
              return cited ? <CitationRef source={cited} /> : null;
            })()}
          </p>
          <p className={styles.claimVerdict}>
            <span className={styles.claimVerdictMark} aria-hidden="true" />
            {assessmentMeta[block.assessment].label}
            <span className="u-sr">
              {' '}
              — {assessmentMeta[block.assessment].description}
            </span>
          </p>
          <div className={styles.claimBody}>
            <RichText text={block.text} sources={sources} />
          </div>
        </div>
      );

    case 'visual':
      return (
        <div className={styles.visual}>
          <Visual component={block.component} />
        </div>
      );

    case 'divider':
      return <hr data-reveal />;

    default:
      return null;
  }
}
