import type { Task } from '@/features/tasks';

export function makeTask(overrides: Partial<Task> = {}): Task {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    project_id: crypto.randomUUID(),
    title: 'Fix login',
    notes: '',
    status: 'todo',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
