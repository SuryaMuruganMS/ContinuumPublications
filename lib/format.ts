/** Formatting helpers. Indian digit grouping throughout — this is a desk that
 *  reads Indian financial documents, and 18,521.02 should look like it does in
 *  the source, not like 18,521.02 in some other convention. */

const inr = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrCompact = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

export function formatFigure(value: number, decimals = 2): string {
  return decimals === 0 ? inrCompact.format(value) : inr.format(value);
}

/** 18521.02 -> "₹18,521.02 crore" */
export function formatCrore(value: number, decimals = 2): string {
  return `\u20B9${formatFigure(value, decimals)} crore`;
}

/** 0 -> "0.00 lakh" */
export function formatLakh(value: number, decimals = 2): string {
  return `${formatFigure(value, decimals)} lakh`;
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/** 1 -> "0001". Archive index numbers. */
export function pad(value: number, width = 4): string {
  return String(value).padStart(width, '0');
}

/** ISO -> "13 September 2026" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/** ISO -> "13.09.2026" — the compact form used in rails and indexes. */
export function formatDateCompact(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
}

/** ISO -> "2026-09-13", for <time dateTime> and machine-readable output. */
export function isoDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function readingTimeLabel(minutes?: number): string {
  if (!minutes) return '';
  return `${minutes} min read`;
}
