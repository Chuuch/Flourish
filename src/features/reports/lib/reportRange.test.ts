import { describe, expect, it } from 'vitest';
import { defaultReportDates, reportRange } from './reportRange';

describe('reportRange', () => {
  it('makes to exclusive of the selected end date', () => {
    expect(reportRange('2026-09-28', '2026-10-04')).toEqual({
      from: '2026-09-28T00:00:00.000Z',
      to: '2026-10-05T00:00:00.000Z',
    });
  });

  it('defaults to the last seven UTC days inclusive', () => {
    expect(defaultReportDates(new Date('2026-10-04T15:04:05.000Z'))).toEqual({
      from: '2026-09-28',
      to: '2026-10-04',
    });
  });
});
