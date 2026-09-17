import type { MetadataRoute } from 'next';

import { getAllArticles } from '@/content/articles';
import { site } from '@/content/site';

/**
 * Emitted as a static /sitemap.xml at build time.
 * Adding a note adds its URL here automatically.
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const latest = articles[0]?.updated ?? articles[0]?.published ?? new Date().toISOString();

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; lastModified: string }[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly', lastModified: latest },
    { path: '/research/', priority: 0.9, changeFrequency: 'weekly', lastModified: latest },
    { path: '/archive/', priority: 0.8, changeFrequency: 'weekly', lastModified: latest },
    { path: '/search/', priority: 0.4, changeFrequency: 'monthly', lastModified: latest },
    { path: '/methods/', priority: 0.7, changeFrequency: 'yearly', lastModified: latest },
    { path: '/standards/', priority: 0.7, changeFrequency: 'yearly', lastModified: latest },
    { path: '/corrections/', priority: 0.7, changeFrequency: 'weekly', lastModified: latest },
    { path: '/about/', priority: 0.6, changeFrequency: 'yearly', lastModified: latest },
    { path: '/contact/', priority: 0.5, changeFrequency: 'yearly', lastModified: latest },
    { path: '/subscribe/', priority: 0.5, changeFrequency: 'monthly', lastModified: latest },
    { path: '/colophon/', priority: 0.3, changeFrequency: 'yearly', lastModified: latest },
    { path: '/privacy/', priority: 0.3, changeFrequency: 'yearly', lastModified: latest },
    { path: '/terms/', priority: 0.3, changeFrequency: 'yearly', lastModified: latest },
  ];

  return [
    ...pages.map((page) => ({
      url: `${site.url}${page.path}`,
      lastModified: new Date(page.lastModified),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...articles.map((article) => ({
      url: `${site.url}/articles/${article.slug}/`,
      lastModified: new Date(article.updated ?? article.published),
      changeFrequency: 'monthly' as const,
      priority: 0.95,
    })),
  ];
}
