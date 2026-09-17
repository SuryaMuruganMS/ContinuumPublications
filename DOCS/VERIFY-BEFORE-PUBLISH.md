# Verify before publishing

Two lists. The first is configuration that is still carrying placeholder values.
The second is editorial: locators in Article #1 that were transcribed from the
approved draft and the evidence matrix, and should be read back against your own
copies of the source PDFs before the note is public.

---

## 1. Configuration placeholders

All of these live in **`content/site.ts`**.

| Field | Current placeholder | Action |
|---|---|---|
| `site.url` | `https://continuumpublications.org` | Replace with the real domain, or set `NEXT_PUBLIC_SITE_URL` at build time. Canonical URLs, the sitemap, robots and every social card read it. |
| `site.email.general` | `research@continuumpublications.org` | Replace with an address you monitor. |
| `site.email.corrections` | `corrections@continuumpublications.org` | Replace. This is the address the standards page tells readers to challenge claims at. |
| `site.email.documents` | `documents@continuumpublications.org` | Replace. |
| `site.email.subscribe` | `subscribe@continuumpublications.org` | Replace. Used by the newsletter fallback when no provider is configured. |
| `site.since` | `2025` | Confirm. Shown on `/about`. |

Also in **`scripts/generate-og.mjs`**: the footer rule on the default social card
prints `CONTINUUMPUBLICATIONS.ORG`. Update it when the domain changes, then run
`npm run og`.

---

## 2. Article #1 — locators to check

The **figures** below are from the approved final draft and the closed evidence
matrix. What needs a second pair of eyes is the **locators** — the printed page
numbers, table numbers, cell references and retrieval dates — because a citation
that names a document but not a checkable location inside it is not a citation.

Open `content/articles/irdai-health-claims-disallowed-row.ts` and work down the
`sources` array.

### Documented — annual reports

| Source | Locator as written | Check |
|---|---|---|
| `S1` | Table I.29 · printed page 43 (PDF index 274) | Printed page and PDF index in the 2024-25 report. |
| `S2` | Table I.29 · disallowed and repudiated columns · printed page 43 | Same page. Confirm the quoted header wording character for character. |
| `S3` | Table I.29 · disallowed column · printed page 43 (PDF index 254) | Printed page and PDF index in the 2023-24 report. |
| `S4` | Table I.29 · full row set · printed page 43 | 2023-24. Read every figure back cell by cell. |
| `S5` | Table I.29 · full row set · printed page 43 | 2024-25. Same. |
| `S6` | ¶I.6.5.5 · printed page 42 | The ₹28,910 average, 2024-25. |
| `S20` | Table I.11 · printed page 18 (PDF index 249) | The life death-claims table and both footnote definitions. |
| `S21` | ¶I.6.5.6 and Table I.29 · printed page 43 | 2023-24. |
| `S22` | Table I.27 · printed page 42 (PDF index 253) | 2023-24 incurred claims ratio, 103.38. |
| `S35` | Table I.28 · printed page 43 | 2023-24 settlement-mode figures. |
| `S37` | ¶I.6.5.5 · printed page 43 | 2023-24. **The matrix flags this one for cell-by-cell checking**, because it is a claim about a regulator's own error. |
| `S38` | ¶I.6.5.5 and Table I.28 · printed page 42 | 2024-25. |

### Documented — circular and returns annexure

| Source | Locator as written | Check |
|---|---|---|
| `S8` | Master Circular on Submission of Returns, IRDAI/General/CIR/93/06/2024, 14 June 2024 · index, health serials 91–99 | Reference number, date, serial range. |
| `S9` | Sheet `IRDAI_RET_196` · cells B16–B22 | Row labels and order, and the penal-interest row. |
| `S10` | Sheet `IRDAI_RET_194` · row 13 · disallowed at M13, code at M14 | **Load-bearing.** Confirm M13 and that no paired count column exists. |
| `S11` | Sheet `IRDAI_RET_197` · row 11 · N11 · repeats at rows 22, 32, 39 | Confirm all four occurrences. |
| `S12` | Sheet `IRDAI_RET_196` · headers row 14 · particular B19 · C14–P14 | **Load-bearing, and the strongest fact against the piece.** Confirm the seven count cells and that the copy examined is unfilled throughout. |
| `S13` | `RET_196` A66 · `RET_197` A46 | The both-mode reporting note. |
| `S14` | Sheet `IRDAI_RET_194` · cell A145 | The repudiation definition, quoted verbatim. |
| `S15` | Sheet `IRDAI_RET_196` · rows 37–49 · buckets B43–B48 | The ageing schedule. |
| `S16` | Sheet `IRDAI_RET_191` · cell A26 | The repudiation ratio, quoted verbatim. |
| `S42` | IRDAI/HLT/CIR/PRO/84/5/2024, 29 May 2024 · covering paragraphs C and D | Reference number and date. |

### Documented — the negative finding

`S19` states that the string `disallow` occurs **once** in the 416-page English
text of the 2024-25 report, **zero** times in the circular's 44 pages, and **ten**
times in the annexure, always as a field name; and that `denied`, `not payable`
and `deduct` occur zero times in the annexure. Re-run those searches. The editorial
standards require publishing the negative finding, which means it has to be right.

### Reported — media claims — RESOLVED 2026-09-17

Five reader-facing records cite two Business Standard articles. Both were
retrieved, checked and archived on 2026-09-17:

| Record | Article | Type | Status |
|---|---|---|---|
| `S17` | "Health insurers disallowed claims worth Rs 15,100 cr during FY24: Irdai" — 30 Dec 2024 | PTI | VERIFIED · ARCHIVED |
| `S18`, `S34`, `S44`, `S45` | "Health insurance claims rejection up 19.10% in FY24: Irdai report" — 27 Dec 2024 | Staff (Ayush Mishra) | VERIFIED · ARCHIVED |

**How this is enforced now.** Every `reported` source takes its publication,
headline, URL and retrieval date from `archive/sources/manifest.json` through
`fromMedia()` in `content/sources/media.ts`. That manifest is written only by
`npm run archive:sources`, which fetches each page and checks that its canonical
URL, headline, date, byline and every quoted excerpt match. A record that is not
`VERIFIED` stops the build with **ARCHIVE REQUIRED — PUBLICATION BLOCKED**, and
so does an extract that was not found on the page.

**Attribution conflict — resolved.** The 103.38 per cent settlement-ratio claim
(matrix C45) and the cashless sentence (C46) are attributed to Business Standard,
as in the approved draft. Retrieval confirmed both: 103.38 is in the 27 December
staff report, and the cashless sentence is in the 30 December PTI report. The
matrix previously attributed both to a Tier 4/5 aggregator; that attribution was
stale, has been corrected in the matrix, and the aggregator is recorded as
retired in `archive/sources/retired.json`. `npm run build` fails if the retired
source's name appears anywhere that ships.

**Still open.** Public Internet Archive snapshots. The Internet Archive was
offline when the sources were retrieved, so `wayback` is `null` in the manifest
and the drawer shows "Pending". Private snapshots of both pages are held in
`archive/sources/raw/` (not committed, not deployed) with their SHA-256 in the
manifest. Re-run `npm run archive:sources` once the Internet Archive is back; it
fills the field only with a snapshot URL the Internet Archive itself returns.

### Unresolved

`S32`, `S39`, `S40`, `S41` and `S43` each record a specific question and the
documents searched. Confirm the search lists describe what you actually
searched. These carry the same evidentiary weight as the documented rows.

### Not published, deliberately

The matrix marks two rows **do not publish**, and neither appears on the site:

- **C39**, the per-claim deduction figure. It depends on an assumption the
  documents do not support. The note says so in `the-boundary` section instead.
- **C41**, the Hindi edition terminology. Extraction is through a legacy
  non-Unicode font and is unreliable. Nothing about it appears anywhere.

If either is ever added, it needs a second adversarial pass first.

---

## 3. Dates

`article.published` is set to `2026-09-14`. Change it to the real publication
date before going live — it drives the article page, the research index, the
archive sort, the sitemap `lastmod` and the `datePublished` in the structured
data.

The `retrieved` dates on the sources (`2026-09-02`, `2026-09-03`, `2026-09-07`)
should be the dates you actually downloaded each document.

---

## 4. Final pass

```bash
npm run build
npm start
```

Then, on the built site:

- Open the article and click through every citation with the drawer's
  next/previous arrows. Each one should name a document and a location you could
  hand to someone else.
- Check the Evidence Index counts against the `sources` array.
- Confirm `/corrections` still reads *No corrections have been issued* and that
  this is true.
- Paste the article URL into a social card validator and confirm the card
  renders.
