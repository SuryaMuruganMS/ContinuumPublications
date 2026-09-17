/**
 * Site-wide configuration.
 *
 * ▸ EDIT THIS FILE to change the publication name, contact addresses, canonical
 *   domain, navigation, or footer. Nothing here is duplicated elsewhere.
 */

export const site = {
  name: 'Continuum Publications',
  shortName: 'Continuum',
  tagline: 'Independent research desk',
  /** Used under the wordmark and in the footer. */
  descriptor: 'Primary documents. Public data.',
  positioning:
    'An independent research desk that reads primary documents and public data, then reports what the evidence supports and what it does not.',
  description:
    'Continuum Publications is an independent research desk. We read primary documents and public data, then report what the evidence supports and what it does not.',

  /**
   * ▸ CANONICAL DOMAIN. Read by every canonical URL, the sitemap, robots.txt,
   *   Open Graph tags and JSON-LD `@id`/`url` fields — there is nowhere else
   *   this needs to be set. Overridable at build time with
   *   NEXT_PUBLIC_SITE_URL (no trailing slash) without editing this file;
   *   when a custom domain replaces the workers.dev one, set the env var (or
   *   update the fallback below) and redeploy.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://continuumpublications.suryamuruganms40.workers.dev'
  ).replace(/\/$/, ''),

  locale: 'en_IN',
  language: 'en',

  /**
   * ▸ CHANGE THESE to addresses you actually monitor. They are placeholders.
   *   They appear on /contact, /corrections and in the footer.
   */
  email: {
    general: 'research@continuumpublications.org',
    corrections: 'corrections@continuumpublications.org',
    documents: 'documents@continuumpublications.org',
    subscribe: 'subscribe@continuumpublications.org',
  },

  /** Founded / operating-since line used on /about and /colophon. */
  since: '2025',

  /**
   * Newsletter. If NEXT_PUBLIC_NEWSLETTER_ACTION is set the signup form POSTs
   * there. If it is empty the UI degrades to a plain email link, which works
   * on any static host with no service at all.
   */
  newsletter: {
    action: process.env.NEXT_PUBLIC_NEWSLETTER_ACTION || '',
    field: process.env.NEXT_PUBLIC_NEWSLETTER_FIELD || 'email',
    heading: 'Get the next Continuum investigation.',
    sub: 'One research note when we publish. No spam.',
  },
} as const;

export interface NavItem {
  label: string;
  href: string;
  /** Short description used in the command search. */
  hint?: string;
}

/** ▸ EDIT to change the primary navigation. */
export const primaryNav: NavItem[] = [
  { label: 'Research', href: '/research/', hint: 'Everything we have published' },
  { label: 'Archive', href: '/archive/', hint: 'Filterable index of the desk' },
  { label: 'Methods', href: '/methods/', hint: 'How a Continuum note is built' },
  { label: 'About', href: '/about/', hint: 'What this desk is, and is not' },
];

export const utilityNav: NavItem[] = [
  { label: 'Search', href: '/search/', hint: 'Articles, documents, regulators' },
  { label: 'Subscribe', href: '/subscribe/', hint: 'One note when we publish' },
];

/** ▸ EDIT to change the footer. Grouped by column. */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Research',
    items: [
      { label: 'Latest', href: '/research/' },
      { label: 'Archive', href: '/archive/' },
      { label: 'Search', href: '/search/' },
      { label: 'Subscribe', href: '/subscribe/' },
    ],
  },
  {
    heading: 'Accountability',
    items: [
      { label: 'Methods', href: '/methods/' },
      { label: 'Editorial standards', href: '/standards/' },
      { label: 'Corrections', href: '/corrections/' },
      { label: 'Colophon', href: '/colophon/' },
    ],
  },
  {
    heading: 'Desk',
    items: [
      { label: 'About', href: '/about/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'Privacy', href: '/privacy/' },
      { label: 'Terms', href: '/terms/' },
    ],
  },
];
