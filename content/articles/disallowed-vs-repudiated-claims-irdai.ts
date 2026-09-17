import type { Article } from '@/types/content';

/**
 * NOTE 0002 — the reference companion to note 0001.
 *
 * This note answers one question: what does each of the two rows carry in
 * IRDAI's health claims reporting. It restates no argument from note 0001 and
 * reaches no conclusion of its own. Every source here is already in note 0001's
 * evidence array, at the same locator, and the bounded language is deliberate:
 * the documents examined do not define "claims disallowed", and nothing in this
 * note may be read as supplying a definition by implication.
 */
export const article: Article = {
  slug: 'disallowed-vs-repudiated-claims-irdai',
  index: 2,
  status: 'published',

  title: 'Disallowed vs Repudiated Claims in IRDAI Health Data: What Each Row Shows',

  deck:
    'Table I.29 reports the two as separate rows with different figures, and the health returns behind it give them different apparatus. One carries a formal definition, an ageing schedule and a ratio. The other carries none of the three in the documents examined.',

  summary:
    'IRDAI’s health claims table reports claims disallowed and claims repudiated on separate rows, with different counts and different amounts. The returns behind the table define repudiation as rejection in full and attach an ageing schedule and a ratio to it. No definition of claims disallowed appears in the documents examined.',

  seo: {
    title: 'Disallowed vs Repudiated Claims: IRDAI Health Data',
    description:
      'IRDAI reports disallowed and repudiated claims as separate rows in Table I.29. What each row shows, what the health returns specify, and what is left undefined.',
  },

  published: '2026-09-17',

  topics: ['Health insurance', 'Regulatory disclosure', 'Claims data'],
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
      title: 'Returns annexure — health returns RET_191 to RET_197',
      publisher: 'IRDAI',
      type: 'Regulatory return',
      year: '2024',
    },
  ],

  findings: [
    'Table I.29 reports claims disallowed and claims repudiated on separate rows, with different figures in each of the two years examined.',
    'RET_194 defines the number of claims repudiated as claims rejected in full. It is the only formal definition of either term located in the documents examined.',
    'RET_194 and RET_197 specify claims disallowed as an amount field with no paired claim-count column. RET_196 carries count cells at that row, but the copy examined is an unfilled template.',
  ],

  openQuestions: [
    'What the disallowed amount represents is not established by the documents examined.',
    'The body of the Master Circular on Health Insurance Business of 29 May 2024 was not available in full, and is the most likely place for a field-level instruction we did not find elsewhere.',
  ],

  social: {
    figure: '₹18,521.02',
    counterFigure: '29.51 lakh',
    label: 'IRDAI · DISALLOWED vs REPUDIATED',
  },

  sections: [
    {
      id: 'the-two-rows',
      nav: 'The two rows',
      kicker: 'Where they appear',
      title: 'Two rows, one table',
      blocks: [
        {
          type: 'p',
          text: 'IRDAI reports health claims in one table in its annual report — Table I.29, *Status of Claims under Health Insurance of General and Health Insurers*, on printed page 43. Every column is split into a number in lakhs and an amount in ₹ crore. [[S1]]',
        },
        {
          type: 'p',
          text: 'Two of its rows concern this note. One is headed *Claims disallowed as per terms and conditions of policy contract*; the other, *Claims repudiated during the period*. They carry separate figures, and the wording is identical in both editions examined. [[S2]] [[S7]]',
        },
      ],
    },

    {
      id: 'what-the-table-reports',
      nav: 'What the table reports',
      kicker: 'The figures',
      title: 'What Table I.29 prints',
      blocks: [
        {
          type: 'p',
          text: 'In 2024-25 the disallowed row prints a count of `0.00` lakh, bracketed `(0)`, against an amount of `₹18,521.02` crore, bracketed `(13.98)`. The repudiated row beside it prints `29.51` lakh and `₹11,412.42` crore. [[S2]]',
        },
        {
          type: 'p',
          text: 'In 2023-24 the same pattern appears with different amounts: disallowed at `0.00` lakh and `₹15,100.42` crore, bracketed `(12.90)`; [[S3]] repudiated at `36.40` lakh, bracketed `(11.18)`, and `₹10,937.18` crore, bracketed `(9.34)`. [[S4]] A footnote makes every bracket a percentage of the total.',
        },
        {
          type: 'note',
          label: 'Scope',
          text: 'Two editions were examined, 2023-24 and 2024-25. Nothing here describes the structure of the table, or the value in the disallowed cell, before 2023-24. [[S41]]',
        },
      ],
    },

    {
      id: 'what-the-returns-specify',
      nav: 'What the returns specify',
      kicker: 'Behind the table',
      title: 'What the health returns specify',
      blocks: [
        {
          type: 'p',
          text: 'The published table is a summary. Insurers file the underlying figures on returns whose formats are specified in an annexure to the Master Circular on Submission of Returns. [[S8]] Three of those returns carry the disallowed field, and they do not treat it the same way.',
        },
        {
          type: 'p',
          text: 'In RET_194, the annual state-wise return, claims paid, repudiated and outstanding each carry a count column and an amount column. Claims disallowed carries a single column, designated an amount. [[S10]] RET_197, the quarterly return, shows the same asymmetry at row 11 and repeats it at three further rows. [[S11]]',
        },
        {
          type: 'p',
          text: 'RET_196 is different. Its rows run in the same order as the published table, with one addition the annual report does not carry: a penal interest line. [[S9]] Its layout is a matrix rather than a fixed list of named fields, and count columns alternate with amount columns across every particular, so seven claim-count cells sit at the disallowed row. Every cell in the copy examined is blank, because it is a template, so those cells do not establish what the field is meant to record. [[S12]]',
        },
        {
          type: 'visual',
          component: 'field-comparison',
        },
      ],
    },

    {
      id: 'what-is-defined',
      nav: 'What is defined',
      kicker: 'The definitions',
      title: 'What IRDAI explicitly defines',
      blocks: [
        {
          type: 'p',
          text: 'One of the two terms is defined, and only one. Under a note heading, RET_194 gives the number of claims repudiated as claims rejected in full. [[S14]] Across every source examined for this note, that is the only formal definition of either term.',
        },
        {
          type: 'p',
          text: 'Repudiation carries apparatus beyond that definition. RET_196 requires an ageing schedule for repudiated claims; paid and outstanding claims have one too, and disallowed alone does not. [[S15]] RET_191 defines a repudiation ratio built on the repudiated count. No corresponding ratio for disallowance appears in the returns material. [[S16]]',
        },
        {
          type: 'p',
          text: 'For claims disallowed there is no matching entry. Searching both annual reports, the circular and the annexure returns *disallow* once in the 2024-25 report — inside the Table I.29 header itself — zero times in the circular, and ten times in the annexure, always as the name of a field rather than an explanation of one. [[S19]]'
        },
        {
          type: 'note',
          label: 'What this does not establish',
          text: 'That no definition exists. It establishes that none appears in the documents examined. The body of the Master Circular on Health Insurance Business of 29 May 2024 was not available in full, and remains the most likely place for a field-level instruction we did not find elsewhere. [[S42]]',
        },
      ],
    },

    {
      id: 'not-interchangeable',
      nav: 'Not interchangeable',
      kicker: 'The reading',
      title: 'Why the two should not automatically be treated as the same',
      blocks: [
        {
          type: 'p',
          text: 'The documents keep them apart. They are separate rows with separate figures, filed through fields of different shape, and only one of the two is defined, aged and turned into a ratio. [[S2]] [[S10]] [[S14]] [[S15]] [[S16]] On the documents examined, a reader has no basis for treating a rupee in the disallowed row as equivalent to a rupee in the repudiated row.',
        },
        {
          type: 'p',
          text: 'That is a statement about the reporting, not about claims practice. What the disallowed amount represents is not established by the documents examined, and this note does not supply a meaning for it.',
        },
        {
          type: 'pull',
          text: 'One term is defined, aged and ratioed. The other is a column header.',
        },
      ],
    },

    {
      id: 'unresolved',
      nav: 'What is unresolved',
      kicker: 'The boundary',
      title: 'What remains unresolved',
      blocks: [
        {
          type: 'list',
          items: [
            'What population the disallowed rupees attach to — whether they arise only on settled claims, or span repudiated and outstanding claims too — is not established. [[S40]]',
            'The choice to print `0.00` and `(0)`, rather than leaving the cell blank, is not explained anywhere in the table or its footnotes. [[S39]]',
            'Whether the published row is compiled from RET_196 alone, or aggregated across RET_196, RET_194 and RET_197, is not established. [[S43]]',
            'Whether the health disallowed column corresponds to the *claims rejected* column in life reporting is not established, in either direction. [[S32]]',
          ],
        },
        {
          type: 'p',
          text: 'Each is a gap in the documents, not a finding. A reference note that answered the question cleanly would be overstating what two annual reports and a returns annexure can settle.',
        },
      ],
    },

    {
      id: 'the-investigation',
      nav: 'The investigation',
      kicker: 'Further',
      title: 'Where this came from',
      blocks: [
        {
          type: 'p',
          text: 'What the disallowed row represents, and what follows from a count of `0.00` lakh printed beside `₹18,521.02` crore in both years examined, is the subject of [our full analysis of IRDAI’s disallowed claims row](/articles/irdai-health-claims-disallowed-row/).',
        },
      ],
    },
  ],

  sources: [
    {
      id: 'S1',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2024–25',
      locator: 'Table I.29 · printed page 43 (PDF index 274)',
      quote:
        'Status of Claims under Health Insurance of General and Health Insurers (no. in lakhs, amount in ₹ crore)',
      establishes:
        'The table’s title as printed, and that each of its seven columns is split into a number in lakhs and an amount in ₹ crore.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-03',
    },
    {
      id: 'S2',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2024–25',
      locator: 'Table I.29 · disallowed and repudiated columns · printed page 43',
      quote:
        'Claims disallowed as per terms and conditions of policy contract — 0.00 (0) · 18,521.02 (13.98)',
      establishes:
        'The disallowed column header wording, a count of 0.00 lakh bracketed (0), an amount of ₹18,521.02 crore bracketed (13.98), and repudiated at 29.51 lakh and ₹11,412.42 crore on the row beside it.',
      working:
        'The footnote “Figures in brackets are percentage to total” is what makes the amount bracket a share of the total claim amount. Does not establish why a zero was printed rather than a blank.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-03',
    },
    {
      id: 'S3',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2023–24',
      locator: 'Table I.29 · disallowed column · printed page 43 (PDF index 254)',
      quote: 'Claims disallowed — 0.00 (0) · 15,100.42 (12.90)',
      establishes:
        'The preceding edition reports the same 0.00 lakh count, bracketed (0), against ₹15,100.42 crore bracketed (12.90).',
      working: 'Establishes that the zero recurs. Does not establish that it recurs before 2023-24.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-07',
    },
    {
      id: 'S4',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Report 2023–24',
      locator: 'Table I.29 · repudiated row · printed page 43',
      establishes:
        'Repudiated claims for 2023-24 are printed as 36.40 lakh, bracketed (11.18), and ₹10,937.18 crore, bracketed (9.34).',
      working:
        'Percentages are printed only for total, paid, disallowed, repudiated and closing.',
      url: 'https://irdai.gov.in/annual-reports',
      retrieved: '2026-09-07',
    },
    {
      id: 'S7',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Annual Reports 2023–24 and 2024–25',
      locator: 'Table I.29 in both editions · printed page 43 in each',
      establishes:
        'Table number, title, the seven column concepts and their order, the number and amount sub-columns, which rows carry percentages, and the bracket footnote are identical across the two years, and the disallowed header is word for word the same.',
      working:
        'Presentation of the unit labels differs between the two editions; the meaning does not. Establishes nothing about 2022-23 or earlier.',
      retrieved: '2026-09-07',
    },
    {
      id: 'S8',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Master Circular on Submission of Returns, 2024',
      locator:
        'Ref IRDAI/General/CIR/93/06/2024, 14 June 2024 · index, health department serials 91–99',
      establishes:
        'The circular lists the health returns and points to a health department annexure for serial numbers 91 to 99, where the field formats are specified.',
      working: 'The string “disallow” occurs zero times in the circular’s 44 pages.',
      retrieved: '2026-09-02',
    },
    {
      id: 'S9',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_196',
      locator: 'Sheet IRDAI_RET_196 · cells B16–B22',
      quote:
        'Claims outstanding at the beginning of the period · New Claims registered · Claims paid · claims disallowed as per the terms and conditions of policy contract’ · Claims repudiated · Claims outstanding at the end of the period',
      establishes:
        'RET_196 reproduces Table I.29’s rows in the same order, and adds a penal interest row the annual report does not carry.',
      working:
        'Does not establish that RET_196 alone generates the published table, or how the report aggregates across returns.',
      retrieved: '2026-09-02',
    },
    {
      id: 'S10',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_194',
      locator: 'Sheet IRDAI_RET_194 · row 13 · disallowed at M13, column code at M14',
      quote: 'Amount of claims disallowed as per the terms and conditions of policy contract’',
      establishes:
        'In the annual state-wise return, claims paid, repudiated and outstanding each carry a count column and an amount column, while claims disallowed carries a single column designated an amount.',
      working: 'Does not establish that no count exists anywhere in IRDAI’s systems.',
      retrieved: '2026-09-02',
    },
    {
      id: 'S11',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_197',
      locator: 'Sheet IRDAI_RET_197 · row 11 · disallowed at N11 · repeats at rows 22, 32 and 39',
      establishes:
        'The quarterly return shows the same asymmetry: an amount-only disallowed field, with counts beside the amounts for repudiated and outstanding.',
      working: 'Establishes the design is not confined to one return.',
      retrieved: '2026-09-02',
    },
    {
      id: 'S12',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_196',
      locator: 'Sheet IRDAI_RET_196 · headers at row 14 · disallowed particular at B19 · C14–P14',
      establishes:
        'RET_196 is a generic grid of particulars against alternating count and amount columns, so seven number-of-claims cells physically exist at the disallowed row. The copy examined is an unfilled template throughout.',
      working:
        'This is the strongest fact against reading the amount-only design as deliberate, and the editorial standards require it to appear in the body rather than in a footnote.',
      retrieved: '2026-09-02',
    },
    {
      id: 'S14',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_194',
      locator: 'Sheet IRDAI_RET_194 · cell A145, under “Note”',
      quote: 'No of claims repudiated means where claim is rejected in full',
      establishes:
        'Repudiation is a claim-level outcome meaning rejection in full. This is the only formal definition located in any source examined.',
      working: 'Does not establish what disallowed means.',
      retrieved: '2026-09-02',
    },
    {
      id: 'S15',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_196',
      locator: 'Sheet IRDAI_RET_196 · rows 37–49 · buckets at B43–B48',
      establishes:
        'Repudiated claims require an ageing schedule. Paid and outstanding claims have one too; disallowed alone does not.',
      retrieved: '2026-09-02',
    },
    {
      id: 'S16',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Returns annexure — RET_191',
      locator: 'Sheet IRDAI_RET_191 · cell A26',
      quote:
        'Repudiation Ratio = No of claims repudiated / No of;(O/S claims at the beginning + registered ) of the reporting period',
      establishes:
        'IRDAI defines a repudiation ratio built on the repudiated count. No disallowance ratio exists in the returns material examined.',
      retrieved: '2026-09-02',
    },
    {
      id: 'S19',
      kind: 'documented',
      publisher: 'Continuum',
      document:
        'Search across IRDAI Annual Reports 2023–24 and 2024–25, returns circular and annexure',
      locator: 'String search · “disallow”, “denied”, “not payable”, “deduct”',
      establishes:
        'No prose definition of “claims disallowed” appears in either annual report, the returns circular, or the returns annexure. The string “disallow” occurs once in the 416-page English text of the 2024-25 report, in the Table I.29 column header itself.',
      working:
        'Zero occurrences in the circular’s 44 pages; ten in the annexure, always as the field name. “Denied”, “not payable” and “deduct” occur zero times in the annexure. Does not establish that no definition exists in some instrument we did not examine.',
      retrieved: '2026-09-03',
    },
    {
      id: 'S42',
      kind: 'documented',
      publisher: 'IRDAI',
      document: 'Master Circular on Health Insurance Business',
      locator: 'IRDAI/HLT/CIR/PRO/84/5/2024, 29 May 2024 · covering paragraphs C and D',
      establishes:
        'The covering paragraphs define no terms and refer returns back to the Master Circular on Submission of Returns.',
      working:
        'The body of this circular was not available in full and remains unchecked. It is the most likely place for a field-level instruction we did not find elsewhere.',
      retrieved: '2026-09-02',
    },

    /* ================= UNRESOLVED ================= */
    {
      id: 'S32',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Correspondence between the life and health terminology',
      locator: 'Searched: both annual reports, the returns circular, the returns annexure',
      establishes:
        'Whether the health disallowed column is related to the life “claims rejected” column is not established, in either direction.',
      working:
        'The wording is close. The reporting architectures are not the same, and life reporting splits full non-consideration into two counted buckets where health reporting has no “rejected” field at all. The documents examined do not say how, or whether, the two systems correspond.',
    },
    {
      id: 'S39',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Reason for the printed zero',
      locator: 'Searched: Table I.29 footnotes and surrounding text in both editions',
      establishes:
        'Why the report prints 0.00 and (0) rather than a blank or a dash is not established.',
      working: 'A presentational question the documents do not answer.',
    },
    {
      id: 'S40',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Population the disallowed rupees attach to',
      locator: 'Searched: both annual reports, the returns circular, the returns annexure',
      establishes:
        'Whether the disallowed amount arises only on settled claims, or spans repudiated and outstanding claims too, is not established.',
      working:
        'This is why no per-claim deduction figure appears anywhere on this site: dividing the disallowed amount across settled claims produces a clean-looking percentage and requires an assumption the documents do not support.',
    },
    {
      id: 'S41',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Years outside the tested range',
      locator: 'Tested: 2023–24 and 2024–25 only',
      establishes:
        'Nothing here describes the structure of the table, or the value in the disallowed cell, before 2023-24.',
      working: 'The 2022-23 report would give a third year.',
    },
    {
      id: 'S43',
      kind: 'unresolved',
      publisher: 'Continuum',
      document: 'Provenance of the published row',
      locator: 'Searched: both annual reports and the returns annexure',
      establishes:
        'Whether the annual report compiles the published row from RET_196 alone, or aggregates across RET_196, RET_194 and RET_197, is not established.',
      working:
        'The table carries no provenance note, and the return formats do not indicate which is aggregated into the published summary. Probably unanswerable from public documents.',
    },
  ],

  related: [
    {
      label: 'IRDAI’s health claims table prints ₹18,521 crore against a disallowed count of 0.00 lakh',
      href: '/articles/irdai-health-claims-disallowed-row/',
      note: 'The full investigation behind this reference note — the evidence, the arithmetic, and the strongest case against its own reading.',
    },
    {
      label: 'How a Continuum note is built',
      href: '/methods/',
      note: 'Extraction, arithmetic checks, and the adversarial pass we run against our own draft.',
    },
  ],
};
