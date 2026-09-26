import type { Task } from '@/features/tasks';

export function makeTask(overrides: Partial<Task> = {}): Task {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    project_id: crypto.randomUUID(),
    ticket_id: null,
    title: 'Fix login',
    notes: '',
    status: 'todo',
    completed_at: null,
    created_by: null,
    assignee_id: null,
    version: 1,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
