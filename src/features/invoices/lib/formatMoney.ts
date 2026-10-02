export function formatHours(minutes: number): string {
  return (minutes / 60).toFixed(2);
}

export function formatEUR(cents: number): string {
  return new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
