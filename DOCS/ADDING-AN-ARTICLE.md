# Adding an article

Publishing a note touches three files and no components.

---

## 1. Create the content file

```bash
cp content/articles/_TEMPLATE.ts content/articles/my-new-note.ts
```

The template is annotated field by field. The parts that matter:

**`slug`** becomes the URL: `/articles/my-new-note/`. It is permanent — people
link to it, and the corrections ledger references it. Choose it once.

**`index`** is the archive number, displayed zero-padded as `0002`. Use the next
integer after the last published note.

**`sections[].blocks`** is the body. Block types:

| Type | Use |
|---|---|
| `p` | A paragraph. |
| `list` | Bulleted, or `ordered: true` for a numbered list with mono counters. |
| `pull` | A pull quote. The sentence the piece turns on. |
| `quote` | A blockquote with an attribution. |
| `note` | A boxed aside. For caveats and scope limits, never decoration. |
| `claim` | A published figure judged against the primary document. Carries a verdict: `correct`, `ambiguous`, `misleading`, `incorrect`. |
| `visual` | An interactive figure, by registry key. |
| `h` | A sub-heading inside a section. |
| `divider` | A rule. |

**Inline markup**, and there is no more than this:

```
[[S4]]        an interactive evidence reference, bound to sources[].id
*emphasis*    italic
`18,521.02`   a figure lifted from a document, set in mono
```

---

## 2. Register it

`content/articles/index.ts`:

```ts
import { article as myNewNote } from './my-new-note';

const registry: Article[] = [myNewNote, irdaiHealthClaims];
```

Order does not matter — the helpers sort by publication date.

This single line is what makes the note appear in: the research index, the
archive and its facet counts, the search index, the sitemap, related research on
other notes, the homepage feature and archive preview, and the desk statistics
in the footer and on the opening frame.

---

## 3. Add the social card

`scripts/generate-og.mjs`, in the `articles` array near the bottom:

```js
{
  slug: 'my-new-note',
  index: 'NOTE 0002',
  figure: '₹0.00',
  counterFigure: '0.00 lakh',
  label: 'REGULATOR · TABLE X.XX',
  title: 'The headline, as in the content file',
},
```

Then:

```bash
npm run og
```

The card is written to `public/og/my-new-note.png` and picked up automatically
by `articleMeta()` in `lib/seo.tsx`. `npm run build` regenerates all cards, so
this step is only needed when you want to see the result before a full build.

---

## The evidence array

This is the part that carries the publication's weight, so it is worth being
slow about.

Each source needs:

- **`id`** — short and stable (`S1`, `S2`). Cited inline as `[[S1]]`. Never
  renumber a published note's sources; people deep-link to them with
  `?evidence=S1`.
- **`kind`** — one of `documented`, `calculated`, `analysis`, `reported`,
  `unresolved`.
- **`publisher`** and **`document`** — who issued it and which document.
- **`locator`** — the page, table, sheet or cell. **Required in practice.** A
  citation that names a document but not a location inside it is not a citation.
- **`establishes`** — one sentence saying what this source proves, and only
  that. Not what the article concludes from it.
- **`working`** — for `calculated`, the arithmetic written out so a reader can
  repeat it. For `unresolved`, where you looked. For `reported`, how the
  published wording stands up. For `documented`, what it does *not* prove.
- **`assessment`** — `reported` sources only.
- **`quote`**, **`url`**, **`retrieved`** — where they apply.

The counts in the Evidence Index, the homepage totals and the research index are
all grouped from this array. Nothing is hand-counted, so adding a source moves
every number on the site that describes it.

---

## Adding a new interactive visual

1. Put the figures in a new file under `content/data/`. Components read data;
   they never contain it.
2. Build the component in `components/visuals/`, wrapping it in `FigureShell`
   so it gets the same label, title, controls slot, caption and source line as
   the others.
3. Add its key to `VisualKey` in `types/content.ts`.
4. Register it in `components/visuals/registry.tsx`.
5. Reference it from the article:

```ts
{ type: 'visual', component: 'your-key', caption: 'What the reader is looking at.' }
```

Three things the existing visuals do that a new one should too:

- **Animate the argument, not the arrival.** In Figure 01 switching years re-runs
  the count so the reader watches the amount move while the count stays where it
  is. That is the finding, performed.
- **Mark what is ours.** A derived value is labelled *calculated* in the figure
  itself, never rendered in the same register as a figure printed by the source.
- **Degrade honestly.** A cell with no extracted value renders as a dimmed,
  inert slot with a legend saying it is in the source and not reproduced —
  rather than as a zero.

---

## Issuing a correction

`content/corrections.ts`:

```ts
export const corrections: Correction[] = [
  {
    id: 'C-2026-001',
    articleSlug: 'my-new-note',
    articleTitle: 'The headline',
    date: '2026-02-01',
    published: 'The sentence exactly as it was published.',
    corrected: 'The sentence exactly as it reads now.',
    reason: 'What was wrong, in plain words.',
    source: 'How it came to light, including who raised it.',
    severity: 'factual',
  },
];
```

Adding the entry publishes it to `/corrections` with the original wording struck
through beside the new one, puts a dated notice at the top of the article, flips
that article's status to `corrected` in the archive, and updates the correction
count in the footer.

Then change the sentence in the article file. The ledger is what makes the
change legible; editing the prose without logging it is the thing the standards
page promises not to do.
