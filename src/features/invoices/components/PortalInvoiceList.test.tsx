import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { PortalInvoiceList } from './PortalInvoiceList';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const invoicesUrl = `${env.API_URL}/client-auth/invoices`;
const invoiceId = '55555555-5555-5555-8555-555555555555';
const lineId = '66666666-6666-6666-8666-666666666666';
const orgId = '22222222-2222-2222-8222-222222222222';
const clientId = '44444444-4444-4444-8444-444444444444';

const sentInvoice = {
  id: invoiceId,
  organization_id: orgId,
  client_id: clientId,
  number: 'INV-2026-0001',
  status: 'sent',
  currency: 'EUR',
  rate_cents: 3000,
  organization_name: 'Acme',
  client_name: 'Northwind',
  period_from: '2026-09-28T00:00:00.000Z',
  period_to: '2026-10-05T00:00:00.000Z',
  issued_at: '2026-10-01T12:00:00.000Z',
  due_at: '2026-10-15T12:00:00.000Z',
  sent_at: '2026-10-01T12:00:00.000Z',
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
};

describe('PortalInvoiceList', () => {
  it('renders invoices returned by the API', async () => {
    server.use(
      mswHttp.get(invoicesUrl, () =>
        HttpResponse.json({ items: [sentInvoice], next_cursor: null }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <PortalInvoiceList />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: /INV-2026-0001/ })).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(invoicesUrl, () => HttpResponse.json({ items: [], next_cursor: null })));

    renderWithProviders(
      <MemoryRouter>
        <PortalInvoiceList />
      </MemoryRouter>,
    );

    expect(await screen.findByText('No invoices yet.')).toBeInTheDocument();
  });
});
