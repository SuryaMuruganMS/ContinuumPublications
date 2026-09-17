import type { Article } from '@/types/content';
import { fromMedia } from '@/content/sources/media';

/**
 * ARTICLE #1
 *
 * Body text is the approved final draft (article-1-FINALmax.md), transcribed
 * into the site's block structure. The bracketed source references in that
 * draft are bound here to the evidence matrix as inline `[[S..]]` tokens, so
 * every citation in the running text opens the matrix row behind it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EDITING THIS FILE
 * ─────────────────────────────────────────────────────────────────────────
 * Prose lives in `sections[].blocks`. `[[S4]]` renders an interactive evidence
 * reference bound to `sources` below. `*emphasis*` and `` `figures` `` are the
 * only other markup the renderer understands.
 *
 * The Evidence Index counts on the article page are derived by grouping
 * `sources` by `kind`. They are never typed in by hand.
 *
 * Evidence-matrix row IDs (C01, C43 …) are recorded in each source's
 * `internalRef`, so the site can be reconciled against the matrix row by row.
 * `internalRef` is never rendered and never indexed. Readers see S-numbers only.
 *
 * Every `reported` source draws its publication, headline, URL and retrieval
 * date from archive/sources/manifest.json through `fromMedia()`. None of those
 * fields may be typed by hand; the build fails if a record is not VERIFIED.
 */
export const article: Article = {
  slug: 'irdai-health-claims-disallowed-row',
  index: 1,
  status: 'published',

  title:
    "IRDAI's health claims table prints ₹18,521 crore against a disallowed count of 0.00 lakh",

  deck:
    'The health claims table prints the disallowed row as 0.00 lakh claims and ₹18,521.02 crore, in both of the years examined. The three health returns behind it do not treat the field consistently. What the amount represents is documented nowhere we looked.',

  summary:
    'IRDAI’s health claims table reports claims disallowed as an amount with a count of 0.00 lakh, in both 2023-24 and 2024-25. The table reconciles either way. Two of the three health returns give the field an amount and no count, while the third — the one whose rows match the published table — carries count cells and was blank. IRDAI defines the term nowhere we looked, and coverage has added the disallowed amount to the repudiation figure to produce a ₹26,000 crore composite.',

  published: '2026-09-14',
  readingTime: 11,

  topics: [
    'Health insurance',
    'Regulatory disclosure',
    'Claims data',
    'Claim tracing',
  ],
  regulators: ['IRDAI'],

  documents: [
    {
      id: 'D1',
      title: 'Annual Report 2024–25',
      publisher: 'IRDAI',
      type: 'Annual report',
      year: '2024–25',
      url: 'https://irdai.gov.in/annual-reports',
    },
    {
      id: 'D2',
      title: 'Annual Report 2023–24',
      publisher: 'IRDAI',
      type: 'Annual report',
      year: '2023–24',
      url: 'https://irdai.gov.in/annual-reports',
    },
    {
      id: 'D3',
      title: 'Master Circular on Submission of Returns, 2024',
      publisher: 'IRDAI',
      type: 'Circular',
      year: '2024',
      url: 'https://irdai.gov.in/',
    },
    {
      id: 'D4',
      title: 'Returns annexure — health returns RET_191 to RET_197',
      publisher: 'IRDAI',
      type: 'Regulatory return',
      year: '2024',
    },
  ],

  findings: [
    'The disallowed row carries a count of 0.00 lakh in both 2023-24 and 2024-25, against ₹15,100.42 crore and ₹18,521.02 crore. The percentage brackets print (0) by number and (12.90) and (13.98) by amount.',
    'Both columns of the table reconcile to their printed totals — the number column with zero in the disallowed cell, exactly and with no residual in 2023-24.',
    'In two of the three health returns that carry the field, disallowed appears as an amount with no count, while paid, repudiated and outstanding each carry both. The third, RET_196, does provide count cells at that row, and the copy examined was blank.',
    'No prose definition of “claims disallowed” appears in either annual report, the returns circular, or the returns annexure. The word occurs once in the 416-page English text of the 2024-25 report, in the column header itself.',
  ],

  openQuestions: [
    'Which claims the disallowed amount relates to — whether it arises only on settled claims, or on repudiated and outstanding ones too.',
    'Why the report prints 0.00 and (0) rather than a blank or a dash.',
    'Whether the annual report compiles the published row from RET_196 alone or aggregates across returns.',
    'Whether the health disallowed column is related to the life “claims rejected” column, in either direction.',
    'What the body of the Master Circular on Health Insurance Business says, which was not available in full.',
  ],

  social: {
    figure: '₹18,521 CRORE',
    counterFigure: '0.00 LAKH',
    label: 'IRDAI HEALTH CLAIMS',
  },

  /* ---------------------------------------------------------------- */
  /* Body — approved final draft                                       */
  /* ---------------------------------------------------------------- */

  sections: [
    {
      id: 'the-table',
      nav: 'The table',
      kicker: 'The document',
      title: 'Seven columns, each split into a number and an amount',
      blocks: [
        {
          type: 'p',
          text: 'Table I.29 sits on printed page 43 of IRDAI’s Annual Report 2024-25, under the title “Status of Claims under Health Insurance of General and Health Insurers”. Seven columns cross it. Each is split into a number, in lakhs, and an amount, in ₹ crore. [[S1]]',
        },
        {
          type: 'p',
          text: 'The fifth column is headed “Claims disallowed as per terms and conditions of policy contract”. For 2024-25 it reports `0.00` lakh claims against `₹18,521.02 crore`. Beside it stands “Claims repudiated during the period”, reporting `29.51` lakh claims and `₹11,412.42 crore`. A note beneath the table reads: “Figures in brackets are percentage to total.” The bracket under the disallowed count prints `(0)`. Under the disallowed amount it prints `(13.98)`. [[S2]]',
        },
        {
          type: 'note',
          label: 'One thing to hold on to',
          text: 'Claim numbers in this table are given in lakhs, to two decimal places. So `0.00` lakh is what the table prints at that precision. It is not, on its own, a statement that the underlying count was exactly zero.',
        },
        {
          type: 'p',
          text: 'The previous year’s report does the same thing. For 2023-24 the disallowed column reports `0.00` lakh and `₹15,100.42 crore`. [[S3]]',
        },
        {
          type: 'p',
          text: 'That second figure has been quoted widely. Business Standard, carrying Press Trust of India copy, reported it as claims disallowed on 30 December 2024. Three days earlier the same paper had added it to the repudiation figure, producing a composite of roughly `₹26,000 crore` under a headline about claims rejection. [[S17]] [[S18]] Before either can be weighed, the table itself has to be read.',
        },
        {
          type: 'visual',
          component: 'table-i29',
          caption:
            'Table I.29 in both editions examined, as printed — and the reconciliation we ran across it.',
        },
      ],
    },

    {
      id: 'the-two-columns',
      nav: 'The two columns',
      kicker: 'Arithmetic',
      title: 'The two columns',
      blocks: [
        {
          type: 'p',
          text: 'The table is a flow statement. Outstanding claims at the start, plus new claims registered, give total claims, and the remaining columns account for that total. The number and amount columns each do this on their own.',
        },
        {
          type: 'p',
          text: 'For 2023-24 both close exactly, at the precision the table is printed to. On the number side, `17.85` plus `307.87` lakh gives the printed total of `325.72` lakh. The four disposal rows — `268.59`, `0.00`, `36.40` and `20.73` lakh — return the same figure. On the amount side, `₹6,290.28 crore` plus `₹1,10,825.06 crore` gives `₹1,17,115.34 crore`, and `₹83,493.17` + `₹15,100.42` + `₹10,937.18` + `₹7,584.57 crore` returns that too. [[S4]] These are our sums, from IRDAI’s printed values. [[S24]]',
        },
        {
          type: 'p',
          text: '2024-25 behaves the same way to within a hundredth. On the number side, `20.73` plus `351.85` gives the printed total of `372.58` lakh, while the four disposal rows come to `372.59`. On the amount side, both routes give `₹1,32,487.80 crore` against a printed `₹1,32,487.81 crore`. [[S5]] Those `0.01` gaps are rounding. [[S23]]',
        },
        {
          type: 'p',
          text: 'So the number column reaches its printed total with `0.00` in the disallowed cell, and needs nothing more at that precision. The amount column reaches its total only with `₹18,521.02 crore` included. Each column of percentages sums to `100.00`, with `(0)` in one and `(13.98)` in the other. [[S25]] One further check holds: the paid amount divided by the paid count, `₹94,247.60 crore` over `326.01` lakh, gives `₹28,909`, and paragraph I.6.5.5 states an average of `₹28,910` per claim. [[S6]] [[S26]]',
        },
        {
          type: 'pull',
          text: 'None of this establishes what “disallowed” means. It establishes that the table is internally consistent with 0.00 in that cell.',
        },
        {
          type: 'p',
          text: 'None of this establishes what “disallowed” means. It establishes that the table is internally consistent with `0.00` in that cell, in both years examined, and that the two columns are not partitioning the same quantity.',
        },
        {
          type: 'p',
          text: 'The two tables are built identically: same number, same title, same seven columns in the same order, same footnote, and the disallowed header word for word the same in both. [[S7]] The years also join up. Outstanding claims at the end of 2023-24 stood at `20.73` lakh and `₹7,584.57 crore`, against `20.73` lakh and `₹7,584.58 crore` at the start of 2024-25. [[S27]]',
        },
      ],
    },

    {
      id: 'the-return',
      nav: 'The return',
      kicker: 'Structure',
      title: 'The return behind the table',
      blocks: [
        {
          type: 'p',
          text: 'Insurers do not fill in the annual report. They file returns. Those returns are listed in IRDAI’s Master Circular on Submission of Returns of 14 June 2024, which points to a health department annexure for serial numbers 91 to 99. [[S8]] The annexure is a spreadsheet. Its formats are where the fields are specified.',
        },
        {
          type: 'p',
          text: 'One of them is RET_196, covering claims handled in-house and through third-party administrators. It carries the same rows as Table I.29, in the same order: outstanding at the beginning, new claims registered, claims paid, claims disallowed, claims repudiated, outstanding at the end. It adds a row for penal interest paid that the annual report does not carry. [[S9]]',
        },
        {
          type: 'p',
          text: 'Two other returns specify their columns individually rather than as a grid, and that is where a difference shows. In RET_194, the annual state-wise return, claims paid gets a count column and an amount column for each mode of settlement. So do claims repudiated. So do claims outstanding. Claims disallowed gets one column, and it is an amount. [[S10]] RET_197, filed quarterly, is built the same way. [[S11]]',
        },
        {
          type: 'pull',
          text: 'In those two returns there is no field in which an insurer could enter a number of disallowed claims.',
        },
        {
          type: 'p',
          text: 'RET_196 is not built that way, and the difference matters. It is a generic grid — particulars down the side, alternating count and amount columns across the top — so number-of-claims cells do exist at the disallowed row. Seven of them, covering six settlement-mode splits and a total. [[S12]]',
        },
        {
          type: 'p',
          text: 'The copy examined is an unfilled template, with no data anywhere in it. Those cells are blank because nothing in the form is. Their blankness is not evidence that a count has been omitted, and no instruction in the sheet specifies what belongs in them.',
        },
        {
          type: 'p',
          text: 'One instruction in the same sheet bears on the general question, though not on that row. A note at the foot of RET_196, repeated in RET_197, covers claims paid in both cashless and reimbursement mode: the amounts go under the respective heads, the number under cashless. [[S13]] That establishes one thing precisely. Where a claim is settled through both modes, its money is reported under two columns while its count goes under one. Whether that logic extends from settlement modes to the disposition rows is our inference, not the note’s, and it says nothing about what the disallowed row records. [[S28]]',
        },
        {
          type: 'p',
          text: 'The same annexure supplies a definition, though not of the term in question. A note in RET_194 states that the number of claims repudiated means where a claim is rejected in full. [[S14]] Repudiation also carries an ageing schedule, with buckets for claims repudiated within a month, within one to three months, and so on. [[S15]] It carries a published ratio: repudiated claims over outstanding claims at the beginning plus claims registered. [[S16]] Disallowed carries neither.',
        },
        {
          type: 'visual',
          component: 'returns-structure',
          caption:
            'Field structure at each claims row in the three health returns examined, and the apparatus attached to each outcome.',
        },
        {
          type: 'p',
          text: 'Two of these facts pull against each other. The return whose row sequence corresponds to Table I.29 is RET_196, and RET_196 provides number cells at the disallowed row. The returns that give disallowed an amount and no count, RET_194 and RET_197, collect state-wise and quarterly figures; they are not the forms whose rows the published table reproduces. So those two cannot establish on their own that health disallowance has no claim-level count. What they do establish is that IRDAI has specified amount-only disallowed fields in two health returns while giving paid, repudiated and outstanding a count in the same forms. The three returns show an architecture that does not treat the field uniformly. They do not settle what it means. [[S29]]',
        },
        {
          type: 'p',
          text: 'Repudiation, by contrast, is a claim-level outcome, defined as rejection in full in the RET_194 note alone.',
        },
        {
          type: 'p',
          text: 'What is not there matters as much. No prose definition of “claims disallowed” appears in either annual report, in the returns circular, or in the annexure. In the 416-page English text of the 2024-25 report, the word occurs once, in the column header itself. [[S19]] The reading above rests on how the reporting forms are built, not on anything IRDAI has written down.',
        },
      ],
    },

    {
      id: 'the-case-against',
      nav: 'The case against',
      kicker: 'Counter-argument',
      title: 'The case against this reading',
      blocks: [
        {
          type: 'p',
          text: 'The strongest objection sits in the same annual report, twenty-five pages earlier.',
        },
        {
          type: 'p',
          text: 'Table I.11, on printed page 18, covers death claims of life insurers. It carries two separate counted columns: claims repudiated and claims rejected. In individual business the two stand at `10,494` and `6,839` policies, each with its own amount and percentage. Footnotes define both. Claims rejected are those that cannot be considered due to policy terms and conditions. Claims repudiated are those that cannot be considered under section 45 of the Insurance Act, 1938. [[S20]]',
        },
        {
          type: 'p',
          text: 'Both of those life columns are reported by number and by amount. Neither is an amount without a count. So on the life side, wording very close to the health table’s disallowed header describes an outcome counted at claim level. If the health column carries a similar meaning, the zero would be an unreported count rather than a design feature, and a composite that adds disallowed to repudiated would be defensible. Set alongside RET_196, which carries number cells at the disallowed row, that is the strongest alternative reading visible in the documents examined. RET_196 leaves the possibility open on its face: the cells exist, and because the form is blank throughout, nothing in it rules out that a count is intended.',
        },
        {
          type: 'p',
          text: 'One detail complicates the analogy. In individual life business the rejected column covers `6,839` policies and `₹19 crore`, against `10,494` policies and `₹958 crore` repudiated. [[S20]] On the life side the terms-and-conditions category is the small one; health disallowance, at `₹18,521.02 crore`, is larger than health repudiation. That is our reading of the printed figures. [[S30]] It cuts against a clean mapping between the tables rather than against the objection itself.',
        },
        {
          type: 'p',
          text: 'Three things sit against the objection, and they are narrower than it. The health returns contain no field called rejected. Where the life table splits full non-consideration into two counted buckets, RET_194 assigns rejection in full to repudiated, leaving no counterpart. And in the two returns where columns were specified one by one, a count was created for paid, repudiated and outstanding, and not for disallowed. [[S31]]',
        },
        {
          type: 'p',
          text: 'None of that settles it. Whether the health and life terminology are related is not established here. The wording is close; the reporting architectures are not the same; and the documents examined do not say how, or whether, the two systems correspond. [[S32]]',
        },
      ],
    },

    {
      id: 'figures-in-circulation',
      nav: 'In circulation',
      kicker: 'Claim tracing',
      title: 'The figures in circulation',
      blocks: [
        {
          type: 'p',
          text: 'Four figures from the 2023-24 report ran in two Business Standard articles that December. They do not all fail, and not in the same way.',
        },
        {
          type: 'claim',
          figure: '₹15,100 crore, or 12.9 per cent of the total claims filed',
          attribution: 'Press Trust of India copy carried by Business Standard, 30 December 2024',
          source: 'S17',
          assessment: 'ambiguous',
          text: 'Table I.29 gives `₹15,100.42 crore`, bracketed `(12.90)`, so the reported figure is that rounded. The percentage is a share of the total claim *amount*, per the footnote. [[S3]] The phrase “of the total claims filed” is where it turns: a reader can take it as a share of claims rather than of rupees, and those are different quantities. Ambiguous rather than wrong.',
        },
        {
          type: 'claim',
          figure: '₹26,000 crore disallowed and repudiated, up 19.10 per cent',
          attribution: 'Business Standard, 27 December 2024',
          source: 'S18',
          assessment: 'misleading',
          text: 'The arithmetic is sound: `₹15,100.42 crore` plus `₹10,937.18 crore` is `₹26,037.60 crore`. [[S33]] The article supplies the prior-year base itself, `₹21,861 crore`, attributing it to IRDAI; against that base the growth is `19.11` per cent. We have not read the 2022-23 table and do not assert that base. [[S34]]',
        },
        {
          type: 'p',
          text: 'The same article explains what it takes the word to mean. A claim is rejected or disallowed, it says, when an insurer “refuses to process it due to specific issues with its validity”; repudiation follows a review. [[S18]] On that reading both rows are rejections and adding them is natural. On the distinction RET_194 and RET_197 draw, the sum joins a field carrying no claim count to one carrying `36.40` lakh claims. If the objection above holds, the composite is defensible. Otherwise it corresponds to no single reported quantity.',
        },
        {
          type: 'claim',
          figure: 'Insurers rejected 11 per cent of health claims',
          attribution: 'Business Standard, 27 December 2024',
          source: 'S44',
          assessment: 'correct',
          text: 'This matches the report’s repudiated-claims share by number: `36.40` lakh, bracketed `(11.18)` of the total. Paragraph I.6.5.6 accounts for the year as about 83 per cent settled, about eleven per cent repudiated and about six per cent pending. [[S21]] No share is allotted to disallowed in that sentence.',
        },
        {
          type: 'claim',
          figure: 'A settlement ratio of 103.38 per cent',
          attribution: 'Business Standard, 27 December 2024',
          source: 'S45',
          assessment: 'incorrect',
          text: 'The article defines a settlement ratio as the share of claims an insurer settles in a period, then reads `103.38` as public sector insurers paying out more than they collected in premiums. Those are two different measures. The figure sits in Table I.27 of the same report, on the page before Table I.29, which names it an incurred claims ratio. [[S22]]',
        },
      ],
    },

    {
      id: 'the-regulators-sentence',
      nav: 'The sentence',
      kicker: 'Upstream',
      title: 'The regulator’s own sentence',
      blocks: [
        {
          type: 'p',
          text: 'A fifth figure has a different explanation, and it does not lie with the outlet. It is the second place in these reports where a number share and an amount share appear as though they were the same thing, which is why the distinction is worth following.',
        },
        {
          type: 'p',
          text: 'Paragraph I.6.5.5 of the 2023-24 report states that `66.16` per cent of the total *number* of claims were settled through cashless mode, and another `39` per cent through reimbursement. Table I.28, on the same printed page, gives the underlying figures. Cashless settlements were `156.84` lakh claims worth `₹55,235.09 crore`, against totals of `268.59` lakh and `₹83,493.17 crore`. [[S35]]',
        },
        {
          type: 'p',
          text: 'Those divide out as `58.39` per cent by number and `66.16` per cent by amount, and the table prints both brackets. Reimbursement is `38.96` per cent by number, which is the `39` in the paragraph. [[S36]] So the sentence pairs an amount share with a number share and describes both as numbers, which is why they total `105`. [[S37]]',
        },
        {
          type: 'visual',
          component: 'number-vs-amount',
          caption:
            'Table I.28 of the 2023-24 report, measured twice — and the paragraph on the same page that pairs one of each.',
        },
        {
          type: 'p',
          text: 'The 2024-25 report states it differently: `58` per cent settled cashless by number, `41` per cent by reimbursement, and the amount share of `66.35` per cent given separately. Its own Table I.28 prints the number share as `(57.96)`. [[S38]] Why the two reports differ is not something these documents say.',
        },
        {
          type: 'p',
          text: 'The Press Trust of India report of 30 December carried that sentence as written. [[S17]] Its two figures come from different columns of the table beneath it.',
        },
      ],
    },

    {
      id: 'the-boundary',
      nav: 'The boundary',
      kicker: 'Unresolved',
      title: 'The boundary of the evidence',
      blocks: [
        {
          type: 'p',
          text: 'Four things remain unresolved, and they bound everything above.',
        },
        {
          type: 'p',
          text: 'No definition of “claims disallowed” appears in the annual reports, the returns circular or the health returns annexure examined here. [[S19]] The reading below rests on how the reporting forms are built, and the forms are not unanimous. Two specify the field as an amount only; RET_196, whose rows match the published table, provides number cells and, being blank, settles nothing about them. Why the report prints `0.00` and `(0)` rather than a blank or a dash is not established either. [[S39]]',
        },
        {
          type: 'p',
          text: 'The largest gap concerns the money. Nothing in these documents says which claims the `₹18,521.02 crore` relates to — whether it arises only on settled claims, or on repudiated and outstanding ones too. [[S40]] That is why no per-claim deduction figure appears in this article. Dividing the disallowed amount across settled claims produces a clean-looking percentage and requires an assumption the documents do not support.',
        },
        {
          type: 'p',
          text: 'Two further limits. Only 2023-24 and 2024-25 were tested, so nothing here describes earlier years. [[S41]] And the life insurance terminology in Table I.11 is not automatically transferable to health insurance, in either direction. [[S32]]',
        },
        {
          type: 'p',
          text: 'What would settle the money question is a field-level instruction telling insurers what to record in the disallowed column, or the submissions themselves. No such instruction appears in the two annual reports, the returns circular or the health annexure examined here. One document was not available in full: the Master Circular on Health Insurance Business of 29 May 2024. Its covering paragraphs define no terms and send returns back to the returns circular examined above. [[S42]] Its body remains unchecked, and so does the possibility that the answer sits there.',
        },
      ],
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Evidence — bound to the Article #1 evidence matrix                */
  /* ---------------------------------------------------------------- */

  sources: [
    /* ================= DOCUMENTED ================= */
    {
      id: 'S1',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2024–25',
      locator: 'Table I.29 · printed page 43 (PDF index 274)',
      quote: 'Status of Claims under Health Insurance of General and Health Insurers (no. in lakhs, amount in ₹ crore)',
      establishes: 'The table’s title as printed, and that each of its seven columns is split into a number in lakhs and an amount in ₹ crore.',
      working: 'Does not establish how the report indexes the table — the List of Tables gives a different wording, which is why we quote the table and never the index.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-03',
      internalRef: 'Matrix C01',
    },
    {
      id: 'S2',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2024–25',
      locator: 'Table I.29 · disallowed and repudiated columns · printed page 43',
      quote: 'Claims disallowed as per terms and conditions of policy contract — 0.00 (0) · 18,521.02 (13.98)',
      establishes: 'The disallowed column header wording, a count of 0.00 lakh bracketed (0), an amount of ₹18,521.02 crore bracketed (13.98), and repudiated at 29.51 lakh and ₹11,412.42 crore on the row beside it.',
      working: 'The footnote “Figures in brackets are percentage to total” is what makes the amount bracket a share of the total claim amount. Does not establish why a zero was printed rather than a blank.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-03',
      internalRef: 'Matrix C02–C06',
    },
    {
      id: 'S3',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2023–24',
      locator: 'Table I.29 · disallowed column · printed page 43 (PDF index 254)',
      quote: 'Claims disallowed — 0.00 (0) · 15,100.42 (12.90)',
      establishes: 'The preceding edition reports the same 0.00 lakh count, bracketed (0), against ₹15,100.42 crore bracketed (12.90).',
      working: 'Establishes that the zero recurs. Does not establish that it recurs before 2023-24.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-07',
      internalRef: 'Matrix C13, C14, C26',
    },
    {
      id: 'S4',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2023–24',
      locator: 'Table I.29 · full row set · printed page 43',
      establishes: 'Opening 17.85 lakh and ₹6,290.28 crore; new claims 307.87 lakh and ₹1,10,825.06 crore; total 325.72 lakh and ₹1,17,115.34 crore; paid 268.59 lakh (82.46) and ₹83,493.17 crore (71.29); repudiated 36.40 lakh (11.18) and ₹10,937.18 crore (9.34); closing 20.73 lakh (6.36) and ₹7,584.57 crore (6.48).',
      working: 'Percentages are printed only for total, paid, disallowed, repudiated and closing.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-07',
      internalRef: 'Matrix C17',
    },
    {
      id: 'S5',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2024–25',
      locator: 'Table I.29 · full row set · printed page 43',
      establishes: 'Opening 20.73 lakh and ₹7,584.58 crore; new claims 351.85 lakh and ₹1,24,903.22 crore; total 372.58 lakh and ₹1,32,487.81 crore; paid 326.01 lakh (87.50) and ₹94,247.60 crore (71.14); closing 17.07 lakh (4.58) and ₹8,306.76 crore (6.27).',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-03',
      internalRef: 'Matrix C07–C10',
    },
    {
      id: 'S6',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2024–25',
      locator: '¶I.6.5.5 · printed page 42',
      establishes: 'The report states an average of ₹28,910 paid per claim for 2024-25.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-03',
      internalRef: 'Matrix C21 input',
    },
    {
      id: 'S7',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Reports 2023–24 and 2024–25',
      locator: 'Table I.29 in both editions · printed page 43 in each',
      establishes: 'Table number, title, the seven column concepts and their order, the number and amount sub-columns, which rows carry percentages, and the bracket footnote are identical across the two years, and the disallowed header is word for word the same.',
      working: 'Presentation of the unit labels differs between the two editions; the meaning does not. Establishes nothing about 2022-23 or earlier.',
      retrieved: '2026-09-07',
      internalRef: 'Matrix C23, C24, C27',
    },
    {
      id: 'S8',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Master Circular on Submission of Returns, 2024',
      locator: 'Ref IRDAI/General/CIR/93/06/2024, 14 June 2024 · index, health department serials 91–99',
      establishes: 'The circular lists the health returns and points to a health department annexure for serial numbers 91 to 99, where the field formats are specified.',
      working: 'The string “disallow” occurs zero times in the circular’s 44 pages.',
      retrieved: '2026-09-02',
      internalRef: 'Matrix source block S3',
    },
    {
      id: 'S9',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_196',
      locator: 'Sheet IRDAI_RET_196 · cells B16–B22',
      quote: 'Claims outstanding at the beginning of the period · New Claims registered · Claims paid · claims disallowed as per the terms and conditions of policy contract’ · Claims repudiated · Claims outstanding at the end of the period',
      establishes: 'RET_196 reproduces Table I.29’s rows in the same order, and adds a penal interest row the annual report does not carry.',
      working: 'Does not establish that RET_196 alone generates the published table, or how the report aggregates across returns.',
      retrieved: '2026-09-02',
      internalRef: 'Matrix C28',
    },
    {
      id: 'S10',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_194',
      locator: 'Sheet IRDAI_RET_194 · row 13 · disallowed at M13, column code at M14',
      quote: 'Amount of claims disallowed as per the terms and conditions of policy contract’',
      establishes: 'In the annual state-wise return, claims paid, repudiated and outstanding each carry a count column and an amount column, while claims disallowed carries a single column designated an amount.',
      working: 'Does not establish that no count exists anywhere in IRDAI’s systems.',
      retrieved: '2026-09-02',
      internalRef: 'Matrix C29, C30 — load-bearing structural row',
    },
    {
      id: 'S11',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_197',
      locator: 'Sheet IRDAI_RET_197 · row 11 · disallowed at N11 · repeats at rows 22, 32 and 39',
      establishes: 'The quarterly return shows the same asymmetry: an amount-only disallowed field, with counts beside the amounts for repudiated and outstanding.',
      working: 'Establishes the design is not confined to one return.',
      retrieved: '2026-09-02',
      internalRef: 'Matrix C31',
    },
    {
      id: 'S12',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_196',
      locator: 'Sheet IRDAI_RET_196 · headers at row 14 · disallowed particular at B19 · C14–P14',
      establishes: 'RET_196 is a generic grid of particulars against alternating count and amount columns, so seven number-of-claims cells physically exist at the disallowed row. The copy examined is an unfilled template throughout.',
      working: 'This is the strongest fact against this article’s own reading, and the editorial standards require it to appear in the body rather than in a footnote.',
      retrieved: '2026-09-02',
      internalRef: 'Matrix C32',
    },
    {
      id: 'S13',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_196 and RET_197',
      locator: 'RET_196 cell A66 · RET_197 cell A46',
      establishes: 'Where a claim is paid in both cashless and reimbursement mode, the amounts are reported under the respective heads and the number under cashless.',
      working: 'Establishes a reporting convention for settlement modes only. It says nothing about the disposition rows, and nothing about what the disallowed row records.',
      retrieved: '2026-09-02',
    },
    {
      id: 'S14',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_194',
      locator: 'Sheet IRDAI_RET_194 · cell A145, under “Note”',
      quote: 'No of claims repudiated means where claim is rejected in full',
      establishes: 'Repudiation is a claim-level outcome meaning rejection in full. This is the only formal definition located in any source examined.',
      working: 'Does not establish what disallowed means.',
      retrieved: '2026-09-02',
      internalRef: 'Matrix C33',
    },
    {
      id: 'S15',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_196',
      locator: 'Sheet IRDAI_RET_196 · rows 37–49 · buckets at B43–B48',
      establishes: 'Repudiated claims require an ageing schedule. Paid and outstanding claims have one too; disallowed alone does not.',
      retrieved: '2026-09-02',
      internalRef: 'Matrix C34',
    },
    {
      id: 'S16',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_191',
      locator: 'Sheet IRDAI_RET_191 · cell A26',
      quote: 'Repudiation Ratio = No of claims repudiated / No of;(O/S claims at the beginning + registered ) of the reporting period',
      establishes: 'IRDAI defines a repudiation ratio built on the repudiated count. No disallowance ratio exists.',
      retrieved: '2026-09-02',
      internalRef: 'Matrix C35',
    },
    {
      id: 'S19',
      kind: 'documented',
      publisher: 'Continuum',
      document: 'Search across IRDAI Annual Reports 2023–24 and 2024–25, returns circular and annexure',
      locator: 'String search · “disallow”, “denied”, “not payable”, “deduct”',
      establishes: 'No prose definition of “claims disallowed” appears in either annual report, the returns circular, or the returns annexure. The string “disallow” occurs once in the 416-page English text of the 2024-25 report, in the Table I.29 column header itself.',
      working: 'Zero occurrences in the circular’s 44 pages; ten in the annexure, always as the field name. “Denied”, “not payable” and “deduct” occur zero times in the annexure. Does not establish that no definition exists in some instrument we did not examine.',
      retrieved: '2026-09-03',
      internalRef: 'Matrix C37',
    },
    {
      id: 'S20',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2024–25',
      locator: 'Table I.11 · printed page 18 (PDF index 249)',
      quote: 'Claims rejected are those claims that cannot be considered due to policy terms and conditions. Claims repudiated are claims that cannot be considered as per the provisions of section 45 of Insurance Act, 1938.',
      establishes: 'The life death-claims table carries two separate counted columns — repudiated at 10,494 policies and ₹958 crore, rejected at 6,839 policies and ₹19 crore in individual business — each with its own amount and percentage, and each defined in a footnote.',
      working: 'The strongest available argument against this article’s thesis, and the editorial standards make publishing it mandatory.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-03',
      internalRef: 'Matrix C52',
    },
    {
      id: 'S21',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2023–24',
      locator: '¶I.6.5.6 and Table I.29 · printed page 43',
      establishes: 'The report accounts for 2023-24 as about 83 per cent of claims settled, about eleven per cent repudiated and about six per cent pending, against a printed repudiated share by number of (11.18). No share is allotted to disallowed in that sentence.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-07',
      internalRef: 'Matrix C44 comparison',
    },
    {
      id: 'S22',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2023–24',
      locator: 'Table I.27 · printed page 42 (PDF index 253)',
      quote: 'Table I.27: Incurred Claims Ratio under Health Insurance Business of General and Health Insurers (in per cent) — Public Sector Insurers, Total, 2023-24 = 103.38',
      establishes: 'The figure 103.38 is the 2023-24 incurred claims ratio for public sector insurers, a measure of claims cost against premium earned — not a settlement ratio.',
      working: 'Confirmed identically in the 2024-25 report’s Table I.27, which also gives 100.59 for 2024-25.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-07',
      internalRef: 'Matrix C47',
    },
    {
      id: 'S35',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2023–24',
      locator: 'Table I.28 · printed page 43',
      establishes: 'Cashless settlements were 156.84 lakh claims worth ₹55,235.09 crore, and reimbursement 104.65 lakh claims worth ₹26,176.56 crore, against totals of 268.59 lakh and ₹83,493.17 crore. The table prints the brackets (58.39) and (66.16).',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-07',
      internalRef: 'Matrix C48 inputs',
    },
    {
      id: 'S37',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2023–24',
      locator: '¶I.6.5.5 · printed page 43, read against Table I.28 on the same page',
      establishes: 'The paragraph states that 66.16 per cent of the total number of claims were settled cashless and another 39 per cent through reimbursement, while the table on the same page gives 66.16 as the amount share and 58.39 as the number share.',
      working: 'The paragraph pairs an amount percentage with a number percentage and labels both as number, which is why the two total 105. It also gives cashless-by-amount as 66.17 against the table’s 66.16, a further internal difference of 0.01. Establishes nothing about intent.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-07',
      internalRef: 'Matrix C49',
    },
    {
      id: 'S38',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2024–25',
      locator: '¶I.6.5.5 and Table I.28 · printed page 42',
      establishes: 'The later report states 58 per cent of claims settled cashless by number and 41 per cent by reimbursement, gives the amount share of 66.35 per cent separately, and prints the number share in its Table I.28 as (57.96).',
      working: 'Describes the change in presentation. Does not establish that the change was a deliberate correction.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-03',
      internalRef: 'Matrix C50, C51',
    },
    {
      id: 'S42',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Master Circular on Health Insurance Business',
      locator: 'IRDAI/HLT/CIR/PRO/84/5/2024, 29 May 2024 · covering paragraphs C and D',
      establishes: 'The covering paragraphs define no terms and refer returns back to the Master Circular on Submission of Returns.',
      working: 'The body of this circular was not available in full and remains unchecked. It is the most likely place for a field-level instruction we did not find elsewhere.',
      retrieved: '2026-09-02',
    },

    /* ================= CALCULATED ================= */
    {
      id: 'S23',
      kind: 'calculated',
      publisher: 'Continuum',
      document: 'Reconciliation of Table I.29, 2024–25',
      locator: 'Our arithmetic on the printed values',
      establishes: 'Both columns account for the printed total to within a hundredth, the number column with zero in the disallowed cell.',
      working: '20.73 + 351.85 = 372.58, exact against the printed total. 326.01 + 0.00 + 29.51 + 17.07 = 372.59 against a printed 372.58, a residual of +0.01. 7,584.58 + 1,24,903.22 = 1,32,487.80 and 94,247.60 + 18,521.02 + 11,412.42 + 8,306.76 = 1,32,487.80, both against a printed 1,32,487.81, a residual of −0.01. Does not establish that the amount column is a deduction decomposition rather than some other partition.',
      internalRef: 'Matrix C18',
    },
    {
      id: 'S24',
      kind: 'calculated',
      publisher: 'Continuum',
      document: 'Reconciliation of Table I.29, 2023–24',
      locator: 'Our arithmetic on the printed values',
      establishes: 'Every reconciliation in the earlier year is exact, with no residual at all — the number column balances to its printed total with zero in the disallowed cell.',
      working: '17.85 + 307.87 = 325.72, exact. 268.59 + 0.00 + 36.40 + 20.73 = 325.72, exact. 6,290.28 + 1,10,825.06 = 1,17,115.34, exact. 83,493.17 + 15,100.42 + 10,937.18 + 7,584.57 = 1,17,115.34, exact. Zero residual leaves no room in the arithmetic for a suppressed count.',
      internalRef: 'Matrix C19 — strongest arithmetic row',
    },
    {
      id: 'S25',
      kind: 'calculated',
      publisher: 'Continuum',
      document: 'Percentage reconciliation, both years',
      locator: 'Our arithmetic on the printed values',
      establishes: 'Every printed percentage reproduces from the printed values, and both percentage columns sum to 100.00 in both years.',
      working: '2024-25: paid 87.5007 → (87.50); disallowed 0.0000 → (0) and 13.9794 → (13.98); repudiated 7.9204 → (7.92) and 8.6139 → (8.61); closing 4.5816 → (4.58) and 6.2698 → (6.27). 2023-24: paid 82.4604 → (82.46) and 71.2914 → (71.29); disallowed 0.0000 → (0) and 12.8936 → (12.90); repudiated 11.1752 → (11.18) and 9.3388 → (9.34); closing 6.3644 → (6.36) and 6.4762 → (6.48). The amount column treats disallowed as a component of total claimed rupees; the number column treats it as contributing no claims.',
      internalRef: 'Matrix C20',
    },
    {
      id: 'S26',
      kind: 'calculated',
      publisher: 'Continuum',
      document: 'Average paid per claim',
      locator: 'Our arithmetic, checked against the report’s own stated figure',
      establishes: 'The report’s stated average paid per claim reproduces from the paid amount divided by the paid count, so the number column does count settled claims as claims.',
      working: '2024-25: ₹94,247.60 crore ÷ 326.01 lakh = ₹28,909.4 against a stated ₹28,910. 2023-24: ₹83,493.17 crore ÷ 268.59 lakh = ₹31,085.7 against a stated ₹31,086.',
      internalRef: 'Matrix C21',
    },
    {
      id: 'S27',
      kind: 'calculated',
      publisher: 'Continuum',
      document: 'Continuity between the two years',
      locator: 'Our comparison of the two printed tables',
      establishes: 'The 2023-24 closing outstanding equals the 2024-25 opening outstanding, so the table is a genuine flow reconciliation with stable construction across the two years.',
      working: 'Closing 20.73 lakh and ₹7,584.57 crore against opening 20.73 lakh and ₹7,584.58 crore. The number is identical; the amount differs by ₹0.01 crore.',
      internalRef: 'Matrix C22',
    },
    {
      id: 'S33',
      kind: 'calculated',
      publisher: 'Continuum',
      document: 'The composite figure in circulation',
      locator: 'Our arithmetic on the 2023–24 printed values',
      establishes: 'The ₹26,000 crore composite reproduces exactly from the two printed rows, and the stated growth reproduces against the base the article itself supplies.',
      working: '15,100.42 + 10,937.18 = ₹26,037.60 crore. Against a stated prior-year base of 12,754 + 9,107 = ₹21,861 crore, growth is 19.11 per cent. The arithmetic is valid; the objection to the composite is semantic, not numerical.',
      internalRef: 'Matrix C43',
    },
    {
      id: 'S36',
      kind: 'calculated',
      publisher: 'Continuum',
      document: 'Settlement mode shares, 2023–24',
      locator: 'Our arithmetic on Table I.28',
      establishes: 'Cashless is 58.39 per cent by number and 66.16 per cent by amount; reimbursement is 38.96 per cent by number and 31.35 per cent by amount.',
      working: '156.84 ÷ 268.59 = 58.39%. 55,235.09 ÷ 83,493.17 = 66.16%. 104.65 ÷ 268.59 = 38.96%. 26,176.56 ÷ 83,493.17 = 31.35%. The printed brackets in Table I.28 are (58.39) and (66.16).',
      internalRef: 'Matrix C48',
    },

    /* ================= ANALYSIS ================= */
    {
      id: 'S28',
      kind: 'analysis',
      publisher: 'Continuum',
      document: 'Reading of the both-mode reporting note',
      locator: 'Our inference from RET_196 A66 and RET_197 A46',
      establishes: 'The note shows that IRDAI is willing to report an amount under two heads while reporting the count under one.',
      working: 'Whether that logic extends from settlement modes to the disposition rows is our inference and not the note’s. The note says nothing about what the disallowed row records, and we do not treat it as if it did.',
    },
    {
      id: 'S29',
      kind: 'analysis',
      publisher: 'Continuum',
      document: 'Reading of the returns architecture',
      locator: 'Our analysis across RET_191, RET_194, RET_196 and RET_197',
      establishes: 'Across the health returns, disallowed carries an amount field and no count field in two of three returns, no ageing schedule and no ratio; repudiated carries a count, an amount, an ageing schedule, a ratio and a definition. The architecture does not treat the field uniformly.',
      working: 'It establishes that the two are treated differently. It does not establish that disallowed is a deduction, and disallowance could still be a claim-level rejection that IRDAI happens not to count.',
      internalRef: 'Matrix C36 — central structural claim',
    },
    {
      id: 'S30',
      kind: 'analysis',
      publisher: 'Continuum',
      document: 'Reading of the relative sizes',
      locator: 'Our reading of the printed figures in Tables I.11 and I.29',
      establishes: 'On the life side the terms-and-conditions category is the small one, while health disallowance is larger than health repudiation.',
      working: 'Life individual business: rejected 6,839 policies and ₹19 crore against repudiated 10,494 policies and ₹958 crore. Health 2024-25: disallowed ₹18,521.02 crore against repudiated ₹11,412.42 crore. This cuts against a clean mapping between the two tables rather than against the objection itself.',
    },
    {
      id: 'S31',
      kind: 'analysis',
      publisher: 'Continuum',
      document: 'Response to the life-table objection',
      locator: 'Our analysis of the health returns against Table I.11',
      establishes: 'Three narrow points sit against the objection: the health returns contain no field called rejected; RET_194 assigns rejection in full to repudiated, leaving no counterpart to the life rejected column; and in the two returns where columns were specified individually a count was created for paid, repudiated and outstanding, and not for disallowed.',
      working: 'These weaken the objection. They do not eliminate it.',
      internalRef: 'Matrix C53 (reasoning)',
    },

    /* ================= REPORTED ================= */
    {
      id: 'S17',
      kind: 'reported',
      ...fromMedia(
        'bs-2024-12-30-pti-disallowed',
        'Health insurers disallowed claims worth Rs 15,100 crore or 12.9 per cent of the total claims filed during fiscal 2023-24',
      ),
      locator: 'Press Trust of India copy · opening paragraph, and the mode-of-settlement paragraph',
      assessment: 'ambiguous',
      establishes:
        'The report gave the disallowed figure as ₹15,100 crore, or 12.9 per cent of the total claims filed, and separately carried IRDAI’s own sentence that 66.16 per cent of the total number of claims were settled cashless and another 39 per cent through reimbursement.',
      working:
        'The figure and the percentage are accurate against Table I.29 — ₹15,100.42 crore, bracketed (12.90). The percentage is a share of the total claim amount, per the footnote, and the phrase “of the total claims filed” invites a count reading of an amount share. Ambiguous rather than wrong. The cashless sentence is reproduced accurately from IRDAI’s paragraph I.6.5.5; the error in it is upstream, not the outlet’s.',
      internalRef: 'Matrix C42; Matrix C46 (source reassigned 2026-09-17; see archive/sources/retired.json)',
    },
    {
      id: 'S18',
      kind: 'reported',
      ...fromMedia(
        'bs-2024-12-27-rejection-up',
        'Health policy claims worth Rs 26,000 crore were disallowed and “repudiated” by insurers in the year ending March 2024, marking a 19.10 per cent increase',
      ),
      locator: 'Staff report · opening paragraphs and sub-heading',
      assessment: 'misleading',
      establishes:
        'The article added the disallowed and repudiated amounts to produce a ₹26,000 crore composite, reported it as up 19.10 per cent, and described a disallowed claim as one an insurer “refuses to process it due to specific issues with its validity”.',
      working:
        'The arithmetic is valid and consistently computed. The objection is semantic: the sum joins a field carrying no claim count to one carrying 36.40 lakh claims, under a claims-rejection framing. If the life-table objection holds, the composite is defensible; otherwise it corresponds to no single reported quantity.',
      internalRef: 'Matrix C43',
    },
    {
      id: 'S34',
      kind: 'reported',
      ...fromMedia(
        'bs-2024-12-27-rejection-up',
        'The rejection amount was Rs 21,861 crore in the year ending March 2023',
      ),
      locator: 'Staff report · the prior-year base, attributed by the outlet to IRDAI',
      assessment: 'ambiguous',
      establishes:
        'The article supplies its own prior-year base of ₹21,861 crore for the growth figure, and attributes it to IRDAI.',
      working:
        'We have not read the 2022-23 table. The base is unverified and is attributed to the outlet here rather than asserted.',
      internalRef: 'Matrix C43, caveat 9',
    },
    {
      id: 'S44',
      kind: 'reported',
      ...fromMedia(
        'bs-2024-12-27-rejection-up',
        'rejected 11 per cent of health claims and had 6 per cent pending as of March 2024',
      ),
      locator: 'Staff report · opening paragraph',
      assessment: 'correct',
      establishes:
        'The article reported that insurers rejected 11 per cent of health claims in 2023-24.',
      working:
        'This matches the report’s repudiated-claims share by number: 36.40 lakh, bracketed (11.18) of the total. Given the returns annexure defines repudiation as rejection in full, “rejected” is a fair plain-English rendering. The outlet got this right.',
      internalRef: 'Matrix C44',
    },
    {
      id: 'S45',
      kind: 'reported',
      ...fromMedia(
        'bs-2024-12-27-rejection-up',
        'Public sector insurers had a settlement ratio of 103.38 per cent in 2023-24, indicating that they paid out more than they collected in premiums',
      ),
      locator: 'Staff report · “Settlement ratios” section',
      assessment: 'incorrect',
      establishes:
        'The article calls 103.38 per cent a settlement ratio — which it defines as the percentage of claims an insurer settles within a specific period — and reads it as public sector insurers paying out more than they collected in premiums.',
      working:
        'The label is the outlet’s, not IRDAI’s. IRDAI prints 103.38 in Table I.27 of the 2023-24 annual report, titled “Incurred Claims Ratio under Health Insurance Business of General and Health Insurers”, as the total for public sector insurers. On the outlet’s own definition a settlement ratio is a share of claims settled, which is a different measure from an incurred claims ratio of claims cost against premium.',
      internalRef: 'Matrix C45 (source reassigned 2026-09-17; see archive/sources/retired.json)',
    },

    /* ================= UNRESOLVED ================= */
    {
      id: 'S32',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Correspondence between the life and health terminology',
      locator: 'Searched: both annual reports, the returns circular, the returns annexure',
      establishes: 'Whether the health disallowed column is related to the life “claims rejected” column is not established, in either direction.',
      working: 'The wording is close. The reporting architectures are not the same, and life reporting splits full non-consideration into two counted buckets where health reporting has no “rejected” field at all. The documents examined do not say how, or whether, the two systems correspond.',
      internalRef: 'Matrix C53, caveat 7',
    },
    {
      id: 'S39',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Reason for the printed zero',
      locator: 'Searched: Table I.29 footnotes and surrounding text in both editions',
      establishes: 'Why the report prints 0.00 and (0) rather than a blank or a dash is not established.',
      working: 'A presentational question the documents do not answer.',
      internalRef: 'Matrix C40, caveat 5',
    },
    {
      id: 'S40',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Population the disallowed rupees attach to',
      locator: 'Searched: both annual reports, the returns circular, the returns annexure',
      establishes: 'Whether the disallowed amount arises only on settled claims, or spans repudiated and outstanding claims too, is not established.',
      working: 'This is why no per-claim deduction figure appears in the article: dividing the disallowed amount across settled claims produces a clean-looking percentage and requires an assumption the documents do not support.',
      internalRef: 'Matrix C38, caveat 4',
    },
    {
      id: 'S41',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Years outside the tested range',
      locator: 'Tested: 2023–24 and 2024–25 only',
      establishes: 'Nothing here describes the structure of the table, or the value in the disallowed cell, before 2023-24.',
      working: 'The 2022-23 report would give a third year and would also allow the ₹21,861 crore base in circulation to be checked.',
      internalRef: 'Matrix caveat 6',
    },
    {
      id: 'S43',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Provenance of the published row',
      locator: 'Searched: both annual reports and the returns annexure',
      establishes: 'Whether the annual report compiles the published row from RET_196 alone, or aggregates across RET_196, RET_194 and RET_197, is not established.',
      working: 'The table carries no provenance note, and the return formats do not indicate which is aggregated into the published summary. Probably unanswerable from public documents.',
      internalRef: 'Matrix C28 caveat',
    },
  ],

  related: [
    {
      label: 'How a Continuum note is built',
      href: '/methods/',
      note: 'Extraction, arithmetic checks, and the adversarial pass we run against our own draft.',
    },
    {
      label: 'The evidence states',
      href: '/standards/#evidence',
      note: 'What documented, calculated, analysis, reported and unresolved each commit us to.',
    },
    {
      label: 'Corrections',
      href: '/corrections/',
      note: 'Every change to a published note, with the original wording beside it.',
    },
  ],
};
