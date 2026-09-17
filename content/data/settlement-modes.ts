/**
 * VISUAL 3 — number against amount, Table I.28.
 *
 * Source: IRDAI Annual Report 2023-24, Table I.28, printed p.43 (PDF idx 254),
 *         read against paragraph I.6.5.5 on the same printed page.
 *
 * Matrix rows: C48, C49, C50, C51.
 *
 * The point of this visual is not the settlement modes. It is that a number
 * share and an amount share are different quantities, that the report's own
 * narrative paragraph paired one of each and called both numbers, and that
 * the two therefore total 105 per cent.
 */

export interface ModeShare {
  key: string;
  label: string;
  /** Claims settled, in lakh. */
  claims: number;
  /** Amount settled, in ₹ crore. */
  amount: number;
  /** Share of claims by count, per cent. Our division; see `working`. */
  byNumber: number;
  /** Share of claims by rupee value, per cent. */
  byAmount: number;
  /** Whether the table prints these as bracketed figures. */
  printed: boolean;
  reading: string;
}

/** Totals for all claims paid in 2023-24, the denominator for both shares. */
export const settlementTotals = {
  claims: 268.59,
  amount: 83493.17,
};

export const settlementModes: ModeShare[] = [
  {
    key: 'cashless',
    label: 'Cashless',
    claims: 156.84,
    amount: 55235.09,
    byNumber: 58.39,
    byAmount: 66.16,
    printed: true,
    reading:
      'Cashless takes a larger share of the money than of the claims. Table I.28 prints both brackets: (58.39) and (66.16).',
  },
  {
    key: 'reimbursement',
    label: 'Reimbursement',
    claims: 104.65,
    amount: 26176.56,
    byNumber: 38.96,
    byAmount: 31.35,
    printed: false,
    reading:
      'Reimbursement runs the other way — more claims, less money. The 38.96 per cent by number is the “another 39 per cent” of the narrative paragraph.',
  },
];

export const settlementModesMeta = {
  sourceLocator: 'IRDAI Annual Report 2023–24 · Table I.28 · printed page 43',
  working:
    '156.84 ÷ 268.59 = 58.39% · 55,235.09 ÷ 83,493.17 = 66.16% · 104.65 ÷ 268.59 = 38.96% · 26,176.56 ÷ 83,493.17 = 31.35%',
  residualLabel: 'Modes not shown above',
  note:
    'The two modes above do not exhaust the table; the remainder belongs to settlement modes this note does not take up.',
};

/**
 * The narrative paragraph, and what it pairs. This is the part of the visual
 * that carries the argument — the figures are only the setup.
 */
export const narrativeMismatch = {
  locator: 'IRDAI Annual Report 2023–24 · ¶I.6.5.5 · printed page 43',
  claimed: [
    { label: 'Cashless', stated: 66.16, actualBasis: 'amount', numberBasis: 58.39 },
    { label: 'Reimbursement', stated: 39, actualBasis: 'number', numberBasis: 38.96 },
  ],
  /** 66.16 + 39 — the paragraph describes both as shares of the number of claims. */
  statedTotal: 105.16,
  reading:
    'The paragraph states that 66.16 per cent of the total number of claims were settled cashless, and another 39 per cent through reimbursement. Table I.28 on the same page gives 66.16 as the amount share and 58.39 as the number share. The sentence pairs an amount share with a number share and describes both as numbers, which is why they total more than a hundred.',
  followingYear:
    'The 2024-25 report states it differently: 58 per cent settled cashless by number, 41 per cent by reimbursement, with the amount share of 66.35 per cent given separately. Its own Table I.28 prints the number share as (57.96). Why the two reports differ is not something these documents say.',
};

/** Derived, not typed in. Shown in the visual as a CALCULATED value. */
export function residual() {
  const number = settlementModes.reduce((sum, m) => sum + m.byNumber, 0);
  const amount = settlementModes.reduce((sum, m) => sum + m.byAmount, 0);
  return {
    byNumber: Number((100 - number).toFixed(2)),
    byAmount: Number((100 - amount).toFixed(2)),
  };
}

/** The gap between a mode's amount share and its number share, in points. */
export function spread(mode: ModeShare) {
  return Number((mode.byAmount - mode.byNumber).toFixed(2));
}
