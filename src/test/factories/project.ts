import type { Project } from '@/features/projects';

export function makeProject(overrides: Partial<Project> = {}): Project {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    client_id: crypto.randomUUID(),
    name: 'Website',
    notes: '',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
