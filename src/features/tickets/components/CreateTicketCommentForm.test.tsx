import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CreateTicketForm } from './CreateTicketForm';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { createTicketSchema, type Ticket } from '../schemas/ticket.schema';
import { makeTicket } from '@/test/factories/ticket';
import { useAuthStore } from '@/features/auth';
import { MemoryRouter, Route, Routes } from 'react-router';
import { PortalHomePage } from '@/features/portal';

const ticketsUrl = `${env.API_URL}/client-auth/tickets`;

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

const testClient = {
  id: crypto.randomUUID(),
  organization_id: testOrg.id,
  name: 'Northwind',
  notes: '',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

function signInPortal() {
  useAuthStore
    .getState()
    .setPortalSession(
      { id: crypto.randomUUID(), email: 'pat@example.com' },
      'token',
      testOrg,
      testClient,
      'client',
    );
}

describe('CreateTicketForm', () => {
  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    signInPortal();
    renderWithProviders(<CreateTicketForm />);

    await user.click(screen.getByRole('button', { name: 'Submit ticket' }));

    expect(await screen.findByText('Title must be at least 4 characters')).toBeInTheDocument();
  });

  it('creates a ticket and refreshes the list', async () => {
    const user = userEvent.setup();
    signInPortal();
    const tickets: Ticket[] = [];

    server.use(
      mswHttp.get(ticketsUrl, () => HttpResponse.json(tickets)),
      mswHttp.post(ticketsUrl, async ({ request }) => {
        const input = createTicketSchema.parse(await request.json());
        const created = makeTicket({
          client_id: testClient.id,
          kind: input.kind,
          title: input.title,
          body: input.body,
          status: 'open',
        });
        tickets.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
      mswHttp.get(`${ticketsUrl}/:ticketId/files`, () => HttpResponse.json([])),
      mswHttp.get(`${ticketsUrl}/:ticketId/comments`, () => HttpResponse.json([])),
    );

    renderWithProviders(
      <MemoryRouter initialEntries={['/portal']}>
        <Routes>
          <Route path="/portal" element={<PortalHomePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('No tickets yet.')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Kind'), 'bug');
    await user.type(screen.getByLabelText('Title'), 'Login button broken');
    await user.type(screen.getByLabelText('Body'), 'Clicking Sign in does nothing on mobile.');
    await user.click(screen.getByRole('button', { name: 'Submit ticket' }));

    expect(await screen.findByText('Login button broken (bug) — open')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('');
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    signInPortal();
    server.use(
      mswHttp.post(ticketsUrl, () =>
        HttpResponse.json({ error: { message: 'client not found' } }, { status: 404 }),
      ),
    );

    renderWithProviders(<CreateTicketForm />);

    await user.type(screen.getByLabelText('Title'), 'Login button broken');
    await user.type(screen.getByLabelText('Body'), 'Nothing happens.');
    await user.click(screen.getByRole('button', { name: 'Submit ticket' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('client not found');
  });
});
