import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CreateClientForm } from './CreateClientForm';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { createClientSchema, type Client } from '../schemas/client.schema';
import { makeClient } from '@/test/factories/client';
import { ClientsPage } from '../pages/ClientsPage';
import { useAuthStore } from '@/features/auth';
import { MemoryRouter } from 'react-router';

const clientsUrl = `${env.API_URL}/clients`;

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

describe('CreateClientForm', () => {
  it('hides the form for members', () => {
    signInAs('member');
    renderWithProviders(<CreateClientForm />);

    expect(screen.queryByRole('button', { name: 'Add client' })).not.toBeInTheDocument();
  });

  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    renderWithProviders(<CreateClientForm />);

    await user.click(screen.getByRole('button', { name: 'Add client' }));

    expect(await screen.findByText('Name must be at least 4 characters')).toBeInTheDocument();
  });

  it('creates a client and refreshes the list', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const clients: Client[] = [];

    server.use(
      mswHttp.get(clientsUrl, () => HttpResponse.json(clients)),
      mswHttp.post(clientsUrl, async ({ request }) => {
        const input = createClientSchema.parse(await request.json());
        const created = makeClient({ name: input.name, notes: input.notes });
        clients.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <ClientsPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText('No clients yet.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Name'), 'Northwind');
    await user.type(screen.getByLabelText('Notes'), 'Retail');
    await user.click(screen.getByRole('button', { name: 'Add client' }));

    expect(await screen.findByText('Northwind - Retail')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    server.use(
      mswHttp.post(clientsUrl, () =>
        HttpResponse.json({ error: { message: 'client name already exists' } }, { status: 409 }),
      ),
    );

    renderWithProviders(<CreateClientForm />);

    await user.type(screen.getByLabelText('Name'), 'Northwind');
    await user.click(screen.getByRole('button', { name: 'Add client' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('client name already exists');
  });
});
