export function formatHours(minutes: number): string {
  return (minutes / 60).toFixed(2);
}

export function formatEUR(cents: number): string {
  return new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

/** 2000 bps → "20%" */
export function formatVATRate(bps: number): string {
  return `${vatBpsToPercent(bps).toFixed(bps % 100 === 0 ? 0 : 2)}%`;
}

/** API stores basis points; 2000 bps = 20%. */
export function vatBpsToPercent(bps: number): number {
  return bps / 100;
}

export function vatPercentToBps(percent: number): number {
  return Math.round(percent * 100);
}
