import type { ProjectFile } from '@/features/files';

export function makeFile(overrides: Partial<ProjectFile> = {}): ProjectFile {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    project_id: crypto.randomUUID(),
    uploaded_by: crypto.randomUUID(),
    filename: 'spec.pdf',
    content_type: 'application/pdf',
    size: 2048,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
