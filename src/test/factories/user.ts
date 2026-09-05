import type { User } from '@/features/users';

export function makeUser(overrides: Partial<User> = {}): User {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    email: 'user@example.com',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
