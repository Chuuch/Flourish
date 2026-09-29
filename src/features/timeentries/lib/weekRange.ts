export function startOfUtcMonday(now: Date): Date {
  const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const weekday = day.getUTCDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  day.setUTCDate(day.getUTCDate() + offset);
  return day;
}

export function utcWeekRange(
  weekOffset = 0,
  now = new Date(),
): {
  from: string;
  to: string;
} {
  const start = startOfUtcMonday(now);
  start.setUTCDate(start.getUTCDate() + weekOffset * 7);
  const end = new Date(start.getTime());
  end.setUTCDate(end.getUTCDate() + 7);

  return { from: start.toISOString(), to: end.toISOString() };
}
