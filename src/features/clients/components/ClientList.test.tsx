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
import { makeOrganization } from '@/test/factories/organization';

const clientsUrl = `${env.API_URL}/clients`;

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

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
      `/clients/${northWind.id}`,
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
});
