import type { Client } from '@/features/clients';

export function makeClient(overrides: Partial<Client> = {}): Client {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    name: 'Northwind',
    notes: '',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
