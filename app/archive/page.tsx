import type { Metadata } from 'next';

import {
  deskStats,
  documentTypeFacets,
  getAllArticles,
  regulatorFacets,
  topicFacets,
  yearFacets,
} from '@/content/articles';
import { site } from '@/content/site';
import { pad } from '@/lib/format';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { PageHeader } from '@/components/site/PageHeader';
import { ArchiveBrowser } from '@/components/archive/ArchiveBrowser';
import styles from '@/components/site/Page.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Archive',
  description:
    'A filterable index of everything Continuum Publications has published, by regulator, topic, document type and year.',
  path: '/archive/',
});

export default function ArchivePage() {
  const articles = getAllArticles();
  const stats = deskStats();

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Archive"
        title="The index"
        deck="Every note, filterable by the regulator it examines, the documents it rests on, and the year it was published. Built for hundreds of entries; honest about holding what it holds."
        meta={[
          `${pad(stats.notes, 2)} entries`,
          `${pad(stats.documents, 2)} documents`,
          `${pad(stats.regulators, 2)} regulators`,
          `${pad(stats.citations, 2)} citations`,
        ]}
      />

      <div className={styles.body}>
        <ArchiveBrowser
          articles={articles}
          facets={{
            topics: topicFacets(),
            regulators: regulatorFacets(),
            years: yearFacets(),
            documentTypes: documentTypeFacets(),
          }}
        />
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Archive', path: '/archive/' },
        ])}
      />
    </div>
  );
}
