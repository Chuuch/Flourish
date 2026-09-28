import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { AgencyTicketList } from './AgencyTicketList';
import { screen } from '@testing-library/react';
import { makeTicket } from '@/test/factories/ticket';
import { makeProject } from '@/test/factories/project';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { AgencyTicketsPage } from '../pages/AgencyTicketsPage';
import type { Ticket } from '../schemas/ticket.schema';
import { updateTicketSchema } from '../schemas/ticket.schema';
import { useAuthStore } from '@/features/auth';

const clientId = '44444444-4444-4444-4444-444444444444';
const ticketsUrl = `${env.API_URL}/clients/${clientId}/tickets`;
const projectsUrl = `${env.API_URL}/clients/${clientId}/projects`;

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

function signInAs(role: 'owner' | 'admin' | 'member') {
  useAuthStore
    .getState()
    .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, role);
}

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
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/comments`, () => HttpResponse.json([])),
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
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/comments`, () => HttpResponse.json([])),
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
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/comments`, () => HttpResponse.json([])),
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

  it('hides remove for members and shows convert', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(ticketsUrl, () =>
        HttpResponse.json([
          makeTicket({
            client_id: clientId,
            title: 'Login button broken',
            kind: 'bug',
            status: 'open',
            body: 'Clicking Sign in does nothing on mobile.',
          }),
        ]),
      ),
      mswHttp.get(projectsUrl, () =>
        HttpResponse.json([makeProject({ client_id: clientId, name: 'Website' })]),
      ),
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/files`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/comments`, () => HttpResponse.json([])),
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    expect(await screen.findByRole('button', { name: 'Convert to task' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove Login button broken' }),
    ).not.toBeInTheDocument();
  });

  it('removes a ticket', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    const ticket = makeTicket({
      client_id: clientId,
      title: 'Login button broken',
      kind: 'bug',
      status: 'open',
      body: 'Clicking Sign in does nothing on mobile.',
    });
    let tickets: Ticket[] = [ticket];

    server.use(
      mswHttp.get(ticketsUrl, () => HttpResponse.json(tickets)),
      mswHttp.get(projectsUrl, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/files`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/comments`, () => HttpResponse.json([])),
      mswHttp.delete(`${env.API_URL}/tickets/${ticket.id}`, () => {
        tickets = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove Login button broken' }));

    expect(await screen.findByText('No tickets yet.')).toBeInTheDocument();
  });

  it('shows a forbidden error from the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const ticket = makeTicket({
      client_id: clientId,
      title: 'Login button broken',
      kind: 'bug',
      status: 'open',
      body: 'Clicking Sign in does nothing on mobile.',
    });

    server.use(
      mswHttp.get(ticketsUrl, () => HttpResponse.json([ticket])),
      mswHttp.get(projectsUrl, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/files`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/comments`, () => HttpResponse.json([])),
      mswHttp.delete(`${env.API_URL}/tickets/${ticket.id}`, () =>
        HttpResponse.json({ error: { code: 'forbidden', message: 'forbidden' } }, { status: 403 }),
      ),
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove Login button broken' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('forbidden');
  });

  it('shows a not-found error from the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const ticket = makeTicket({
      client_id: clientId,
      title: 'Login button broken',
      kind: 'bug',
      status: 'open',
      body: 'Clicking Sign in does nothing on mobile.',
    });

    server.use(
      mswHttp.get(ticketsUrl, () => HttpResponse.json([ticket])),
      mswHttp.get(projectsUrl, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/files`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/:ticketId/comments`, () => HttpResponse.json([])),
      mswHttp.delete(`${env.API_URL}/tickets/${ticket.id}`, () =>
        HttpResponse.json(
          { error: { code: 'ticket_not_found', message: 'ticket not found' } },
          { status: 404 },
        ),
      ),
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove Login button broken' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('ticket not found');
  });
});
