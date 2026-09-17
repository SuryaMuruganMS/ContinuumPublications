/**
 * VISUAL 1 — Table I.29, two-year comparison.
 *
 * Source: IRDAI Annual Report 2024-25, printed p.43 (PDF index 274) and
 *         IRDAI Annual Report 2023-24, printed p.43 (PDF index 254).
 * Table:  "Status of Claims under Health Insurance of General and Health Insurers"
 *         (no. in lakhs, amount in ₹ crore). Footnote: "Figures in brackets are
 *         percentage to total."
 *
 * Matrix rows: C01–C17, C23–C27.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EXTRACTION POLICY
 * ─────────────────────────────────────────────────────────────────────────
 * `null` does not mean zero. It means "present in the source, not extracted".
 * The component renders null as a dimmed, inert slot. Every cell below is
 * extracted and checked, so nothing is null today — the mechanism exists so
 * that a future note can publish a partial table honestly rather than
 * padding it out.
 *
 * `percent: null` means the table prints no bracket on that row. The opening
 * and new-claims rows genuinely carry none (C07–C10, C17).
 */

export type CellEvidence = 'documented' | 'calculated' | 'not-reproduced';

export interface TableCell {
  /** null = present in the source, not reproduced here. */
  value: number | null;
  /** The bracketed percentage as printed, or null where none is printed. */
  percent: number | null;
  evidence: CellEvidence;
  /** Shown in the cell's title and in the accessible description. */
  note?: string;
}

export interface TableRow {
  key: string;
  label: string;
  /** Count of claims, in lakh, as printed. */
  number: TableCell;
  /** Amount, in ₹ crore, as printed. */
  amount: TableCell;
  /** The row the article is about. Rendered as the hero row. */
  focus?: boolean;
  /**
   * Where the row sits in the flow statement:
   *   opening  — carried in from last year
   *   inflow   — new claims registered
   *   total    — opening + inflow
   *   disposal — the four rows that account for the total
   */
  role: 'opening' | 'inflow' | 'total' | 'disposal';
}

export interface TableYear {
  year: string;
  label: string;
  sourceLocator: string;
  rows: TableRow[];
  /**
   * Our arithmetic on the printed values (matrix C18, C19). Printed in the
   * visual's reconciliation view and labelled as ours, never as IRDAI's.
   */
  reconciliation: {
    numberInflow: string;
    numberDisposal: string;
    amountInflow: string;
    amountDisposal: string;
    /** Residual against the printed total, in the table's own units. */
    numberResidual: number;
    amountResidual: number;
  };
}

export const tableI29: TableYear[] = [
  {
    year: '2023-24',
    label: '2023–24',
    sourceLocator: 'IRDAI Annual Report 2023–24 · Table I.29 · printed page 43',
    rows: [
      {
        key: 'opening',
        label: 'Claims outstanding at the beginning',
        role: 'opening',
        number: { value: 17.85, percent: null, evidence: 'documented' },
        amount: { value: 6290.28, percent: null, evidence: 'documented' },
      },
      {
        key: 'registered',
        label: 'New claims registered',
        role: 'inflow',
        number: { value: 307.87, percent: null, evidence: 'documented' },
        amount: { value: 110825.06, percent: null, evidence: 'documented' },
      },
      {
        key: 'total',
        label: 'Total claims',
        role: 'total',
        number: { value: 325.72, percent: 100, evidence: 'documented' },
        amount: { value: 117115.34, percent: 100, evidence: 'documented' },
      },
      {
        key: 'paid',
        label: 'Claims paid',
        role: 'disposal',
        number: { value: 268.59, percent: 82.46, evidence: 'documented' },
        amount: { value: 83493.17, percent: 71.29, evidence: 'documented' },
      },
      {
        key: 'disallowed',
        label: 'Claims disallowed as per terms and conditions',
        role: 'disposal',
        focus: true,
        number: {
          value: 0,
          percent: 0,
          evidence: 'documented',
          note: 'Printed as 0.00 lakh with the bracket printed as (0). Claim numbers in this table are given in lakh to two decimal places, so 0.00 is what the table prints at that precision.',
        },
        amount: {
          value: 15100.42,
          percent: 12.9,
          evidence: 'documented',
          note: 'Printed as ₹15,100.42 crore, bracketed (12.90) — a share of the total claim amount, per the table footnote.',
        },
      },
      {
        key: 'repudiated',
        label: 'Claims repudiated during the period',
        role: 'disposal',
        number: { value: 36.4, percent: 11.18, evidence: 'documented' },
        amount: { value: 10937.18, percent: 9.34, evidence: 'documented' },
      },
      {
        key: 'closing',
        label: 'Claims outstanding at the end',
        role: 'disposal',
        number: { value: 20.73, percent: 6.36, evidence: 'documented' },
        amount: { value: 7584.57, percent: 6.48, evidence: 'documented' },
      },
    ],
    reconciliation: {
      numberInflow: '17.85 + 307.87 = 325.72',
      numberDisposal: '268.59 + 0.00 + 36.40 + 20.73 = 325.72',
      amountInflow: '6,290.28 + 1,10,825.06 = 1,17,115.34',
      amountDisposal: '83,493.17 + 15,100.42 + 10,937.18 + 7,584.57 = 1,17,115.34',
      numberResidual: 0,
      amountResidual: 0,
    },
  },
  {
    year: '2024-25',
    label: '2024–25',
    sourceLocator: 'IRDAI Annual Report 2024–25 · Table I.29 · printed page 43',
    rows: [
      {
        key: 'opening',
        label: 'Claims outstanding at the beginning',
        role: 'opening',
        number: { value: 20.73, percent: null, evidence: 'documented' },
        amount: { value: 7584.58, percent: null, evidence: 'documented' },
      },
      {
        key: 'registered',
        label: 'New claims registered',
        role: 'inflow',
        number: { value: 351.85, percent: null, evidence: 'documented' },
        amount: { value: 124903.22, percent: null, evidence: 'documented' },
      },
      {
        key: 'total',
        label: 'Total claims',
        role: 'total',
        number: { value: 372.58, percent: 100, evidence: 'documented' },
        amount: { value: 132487.81, percent: 100, evidence: 'documented' },
      },
      {
        key: 'paid',
        label: 'Claims paid',
        role: 'disposal',
        number: { value: 326.01, percent: 87.5, evidence: 'documented' },
        amount: { value: 94247.6, percent: 71.14, evidence: 'documented' },
      },
      {
        key: 'disallowed',
        label: 'Claims disallowed as per terms and conditions',
        role: 'disposal',
        focus: true,
        number: {
          value: 0,
          percent: 0,
          evidence: 'documented',
          note: 'Printed as 0.00 lakh with the bracket printed as (0), exactly as in the preceding edition.',
        },
        amount: {
          value: 18521.02,
          percent: 13.98,
          evidence: 'documented',
          note: 'Printed as ₹18,521.02 crore, bracketed (13.98) — a share of the total claim amount, per the table footnote.',
        },
      },
      {
        key: 'repudiated',
        label: 'Claims repudiated during the period',
        role: 'disposal',
        number: { value: 29.51, percent: 7.92, evidence: 'documented' },
        amount: { value: 11412.42, percent: 8.61, evidence: 'documented' },
      },
      {
        key: 'closing',
        label: 'Claims outstanding at the end',
        role: 'disposal',
        number: { value: 17.07, percent: 4.58, evidence: 'documented' },
        amount: { value: 8306.76, percent: 6.27, evidence: 'documented' },
      },
    ],
    reconciliation: {
      numberInflow: '20.73 + 351.85 = 372.58',
      numberDisposal: '326.01 + 0.00 + 29.51 + 17.07 = 372.59',
      amountInflow: '7,584.58 + 1,24,903.22 = 1,32,487.80',
      amountDisposal: '94,247.60 + 18,521.02 + 11,412.42 + 8,306.76 = 1,32,487.80',
      numberResidual: 0.01,
      amountResidual: -0.01,
    },
  },
];

/**
 * The figures the note turns on. Used by the homepage, the archive card and
 * the social card so the headline numbers are never typed twice.
 */
export const headlineFigure = {
  /** The 2024-25 disallowed amount. */
  amount: 18521.02,
  amountDisplay: '₹18,521.02 crore',
  amountPercent: 13.98,
  /** The prior year's disallowed amount. */
  priorAmount: 15100.42,
  priorAmountDisplay: '₹15,100.42 crore',
  priorAmountPercent: 12.9,
  /** The count printed on the same row, in both years. */
  count: 0,
  countDisplay: '0.00 lakh',
  countPercent: 0,
  /**
   * Occurrences of the string "disallow" in the 416-page English text of the
   * 2024-25 annual report. Matrix C37.
   */
  disallowMentions: 1,
  reportPages: 416,
};
