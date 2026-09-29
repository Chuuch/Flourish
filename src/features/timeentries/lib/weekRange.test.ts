import { describe, expect, it } from 'vitest';
import { startOfUtcMonday, utcWeekRange } from './weekRange';

describe('weekRange', () => {
  it('starts ISO weeks on Monday UTC', () => {
    const tuesday = new Date('2026-09-29T15:00:00.000Z');
    const start = startOfUtcMonday(tuesday);

    expect(start.toISOString()).toBe('2026-09-28T00:00:00.000Z');
  });

  it('returns a half-open week range', () => {
    const tuesday = new Date('2026-09-29T15:00:00.000Z');
    const week = utcWeekRange(0, tuesday);

    expect(week.from).toBe('2026-09-28T00:00:00.000Z');
    expect(week.to).toBe('2026-10-05T00:00:00.000Z');
  });

  it('shifts by whole weeks', () => {
    const tuesday = new Date('2026-09-29T15:00:00.000Z');
    const previous = utcWeekRange(-1, tuesday);

    expect(previous.from).toBe('2026-09-21T00:00:00.000Z');
    expect(previous.to).toBe('2026-09-28T00:00:00.000Z');
  });
});
