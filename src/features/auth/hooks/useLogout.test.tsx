import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { routes } from '@/app/router/routes';
import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { useAuthStore } from '../store/auth.store';
import { makeOrganization } from '@/test/factories/organization';
import { makeClient } from '@/test/factories/client';

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

const testClient = makeClient({
  organization_id: testOrg.id,
  name: 'Northwind',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

describe('useLogout', () => {
  it('clears the session after a successful logout', async () => {
    const user = userEvent.setup();
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(`${env.API_URL}/inbox/tasks`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/members`, () => HttpResponse.json([])),
      mswHttp.post(`${env.API_URL}/auth/logout`, () => new HttpResponse(null, { status: 204 })),
      mswHttp.post(`${env.API_URL}/auth/refresh`, () =>
        HttpResponse.json({ error: { message: 'Expired' } }, { status: 401 }),
      ),
      mswHttp.post(`${env.API_URL}/client-auth/refresh`, () =>
        HttpResponse.json({ error: { message: 'Expired' } }, { status: 401 }),
      ),
    );

    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    renderWithProviders(<RouterProvider router={router} />);

    await user.click(await screen.findByRole('button', { name: 'Sign out' }));

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(await within(nav).findByRole('link', { name: 'Sign in' })).toBeInTheDocument();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().organization).toBeNull();
    expect(useAuthStore.getState().client).toBeNull();
    expect(useAuthStore.getState().role).toBeNull();
  });

  it('logs out a portal session against client-auth', async () => {
    const user = userEvent.setup();
    useAuthStore
      .getState()
      .setPortalSession(
        { id: crypto.randomUUID(), email: 'pat@example.com' },
        'token',
        testOrg,
        testClient,
        'client',
      );

    server.use(
      mswHttp.post(
        `${env.API_URL}/client-auth/logout`,
        () => new HttpResponse(null, { status: 204 }),
      ),
      mswHttp.post(`${env.API_URL}/auth/refresh`, () =>
        HttpResponse.json({ error: { message: 'Expired' } }, { status: 401 }),
      ),
      mswHttp.post(`${env.API_URL}/client-auth/refresh`, () =>
        HttpResponse.json({ error: { message: 'Expired' } }, { status: 401 }),
      ),
    );

    const router = createMemoryRouter(routes, { initialEntries: ['/portal'] });
    renderWithProviders(<RouterProvider router={router} />);

    await user.click(await screen.findByRole('button', { name: 'Sign out' }));

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(await within(nav).findByRole('link', { name: 'Sign in' })).toBeInTheDocument();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().client).toBeNull();
    expect(useAuthStore.getState().role).toBeNull();
  });
});
