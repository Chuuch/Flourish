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
import { makeOrganization } from '@/test/factories/organization';

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

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
    mswHttp.get(`${env.API_URL}/clients/${client.id}/invoices`, () => HttpResponse.json([])),
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
    expect(screen.getByRole('link', { name: /Projects/ })).toHaveAttribute(
      'href',
      `/clients/${client.id}/projects`,
    );
    expect(screen.getByRole('link', { name: /Invoices/ })).toHaveAttribute(
      'href',
      `/clients/${client.id}/invoices`,
    );
    expect(screen.getByRole('link', { name: /Tickets/ })).toHaveAttribute(
      'href',
      `/clients/${client.id}/tickets`,
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
      mswHttp.get(`${env.API_URL}/clients/${client.id}/invoices`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/clients/${client.id}/users`, () => HttpResponse.json([])),
      mswHttp.patch(`${env.API_URL}/clients/${client.id}`, async ({ request }) => {
        const input = updateClientSchema.parse(await request.json());
        client = { ...client, name: input.name, notes: input.notes };
        return HttpResponse.json(client);
      }),
    );

    renderHub(client.id);

    await user.click(await screen.findByText('Billing details'));
    expect(await screen.findByLabelText('Name')).toHaveValue('Northwind');

    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Contoso');
    await user.clear(screen.getByLabelText('Notes'));
    await user.type(screen.getByLabelText('Notes'), 'Wholesale');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('heading', { name: 'Contoso' })).toBeInTheDocument();
    expect(screen.getByText('Wholesale')).toBeInTheDocument();
  });

  it('hides manage controls for members', async () => {
    signInAs('member');
    const client = makeClient({ name: 'Northwind', notes: 'Retail' });
    mockHubApis(client);

    renderHub(client.id);

    expect(await screen.findByRole('heading', { name: 'Northwind' })).toBeInTheDocument();
    expect(screen.queryByText('Billing details')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('shows not found when the client is missing', async () => {
    signInAs('owner');
    const clientId = '44444444-4444-4444-4444-444444444444';

    server.use(mswHttp.get(`${env.API_URL}/clients`, () => HttpResponse.json([])));

    renderHub(clientId);

    expect(await screen.findByRole('heading', { name: 'Client not found' })).toBeInTheDocument();
  });
});
