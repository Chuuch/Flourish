import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ClientList } from './ClientList';
import { screen } from '@testing-library/react';
import { makeClient } from '@/test/factories/client';
import { MemoryRouter } from 'react-router';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import { updateClientSchema, type Client } from '../schemas/client.schema';

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

describe('ClientList', () => {
  it('renders clients returned by the API', async () => {
    const northWind = makeClient({ name: 'Northwind', notes: 'Retail' });

    server.use(
      mswHttp.get(clientsUrl, () =>
        HttpResponse.json([northWind, makeClient({ name: 'Contoso', notes: '' })]),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: 'Northwind - Retail' })).toHaveAttribute(
      'href',
      `/clients/${northWind.id}/projects`,
    );
    expect(screen.getByRole('link', { name: 'Contoso' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Users' })[0]).toHaveAttribute(
      'href',
      `/clients/${northWind.id}/users`,
    );
    expect(screen.getAllByRole('link', { name: 'Tickets' })[0]).toHaveAttribute(
      'href',
      `/clients/${northWind.id}/tickets`,
    );
  });

  it('renders and empty state', async () => {
    server.use(mswHttp.get(clientsUrl, () => HttpResponse.json([])));
    renderWithProviders(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>,
    );

    expect(await screen.findByText('No clients yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(clientsUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });

  it('hides manage controls for members', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(clientsUrl, () =>
        HttpResponse.json([makeClient({ name: 'Northwind', notes: 'Retail' })]),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: 'Northwind - Retail' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Name for Northwind')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove Northwind' })).not.toBeInTheDocument();
  });

  it('updates a client name and notes', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    let client: Client = makeClient({ name: 'Northwind', notes: 'Retail' });

    server.use(
      mswHttp.get(clientsUrl, () => HttpResponse.json([client])),
      mswHttp.patch(`${clientsUrl}/${client.id}`, async ({ request }) => {
        const input = updateClientSchema.parse(await request.json());
        client = { ...client, name: input.name, notes: input.notes };
        return HttpResponse.json(client);
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText('Name for Northwind')).toHaveValue('Northwind');

    await user.clear(screen.getByLabelText('Name for Northwind'));
    await user.type(screen.getByLabelText('Name for Northwind'), 'Contoso');
    await user.clear(screen.getByLabelText('Notes for Northwind'));
    await user.type(screen.getByLabelText('Notes for Northwind'), 'Wholesale');
    await user.click(screen.getByRole('button', { name: 'Save Northwind' }));

    expect(await screen.findByRole('link', { name: 'Contoso - Wholesale' })).toBeInTheDocument();
  });

  it('removes a client', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    const client = makeClient({ name: 'Northwind', notes: 'Retail' });
    let clients: Client[] = [client];

    server.use(
      mswHttp.get(clientsUrl, () => HttpResponse.json(clients)),
      mswHttp.delete(`${clientsUrl}/${client.id}`, () => {
        clients = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>,
    );

    await user.click(await screen.findByRole('button', { name: 'Remove Northwind' }));

    expect(await screen.findByText('No clients yet.')).toBeInTheDocument();
  });

  it('shows a name conflict from the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const client = makeClient({ name: 'Contoso', notes: '' });

    server.use(
      mswHttp.get(clientsUrl, () => HttpResponse.json([client])),
      mswHttp.patch(`${clientsUrl}/${client.id}`, () =>
        HttpResponse.json({ error: { message: 'client name already exists' } }, { status: 409 }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>,
    );

    await user.clear(await screen.findByLabelText('Name for Contoso'));
    await user.type(screen.getByLabelText('Name for Contoso'), 'Northwind');
    await user.click(screen.getByRole('button', { name: 'Save Contoso' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('client name already exists');
  });
});
