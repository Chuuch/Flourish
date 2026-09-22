import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { AgencyTicketList } from './AgencyTicketList';
import { screen } from '@testing-library/react';
import { makeTicket } from '@/test/factories/ticket';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { AgencyTicketsPage } from '../pages/AgencyTicketsPage';
import type { Ticket } from '../schemas/ticket.schema';
import { updateTicketSchema } from '../schemas/ticket.schema';

const clientId = '44444444-4444-4444-4444-444444444444';
const ticketsUrl = `${env.API_URL}/clients/${clientId}/tickets`;

describe('AgencyTicketList', () => {
  it('renders tickets returned by the API', async () => {
    const login = makeTicket({
      client_id: clientId,
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
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/files`, () => HttpResponse.json([])),
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    expect(await screen.findByText('Login button broken (bug)')).toBeInTheDocument();
    expect(screen.getByText('Clicking Sign in does nothing on mobile.')).toBeInTheDocument();
    expect(screen.getByText('Add export (feature)')).toBeInTheDocument();
    expect(screen.getByLabelText('Status for Login button broken')).toHaveValue('open');
  });

  it('updates ticket status with the last-seen version', async () => {
    const user = userEvent.setup();
    let ticket: Ticket = makeTicket({
      client_id: clientId,
      title: 'Login button broken',
      kind: 'bug',
      status: 'open',
      version: 1,
    });

    server.use(
      mswHttp.get(ticketsUrl, () => HttpResponse.json([ticket])),
      mswHttp.patch(`${env.API_URL}/tickets/${ticket.id}`, async ({ request }) => {
        const input = updateTicketSchema.parse(await request.json());
        expect(input.version).toBe(1);
        ticket = { ...ticket, status: input.status, version: input.version + 1 };
        return HttpResponse.json(ticket);
      }),
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/files`, () => HttpResponse.json([])),
    );

    renderWithProviders(
      <MemoryRouter initialEntries={[`/clients/${clientId}/tickets`]}>
        <Routes>
          <Route path="/clients/:clientId/tickets" element={<AgencyTicketsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText('Status for Login button broken')).toHaveValue('open');

    await user.selectOptions(
      screen.getByLabelText('Status for Login button broken'),
      'in_progress',
    );

    expect(await screen.findByLabelText('Status for Login button broken')).toHaveValue(
      'in_progress',
    );
  });

  it('renders a version conflict on update', async () => {
    const user = userEvent.setup();
    const ticket = makeTicket({
      client_id: clientId,
      title: 'Login button broken',
      kind: 'bug',
      status: 'open',
      version: 1,
    });

    server.use(
      mswHttp.get(ticketsUrl, () => HttpResponse.json([ticket])),
      mswHttp.patch(`${env.API_URL}/tickets/${ticket.id}`, () =>
        HttpResponse.json(
          {
            error: {
              code: 'ticket_version_mismatch',
              message: 'ticket was updated by someone else',
            },
          },
          { status: 409 },
        ),
      ),
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/files`, () => HttpResponse.json([])),
    );

    renderWithProviders(
      <MemoryRouter initialEntries={[`/clients/${clientId}/tickets`]}>
        <Routes>
          <Route path="/clients/:clientId/tickets" element={<AgencyTicketsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText('Status for Login button broken')).toHaveValue('open');

    await user.selectOptions(
      screen.getByLabelText('Status for Login button broken'),
      'in_progress',
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'ticket was updated by someone else',
    );
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(ticketsUrl, () => HttpResponse.json([])));
    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    expect(await screen.findByText('No tickets yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(ticketsUrl, () =>
        HttpResponse.json({ error: { message: 'client not found' } }, { status: 404 }),
      ),
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('client not found');
  });
});
