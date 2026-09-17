/**
 * VISUAL 2 — the three health returns behind the published table.
 *
 * Source: IRDAI returns annexure `Annexure_IRDAI_RET_C.xlsx`, Health Dept.
 *         serial numbers 91–99, referenced by the Master Circular on
 *         Submission of Returns, IRDAI/General/CIR/93/06/2024, 14 June 2024.
 *
 * Matrix rows: C28–C36.
 *
 * This visual describes FIELD STRUCTURE — which cells a return template
 * carries at each claims row — and not what was filed in them. RET_196 is the
 * strongest fact against the article's own reading, so it is shown at full
 * strength rather than buried: the note the article makes is that the three
 * returns do not treat the field uniformly, not that disallowance has no
 * count anywhere in IRDAI's systems.
 */

export type FieldState =
  /** The template carries this cell. */
  | 'present'
  /** The template carries no cell here at all. */
  | 'absent'
  /** The cell exists in the template; the copy examined was blank. */
  | 'blank';

export interface ReturnRow {
  key: string;
  label: string;
  count: FieldState;
  amount: FieldState;
  /** Highlighted as the row under examination. */
  focus?: boolean;
}

export interface ReturnTemplate {
  id: string;
  /** One line, shown under the id in the selector. */
  role: string;
  /** Filing frequency / scope, as specified in the annexure. */
  scope: string;
  /** Status of the copy examined. */
  status: string;
  /** Cell references, so a reader can open the sheet and check. */
  locator: string;
  /** The structural fact that matters for this note. */
  keyObservation: string;
  /** Where this return sits relative to the article's argument. */
  stance: 'supports' | 'against';
  stanceNote: string;
  rows: ReturnRow[];
}

export const returns: ReturnTemplate[] = [
  {
    id: 'RET_194',
    role: 'Annual, state-wise',
    scope: 'Columns specified individually',
    status: 'Format examined',
    locator: 'Sheet IRDAI_RET_194 · row 13 · disallowed at M13, code at M14',
    stance: 'supports',
    keyObservation:
      'Claims paid, repudiated and outstanding each get a count column and an amount column. Claims disallowed gets one column, and it is an amount. There is no field in which an insurer could enter a number of disallowed claims.',
    stanceNote: 'The load-bearing structural row.',
    rows: [
      { key: 'paid', label: 'Claims paid', count: 'present', amount: 'present' },
      { key: 'disallowed', label: 'Claims disallowed', count: 'absent', amount: 'present', focus: true },
      { key: 'repudiated', label: 'Claims repudiated', count: 'present', amount: 'present' },
      { key: 'outstanding', label: 'Claims outstanding', count: 'present', amount: 'present' },
    ],
  },
  {
    id: 'RET_196',
    role: 'In-house and TPA claims',
    scope: 'Generic grid — rows against alternating count / amount columns',
    status: 'Unfilled template',
    locator: 'Sheet IRDAI_RET_196 · rows 16–22 · headers at row 14 · disallowed at B19',
    stance: 'against',
    keyObservation:
      'This is the return whose rows reproduce Table I.29, in the same order. Because it is a generic grid, number-of-claims cells do exist at the disallowed row — seven of them, covering six settlement-mode splits and a total. The copy examined is unfilled throughout, so those cells are blank because nothing in the form is.',
    stanceNote: 'The strongest fact against this article’s reading. Shown in the body, not in a footnote.',
    rows: [
      { key: 'paid', label: 'Claims paid', count: 'blank', amount: 'blank' },
      { key: 'disallowed', label: 'Claims disallowed', count: 'blank', amount: 'blank', focus: true },
      { key: 'repudiated', label: 'Claims repudiated', count: 'blank', amount: 'blank' },
      { key: 'outstanding', label: 'Claims outstanding', count: 'blank', amount: 'blank' },
    ],
  },
  {
    id: 'RET_197',
    role: 'Quarterly',
    scope: 'Columns specified individually',
    status: 'Format examined',
    locator: 'Sheet IRDAI_RET_197 · row 11 · disallowed at N11 · repeats at rows 22, 32, 39',
    stance: 'supports',
    keyObservation:
      'Built the same way as RET_194 and filed quarterly: an amount field at the disallowed row, with repudiated and outstanding each carrying a count beside their amount.',
    stanceNote: 'Shows the design is not confined to one return.',
    rows: [
      { key: 'paid', label: 'Claims paid', count: 'present', amount: 'present' },
      { key: 'disallowed', label: 'Claims disallowed', count: 'absent', amount: 'present', focus: true },
      { key: 'repudiated', label: 'Claims repudiated', count: 'present', amount: 'present' },
      { key: 'outstanding', label: 'Claims outstanding', count: 'present', amount: 'present' },
    ],
  },
];

export const fieldStateMeta: Record<FieldState, { label: string; description: string }> = {
  present: {
    label: 'Field present',
    description: 'The template carries this cell.',
  },
  absent: {
    label: 'No field',
    description: 'The template carries no cell here at all.',
  },
  blank: {
    label: 'Present, blank',
    description: 'The cell exists in the template; the copy examined was not filled in.',
  },
};

/**
 * What the returns attach to each outcome, beyond the fields themselves.
 * Matrix C33–C36. Rendered under the field grid as the second half of the
 * structural argument: repudiation is instrumented, disallowance is not.
 */
export interface Apparatus {
  key: string;
  label: string;
  repudiated: { has: boolean; detail: string };
  disallowed: { has: boolean; detail: string };
}

export const apparatus: Apparatus[] = [
  {
    key: 'count',
    label: 'A count field',
    repudiated: { has: true, detail: 'In all three returns examined' },
    disallowed: { has: false, detail: 'Absent in RET_194 and RET_197' },
  },
  {
    key: 'definition',
    label: 'A written definition',
    repudiated: {
      has: true,
      detail: '“No of claims repudiated means where claim is rejected in full” — RET_194, A145',
    },
    disallowed: { has: false, detail: 'No definition located in any document examined' },
  },
  {
    key: 'ageing',
    label: 'An ageing schedule',
    repudiated: { has: true, detail: 'RET_196, rows 37–49, buckets at B43–B48' },
    disallowed: { has: false, detail: 'Paid and outstanding have one. Disallowed alone does not' },
  },
  {
    key: 'ratio',
    label: 'A published ratio',
    repudiated: {
      has: true,
      detail: 'Repudiation Ratio = claims repudiated ÷ (opening outstanding + registered) — RET_191, A26',
    },
    disallowed: { has: false, detail: 'No disallowance ratio exists' },
  },
];
