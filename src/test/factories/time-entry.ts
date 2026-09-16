import type { TimeEntry } from '@/features/timeentries';

export function makeTimeEntry(overrides: Partial<TimeEntry> = {}): TimeEntry {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    task_id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    minutes: 90,
    notes: '',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
