import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TicketList } from './TicketList';
import { screen } from '@testing-library/react';
import { makeTicket } from '@/test/factories/ticket';
import userEvent from '@testing-library/user-event';

const ticketsUrl = `${env.API_URL}/client-auth/tickets`;

describe('TicketList', () => {
  it('renders tickets as a compact list', async () => {
    const login = makeTicket({
      title: 'Login button broken',
      kind: 'bug',
      status: 'open',
      body: 'Clicking Sign in does nothing on mobile.',
    });

    server.use(
      mswHttp.get(ticketsUrl, () =>
        HttpResponse.json({
          items: [
            login,
            makeTicket({
              title: 'Add export',
              kind: 'feature',
              status: 'in_progress',
              body: 'CSV',
            }),
          ],
          next_cursor: null,
        }),
      ),
    );

    renderWithProviders(<TicketList />);

    expect(await screen.findByRole('button', { name: /Login button broken/ })).toBeInTheDocument();
    expect(screen.getByText('Clicking Sign in does nothing on mobile.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add export/ })).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
  });

  it('opens a ticket detail', async () => {
    const user = userEvent.setup();
    const login = makeTicket({
      title: 'Login button broken',
      kind: 'bug',
      status: 'open',
      body: 'Clicking Sign in does nothing on mobile.',
    });

    server.use(
      mswHttp.get(ticketsUrl, () => HttpResponse.json({ items: [login], next_cursor: null })),
      mswHttp.get(`${ticketsUrl}/${login.id}/files`, () => HttpResponse.json([])),
      mswHttp.get(`${ticketsUrl}/${login.id}/comments`, () => HttpResponse.json([])),
    );

    renderWithProviders(<TicketList />);

    await user.click(await screen.findByRole('button', { name: /Login button broken/ }));

    expect(await screen.findByRole('button', { name: 'Back to tickets' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Login button broken/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Attachment' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Comments' })).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(ticketsUrl, () => HttpResponse.json({ items: [], next_cursor: null })));
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
