import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ClientPage } from './ClientPage';
import { screen } from '@testing-library/react';
import { makeClient } from '@/test/factories/client';
import { makeProject } from '@/test/factories/project';
import { MemoryRouter, Route, Routes } from 'react-router';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import { updateClientSchema, type Client } from '../schemas/client.schema';

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

function mockHubApis(client: Client, projects: unknown[] = []) {
  server.use(
    mswHttp.get(`${env.API_URL}/clients`, () => HttpResponse.json([client])),
    mswHttp.get(`${env.API_URL}/clients/${client.id}/projects`, () => HttpResponse.json(projects)),
    mswHttp.get(`${env.API_URL}/clients/${client.id}/tickets`, () => HttpResponse.json([])),
    mswHttp.get(`${env.API_URL}/clients/${client.id}/users`, () => HttpResponse.json([])),
  );
}

function renderHub(clientId: string) {
  return renderWithProviders(
    <MemoryRouter initialEntries={[`/clients/${clientId}`]}>
      <Routes>
        <Route path="/clients/:clientId" element={<ClientPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ClientPage', () => {
  it('renders the client hub', async () => {
    signInAs('owner');
    const client = makeClient({ name: 'Northwind', notes: 'Retail' });
    const website = makeProject({ client_id: client.id, name: 'Website' });
    mockHubApis(client, [website]);

    renderHub(client.id);

    expect(await screen.findByRole('heading', { name: 'Northwind' })).toBeInTheDocument();
    expect(screen.getByText('Retail')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Website' })).toHaveAttribute(
      'href',
      `/clients/${client.id}/projects/${website.id}`,
    );
    expect(screen.getByRole('link', { name: 'View projects' })).toHaveAttribute(
      'href',
      `/clients/${client.id}/projects`,
    );
  });

  it('updates a client name and notes', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    let client: Client = makeClient({ name: 'Northwind', notes: 'Retail' });

    server.use(
      mswHttp.get(`${env.API_URL}/clients`, () => HttpResponse.json([client])),
      mswHttp.get(`${env.API_URL}/clients/${client.id}/projects`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/clients/${client.id}/tickets`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/clients/${client.id}/users`, () => HttpResponse.json([])),
      mswHttp.patch(`${env.API_URL}/clients/${client.id}`, async ({ request }) => {
        const input = updateClientSchema.parse(await request.json());
        client = { ...client, name: input.name, notes: input.notes };
        return HttpResponse.json(client);
      }),
    );

    renderHub(client.id);

    expect(await screen.findByLabelText('Name for Northwind')).toHaveValue('Northwind');

    await user.clear(screen.getByLabelText('Name for Northwind'));
    await user.type(screen.getByLabelText('Name for Northwind'), 'Contoso');
    await user.clear(screen.getByLabelText('Notes for Northwind'));
    await user.type(screen.getByLabelText('Notes for Northwind'), 'Wholesale');
    await user.click(screen.getByRole('button', { name: 'Save Northwind' }));

    expect(await screen.findByRole('heading', { name: 'Contoso' })).toBeInTheDocument();
    expect(screen.getByText('Wholesale')).toBeInTheDocument();
  });

  it('hides manage controls for members', async () => {
    signInAs('member');
    const client = makeClient({ name: 'Northwind', notes: 'Retail' });
    mockHubApis(client);

    renderHub(client.id);

    expect(await screen.findByRole('heading', { name: 'Northwind' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Name for Northwind')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove Northwind' })).not.toBeInTheDocument();
  });

  it('shows not found when the client is missing', async () => {
    signInAs('owner');
    const clientId = '44444444-4444-4444-4444-444444444444';

    server.use(mswHttp.get(`${env.API_URL}/clients`, () => HttpResponse.json([])));

    renderHub(clientId);

    expect(await screen.findByRole('heading', { name: 'Client not found' })).toBeInTheDocument();
  });
});
