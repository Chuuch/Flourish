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
import { chooseSelectOption } from '@/test/select';
import { MemoryRouter, Route, Routes } from 'react-router';
import { AgencyTicketsPage } from '../pages/AgencyTicketsPage';
import type { Ticket } from '../schemas/ticket.schema';
import { updateTicketSchema } from '../schemas/ticket.schema';
import { useAuthStore } from '@/features/auth';
import { makeOrganization } from '@/test/factories/organization';

const clientId = '44444444-4444-4444-8444-444444444444';
const ticketsUrl = `${env.API_URL}/clients/${clientId}/tickets`;
const projectsUrl = `${env.API_URL}/clients/${clientId}/projects`;
const membersUrl = `${env.API_URL}/members`;

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

function signInAs(role: 'owner' | 'admin' | 'member') {
  useAuthStore
    .getState()
    .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, role);
}

async function openTicket(user: ReturnType<typeof userEvent.setup>, title: string) {
  await user.click(await screen.findByRole('button', { name: new RegExp(title) }));
}

describe('AgencyTicketList', () => {
  it('renders tickets as a compact list', async () => {
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
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    expect(await screen.findByRole('button', { name: /Login button broken/ })).toBeInTheDocument();
    expect(screen.getByText('(bug)')).toBeInTheDocument();
    expect(screen.getByText('Clicking Sign in does nothing on mobile.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add export/ })).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.queryByLabelText('Status for Login button broken')).not.toBeInTheDocument();
  });

  it('opens a ticket and updates status with the last-seen version', async () => {
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
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/clients/${clientId}/users`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/${ticket.id}/files`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/${ticket.id}/comments`, () => HttpResponse.json([])),
      mswHttp.get(projectsUrl, () => HttpResponse.json([])),
      mswHttp.patch(`${env.API_URL}/tickets/${ticket.id}`, async ({ request }) => {
        const input = updateTicketSchema.parse(await request.json());
        expect(input.version).toBe(1);
        ticket = { ...ticket, status: input.status, version: input.version + 1 };
        return HttpResponse.json(ticket);
      }),
    );

    renderWithProviders(
      <MemoryRouter initialEntries={[`/clients/${clientId}/tickets`]}>
        <Routes>
          <Route path="/clients/:clientId/tickets" element={<AgencyTicketsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await openTicket(user, 'Login button broken');
    expect(await screen.findByLabelText('Status for Login button broken')).toHaveAttribute(
      'data-value',
      'open',
    );

    await chooseSelectOption(user, 'Status for Login button broken', 'in_progress');

    expect(await screen.findByLabelText('Status for Login button broken')).toHaveAttribute(
      'data-value',
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
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/clients/${clientId}/users`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/${ticket.id}/files`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/${ticket.id}/comments`, () => HttpResponse.json([])),
      mswHttp.get(projectsUrl, () => HttpResponse.json([])),
      mswHttp.patch(`${env.API_URL}/tickets/${ticket.id}`, () =>
        HttpResponse.json({ error: { message: 'version conflict' } }, { status: 409 }),
      ),
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    await openTicket(user, 'Login button broken');
    expect(await screen.findByLabelText('Status for Login button broken')).toHaveAttribute(
      'data-value',
      'open',
    );

    await chooseSelectOption(user, 'Status for Login button broken', 'in_progress');

    expect(await screen.findByRole('alert')).toHaveTextContent('version conflict');
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(ticketsUrl, () => HttpResponse.json([])));
    renderWithProviders(<AgencyTicketList clientId={clientId} />);
    expect(await screen.findByText('No tickets yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(ticketsUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });

  it('lets an owner delete a ticket', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const ticket = makeTicket({
      client_id: clientId,
      title: 'Login button broken',
      kind: 'bug',
    });
    let tickets: Ticket[] = [ticket];

    server.use(
      mswHttp.get(ticketsUrl, () => HttpResponse.json(tickets)),
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/clients/${clientId}/users`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/${ticket.id}/files`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/${ticket.id}/comments`, () => HttpResponse.json([])),
      mswHttp.get(projectsUrl, () => HttpResponse.json([])),
      mswHttp.delete(`${env.API_URL}/tickets/${ticket.id}`, () => {
        tickets = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    await openTicket(user, 'Login button broken');
    await user.click(await screen.findByRole('button', { name: 'Remove Login button broken' }));

    expect(await screen.findByText('No tickets yet.')).toBeInTheDocument();
  });

  it('hides delete for members', async () => {
    const user = userEvent.setup();
    signInAs('member');
    const ticket = makeTicket({
      client_id: clientId,
      title: 'Login button broken',
      kind: 'bug',
    });

    server.use(
      mswHttp.get(ticketsUrl, () => HttpResponse.json([ticket])),
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/clients/${clientId}/users`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/${ticket.id}/files`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tickets/${ticket.id}/comments`, () => HttpResponse.json([])),
      mswHttp.get(projectsUrl, () => HttpResponse.json([makeProject({ client_id: clientId })])),
    );

    renderWithProviders(<AgencyTicketList clientId={clientId} />);

    await openTicket(user, 'Login button broken');
    expect(await screen.findByLabelText('Status for Login button broken')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove Login button broken/ }),
    ).not.toBeInTheDocument();
  });
});
