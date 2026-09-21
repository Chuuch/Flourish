import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TicketList } from './TicketList';
import { screen } from '@testing-library/react';
import { makeTicket } from '@/test/factories/ticket';

const ticketsUrl = `${env.API_URL}/client-auth/tickets`;

describe('TicketList', () => {
  it('renders tickets returned by the API', async () => {
    const login = makeTicket({
      title: 'Login button broken',
      kind: 'bug',
      status: 'open',
      body: 'Clicking Sign in does nothing on mobile.',
    });

    server.use(
      mswHttp.get(ticketsUrl, () =>
        HttpResponse.json([
          login,
          makeTicket({ title: 'Add export', kind: 'feature', status: 'in_progress', body: 'CSV' }),
        ]),
      ),
      mswHttp.get(`${ticketsUrl}/:ticketId/files`, () => HttpResponse.json([])),
    );

    renderWithProviders(<TicketList />);

    expect(await screen.findByText('Login button broken (bug) — open')).toBeInTheDocument();
    expect(screen.getByText('Clicking Sign in does nothing on mobile.')).toBeInTheDocument();
    expect(screen.getByText('Add export (feature) — in_progress')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(ticketsUrl, () => HttpResponse.json([])));
    renderWithProviders(<TicketList />);

    expect(await screen.findByText('No tickets yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(ticketsUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<TicketList />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });
});
