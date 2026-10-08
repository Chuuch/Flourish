import type { Client } from '@/features/clients';

export function makeClient(overrides: Partial<Client> = {}): Client {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    name: 'Northwind',
    notes: '',
    legal_name: '',
    vat_id: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: '',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
