import { screen } from '@testing-library/react';
import { HttpResponse, http as mswHttp } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { routes } from '@/app/router/routes';
import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { useAuthStore } from '../store/auth.store';

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

const clientId = '44444444-4444-4444-4444-444444444444';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return renderWithProviders(<RouterProvider router={router} />);
}

describe('RequireAuth', () => {
  it('redirects anonymous users to login', async () => {
    renderAt('/members');

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the protected page when there is a session', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(mswHttp.get(`${env.API_URL}/members`, () => HttpResponse.json([])));

    renderAt('/members');

    expect(await screen.findByRole('heading', { name: 'Members' })).toBeInTheDocument();
  });

  it('sends a client session to the portal', async () => {
    useAuthStore
      .getState()
      .setPortalSession(
        { id: crypto.randomUUID(), email: 'pat@example.com' },
        'token',
        testOrg,
        testClient,
        'client',
      );

    renderAt('/members');

    expect(await screen.findByRole('heading', { name: 'Portal' })).toBeInTheDocument();
  });
});

describe('RequireAuth', () => {
  it('redirects anonymous users to login', async () => {
    renderAt('/clients');

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the protected page when there is a session', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(mswHttp.get(`${env.API_URL}/clients`, () => HttpResponse.json([])));

    renderAt('/clients');

    expect(await screen.findByRole('heading', { name: 'Clients' })).toBeInTheDocument();
  });
});

describe('RequireAuth', () => {
  it('redirects anonymous users to login', async () => {
    renderAt(`/clients/${clientId}/users`);

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the protected page when there is a session', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(`${env.API_URL}/clients/${clientId}/users`, () => HttpResponse.json([])),
    );

    renderAt(`/clients/${clientId}/users`);

    expect(await screen.findByRole('heading', { name: 'Client users' })).toBeInTheDocument();
  });
});
