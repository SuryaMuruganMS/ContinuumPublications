import type { Metadata } from 'next';

import { site } from '@/content/site';
import { deskStats } from '@/content/articles';
import { buildSearchIndex } from '@/lib/search-index';
import { pad } from '@/lib/format';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { PageHeader } from '@/components/site/PageHeader';
import { SearchView } from '@/components/search/SearchView';
import styles from '@/components/site/Page.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Search',
  description:
    'Search every note, section, cited document and evidence record published by Continuum Publications.',
  path: '/search/',
});

export default function SearchPage() {
  const stats = deskStats();
  const records = buildSearchIndex().length;

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Search"
        title="Search the desk"
        deck="Notes, the sections inside them, every cited document with its page or cell reference, and the evidence attached to each claim."
        meta={[
          `${pad(records, 3)} records`,
          `${pad(stats.citations, 2)} citations`,
          `${pad(stats.documents, 2)} documents`,
        ]}
      />

      <div className={styles.body}>
        <SearchView />
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Search', path: '/search/' },
        ])}
      />
    </div>
  );
}
