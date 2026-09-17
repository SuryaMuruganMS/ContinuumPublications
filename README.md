# Continuum Publications

An independent research desk that reads primary documents and public data, then
reports what the evidence supports and what it does not.

This repository is the complete public website: a statically exported Next.js
site with no server, no database and no third-party scripts at runtime.

---

## Contents

- [Run it locally](#run-it-locally)
- [Deploy it for free](#deploy-it-for-free)
- [Add Article #2](#add-article-2)
- [Where to edit what](#where-to-edit-what)
- [Environment variables](#environment-variables)
- [File tree](#file-tree)
- [Before you publish](#before-you-publish)

---

## Run it locally

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

Other scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload. |
| `npm run build` | Generates the social cards, then builds and exports the whole site to `out/`. |
| `npm start` | Serves the built `out/` directory locally, exactly as a host would. |
| `npm run typecheck` | TypeScript, no emit. |
| `npm run lint` | Next's ESLint pass. |
| `npm run og` | Regenerates the Open Graph cards only. |
| `npm run archive:sources` | Fetches every cited news article, checks headline, date, byline and each quoted excerpt, and records a hashed snapshot. |
| `npm run audit:sources` | Checks that notes, the source manifest and the retired-source list agree. Runs before every build; a built-site check runs after. |

`npm run build` writes a fully static site into `out/`. Every page is a file.
There is nothing to run on a server.

---

## Deploy it for free

The build output is plain static files, so every host below works on its free
tier. Set `NEXT_PUBLIC_SITE_URL` to your real domain first — canonical URLs, the
sitemap and the social cards all read it.

### Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project**, and import it.
3. Framework preset **Next.js**. Build command `npm run build`, output directory
   `out`.
4. Add the environment variable `NEXT_PUBLIC_SITE_URL`.
5. Deploy.

### Netlify

`netlify.toml` in the repository root already sets the build command, the
publish directory and the 404 handling. So:

1. Push to GitHub.
2. In Netlify, **Add new site → Import an existing project**.
3. Leave the detected settings alone.
4. Add `NEXT_PUBLIC_SITE_URL` under **Site settings → Environment variables**.
5. Deploy.

### Cloudflare (Workers)

`wrangler.jsonc` serves `out/` as static assets, with `404.html` for unknown
paths and trailing-slash URLs. In **Workers & Pages → Create → Import a
repository**:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Project name: `continuumpublications` (must match `name` in `wrangler.jsonc`)

Add `NEXT_PUBLIC_SITE_URL` as a **build** variable, then redeploy.

### Cloudflare Pages

1. Push to GitHub.
2. **Workers & Pages → Create → Pages → Connect to Git**.
3. Framework preset **None**. Build command `npm run build`. Build output
   directory `out`.
4. Add `NEXT_PUBLIC_SITE_URL` under **Settings → Environment variables**.
5. Deploy.

`public/_headers` is picked up automatically by Netlify and Cloudflare Pages and
sets the security and caching headers.

### GitHub Pages

1. `npm run build`.
2. Publish the `out/` directory to the `gh-pages` branch (for example with
   `npx gh-pages -d out`).
3. In **Settings → Pages**, serve from that branch.

A `.nojekyll` file is emitted into `out/` so GitHub does not strip the `_next`
directory.

### Anywhere else

Upload `out/` to any static host — S3, Render, Surge, a plain nginx box. The
only requirement is that `404.html` is served for unknown paths, which every
host above does by default.

---

## Add Article #2

Three steps, and no component changes.

**1. Write the content file.** Copy the template:

```bash
cp content/articles/_TEMPLATE.ts content/articles/my-new-note.ts
```

Fill in the object. Prose lives in `sections[].blocks`. Citations are inline
tokens: `[[S4]]` renders an interactive evidence reference bound to the source
with `id: 'S4'`.

**2. Register it.** In `content/articles/index.ts`:

```ts
import { article as myNewNote } from './my-new-note';

const registry: Article[] = [myNewNote, irdaiHealthClaims];
```

**3. Add its social card.** In `scripts/generate-og.mjs`, add an entry to the
`articles` array with the slug and the two figures the note turns on, then run
`npm run og`.

That is the whole job. Routing, the research index, the archive and its facets,
search, the sitemap, related research, the evidence counts and the footer
statistics all derive from the registry.

### The evidence states

Every claim resolves to one of five, defined in `content/evidence-states.ts`:

| State | Means |
|---|---|
| `documented` | A primary source says it, at a citable locator. |
| `calculated` | Our arithmetic on documented figures. The working is printed. |
| `analysis` | Our reading of documented material. Contestable. |
| `reported` | A secondary source published it. Evidence of publication only. |
| `unresolved` | We looked and did not find it. |

The counts in the Evidence Index, on the homepage and on `/research` are grouped
from each article's own `sources` array. They are never typed in by hand, so
they cannot drift away from the claims they describe.

---

## Where to edit what

| You want to change | Edit |
|---|---|
| **Colours** | `styles/tokens.css`. Every colour on the site is a custom property defined there; no hex value appears anywhere else. |
| **Typography** | Families are bound in `app/layout.tsx` via `next/font`. The scale, the reading size and the line height are in `styles/tokens.css`. |
| **Article content** | `content/articles/<slug>.ts`. |
| **Article figures** | `content/data/table-i29.ts`, `content/data/returns.ts`, `content/data/settlement-modes.ts`. The interactive visuals read these; changing a number changes the figure with no component edit. |
| **Sources and evidence** | The `sources` array inside the article file. |
| **News sources (`reported`)** | `archive/sources/manifest.json`, then `npm run archive:sources`. Article files reference a record with `fromMedia('key')` and cannot set a news URL by hand. |
| **Corrections** | `content/corrections.ts`. Adding an entry publishes it to `/corrections`, puts a notice on the article, and flips that article's status to `corrected`. |
| **Navigation and footer** | `content/site.ts` (`primaryNav`, `utilityNav`, `footerNav`). |
| **Publication name, contact addresses, domain** | `content/site.ts`. |
| **Social metadata** | `lib/seo.tsx` for the tags; `scripts/generate-og.mjs` for the card artwork. |
| **Evidence states** | `content/evidence-states.ts`, plus the `--ev-*` tokens in `styles/tokens.css`. |
| **Prose styling** | `styles/prose.css`. |
| **A new interactive visual** | Build the component, add its key to `VisualKey` in `types/content.ts`, register it in `components/visuals/registry.tsx`, then reference it from an article as `{ type: 'visual', component: 'your-key' }`. |

---

## Environment variables

All optional. The site builds and runs with none of them set.

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://continuumpublications.suryamuruganms40.workers.dev` | Canonical origin for canonical URLs, the sitemap, robots and Open Graph. Overrides the fallback in `content/site.ts` — set this when deploying to a different domain. No trailing slash. |
| `NEXT_PUBLIC_NEWSLETTER_ACTION` | empty | A form POST endpoint for the newsletter — Buttondown, Listmonk, MailerLite, Formspree, ConvertKit, anything accepting a plain form POST. When empty, the signup UI degrades to a working email link rather than a button that does nothing. |
| `NEXT_PUBLIC_NEWSLETTER_FIELD` | `email` | The email field name your provider expects. Buttondown uses `email`; ConvertKit uses `email_address`. |

Copy `.env.example` to `.env.local` for development.

---

## File tree

```
.
├── app/
│   ├── layout.tsx                     Root layout, fonts, metadata, JSON-LD
│   ├── page.tsx                       Homepage
│   ├── not-found.tsx                  404 (exported as 404.html)
│   ├── sitemap.ts                     Static sitemap.xml
│   ├── robots.ts                      Static robots.txt
│   ├── articles/
│   │   ├── page.tsx                   Index of notes
│   │   └── [slug]/page.tsx            The article system
│   ├── research/page.tsx              Research index
│   ├── archive/page.tsx               Filterable archive
│   ├── search/page.tsx                Full search page
│   ├── methods/page.tsx               How a note is built
│   ├── standards/page.tsx             Editorial standards
│   ├── corrections/page.tsx           Corrections ledger
│   ├── about/page.tsx                 About the desk
│   ├── contact/page.tsx               Contact composer
│   ├── subscribe/page.tsx             Newsletter
│   ├── colophon/page.tsx              How the site is built
│   ├── privacy/page.tsx
│   └── terms/page.tsx
│
├── components/
│   ├── article/                       Article layout and the evidence system
│   │   ├── EvidenceProvider.tsx       Drawer state, isolation, deep links
│   │   ├── CitationRef.tsx            The inline [[S1]] marker
│   │   ├── EvidenceDrawer.tsx         The citation drawer
│   │   ├── EvidenceIndex.tsx          The Evidence Index rail
│   │   ├── SectionNav.tsx             Section navigator and reading progress
│   │   ├── ArticleBody.tsx            Block renderer
│   │   ├── SourcesList.tsx            Full chain of evidence
│   │   └── ShareBar.tsx
│   ├── visuals/                       The interactive figures
│   │   ├── TableI29.tsx               Figure 01 — the table, two editions
│   │   ├── ReturnsStructure.tsx       Figure 02 — field structure
│   │   ├── NumberVsAmount.tsx         Figure 03 — number against amount
│   │   ├── FigureShell.tsx            Shared figure chrome
│   │   └── registry.tsx               Key → component
│   ├── home/                          Homepage sections
│   ├── archive/ArchiveBrowser.tsx     Faceted filtering
│   ├── search/SearchView.tsx          Search page
│   └── site/                          Nav, footer, newsletter, page chrome
│
├── content/                           ALL EDITABLE CONTENT
│   ├── site.ts                        Name, domain, addresses, navigation
│   ├── evidence-states.ts             The five states and their standards
│   ├── corrections.ts                 The corrections ledger
│   ├── articles/
│   │   ├── index.ts                   The registry and all derived queries
│   │   ├── _TEMPLATE.ts               Copy this for a new note
│   │   └── irdai-health-claims-disallowed-row.ts
│   └── data/                          Figures behind the visuals
│
├── hooks/useMotion.ts                 Reveal, scroll spy, count-up, focus trap
├── lib/
│   ├── rich-text.tsx                  Inline citation / emphasis renderer
│   ├── search.ts                      The search index
│   ├── seo.tsx                        Metadata and structured data
│   └── format.ts                      Indian digit grouping, dates
├── styles/
│   ├── tokens.css                     ▸ ALL COLOURS AND THE TYPE SCALE
│   ├── base.css                       Reset, primitives, motion
│   └── prose.css                      The reading column
├── scripts/generate-og.mjs            Builds the social cards as real PNGs
├── public/og/                         Generated social cards
├── DOCS/
│   ├── ADDING-AN-ARTICLE.md
│   └── VERIFY-BEFORE-PUBLISH.md
├── netlify.toml
└── next.config.mjs
```

---

## Before you publish

Read **`DOCS/VERIFY-BEFORE-PUBLISH.md`**. It lists the document locators in
Article #1 that must be checked against your own copies of the source PDFs, and
the placeholder values in `content/site.ts` that must be replaced with real
ones — the domain and the four email addresses.

---

## Technical notes

- **Static export.** `output: 'export'` in `next.config.mjs`. No server runtime,
  no serverless functions, no revalidation.
- **No runtime third parties.** Fonts are self-hosted by `next/font` at build
  time. There is no analytics, no tag manager, no embed and no font CDN.
- **Motion.** CSS transitions driven by one shared `IntersectionObserver`, with
  counters on `requestAnimationFrame`. No animation library. Everything resolves
  to its final state under `prefers-reduced-motion`, and the footer carries a
  reader-facing motion toggle that persists locally.
- **Accessibility.** Semantic landmarks, a skip link, visible orange focus rings
  that are never removed, real tables with scopes, tablists with arrow-key
  support, focus traps in the drawer and the search overlay, and live regions on
  every filtered result count. Every text colour clears WCAG AA (4.5:1) against
  every surface in the ground ramp.
- **Bundle.** Roughly 102 kB of shared JavaScript; the article page, the heaviest
  route, is about 124 kB on first load.
