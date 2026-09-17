import type { Metadata, Viewport } from 'next';
import { Archivo, Source_Serif_4, JetBrains_Mono } from 'next/font/google';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/prose.css';

import { Nav } from '@/components/site/Nav';
import { Footer } from '@/components/site/Footer';
import { RevealRoot } from '@/components/site/RevealRoot';
import { site } from '@/content/site';
import { absoluteUrl, DEFAULT_OG, JsonLd, organisationSchema, websiteSchema } from '@/lib/seo';

/**
 * ▸ EDIT TYPOGRAPHY HERE.
 * Three faces, each with a job:
 *   Archivo         — headlines and interface. An editorial grotesk.
 *   Source Serif 4  — the reading column. Long-form on screen.
 *   JetBrains Mono  — data, locators, index numbers, evidence markers.
 * next/font self-hosts these at build time: no external requests at runtime,
 * no layout shift, nothing for a reader to accept a cookie for.
 */
const sans = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s`,
  },
  description: site.description,
  applicationName: site.name,
  generator: 'Next.js',
  referrer: 'strict-origin-when-cross-origin',
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG),
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [absoluteUrl(DEFAULT_OG)],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },
  category: 'news',
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.language} className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        {/* Restore the reader's motion preference before first paint, so the
            toggle never flashes the wrong state. Tiny, synchronous, no deps. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('continuum:motion')==='off'){document.documentElement.dataset.motion='off'}}catch(e){}`,
          }}
        />
        {/* Reveal animations start hidden. If JS never runs, show everything. */}
        <noscript>
          <style>{`[data-reveal],[data-reveal-mask],[data-reveal-line]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a className="u-skip" href="#main">
          Skip to content
        </a>

        <RevealRoot />
        <Nav />

        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <Footer />

        <JsonLd data={[organisationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
