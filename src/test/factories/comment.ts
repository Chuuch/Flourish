import type { Comment } from '@/features/comments';

export function makeComment(overrides: Partial<Comment> = {}): Comment {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    task_id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    body: 'Check the OAuth redirect',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
