import { screen } from '@testing-library/react';
import { HttpResponse, http as mswHttp } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { routes } from '@/app/router/routes';
import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { useAuthStore } from '@/features/auth';

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

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return renderWithProviders(<RouterProvider router={router} />);
}

describe('RequirePortalAuth', () => {
  it('redirects anonymous users to client sign in', async () => {
    renderAt('/portal');

    expect(await screen.findByRole('heading', { name: 'Client sign in' })).toBeInTheDocument();
  });

  it('renders the portal when there is a client session', async () => {
    useAuthStore
      .getState()
      .setPortalSession(
        { id: crypto.randomUUID(), email: 'pat@example.com' },
        'token',
        testOrg,
        testClient,
        'client',
      );

    server.use(mswHttp.get(`${env.API_URL}/client-auth/tickets`, () => HttpResponse.json([])));

    renderAt('/portal');

    expect(await screen.findByRole('heading', { name: 'Portal' })).toBeInTheDocument();
    expect(screen.getByText('pat@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('Northwind')).toHaveLength(2);
  });

  it('sends a staff session home', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(`${env.API_URL}/inbox/tasks`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/members`, () => HttpResponse.json([])),
    );

    renderAt('/portal');

    expect(await screen.findByText('Flourish')).toBeInTheDocument();
  });
});
