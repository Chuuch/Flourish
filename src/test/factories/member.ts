import type { Member } from '@/features/members';

export function makeMember(overrides: Partial<Member> = {}): Member {
  return {
    user_id: crypto.randomUUID(),
    email: 'member@example.com',
    role: 'member',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}
