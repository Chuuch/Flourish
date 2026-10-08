import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { InvoiceList } from './InvoiceList';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useAuthStore } from '@/features/auth';
import { makeOrganization } from '@/test/factories/organization';

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

const clientId = '44444444-4444-4444-8444-444444444444';
const invoiceId = '55555555-5555-5555-8555-555555555555';
const lineId = '66666666-6666-6666-8666-666666666666';

describe('InvoiceList', () => {
  it('renders invoices returned by the API', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(`${env.API_URL}/clients/${clientId}/invoices`, () =>
        HttpResponse.json({
          items: [
            {
              id: invoiceId,
              organization_id: testOrg.id,
              client_id: clientId,
              number: 'INV-2026-0001',
              status: 'draft',
              currency: 'EUR',
              rate_cents: 3000,
              organization_name: 'Acme',
              client_name: 'Northwind',
              period_from: '2026-09-28T00:00:00.000Z',
              period_to: '2026-10-05T00:00:00.000Z',
              issued_at: '2026-10-01T12:00:00.000Z',
              due_at: '2026-10-15T12:00:00.000Z',
              sent_at: null,
              paid_at: null,
              total_minutes: 90,
              total_cents: 4500,
              created_at: '2026-10-01T12:00:00.000Z',
              updated_at: '2026-10-01T12:00:00.000Z',
              lines: [
                {
                  id: lineId,
                  project_name: 'Portal',
                  task_title: 'Draw',
                  minutes: 90,
                  amount_cents: 4500,
                  position: 1,
                },
              ],
            },
          ],
          next_cursor: null,
        }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <InvoiceList clientId={clientId} />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: /INV-2026-0001/ })).toHaveAttribute(
      'href',
      `/clients/${clientId}/invoices/${invoiceId}`,
    );
  });
});
