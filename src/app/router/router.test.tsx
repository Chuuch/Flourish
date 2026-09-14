import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from './routes';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth';

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return renderWithProviders(<RouterProvider router={router} />);
}

function signIn() {
  useAuthStore
    .getState()
    .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');
}

describe('application router', () => {
  it('renders the home route inside the layout', async () => {
    renderAt('/');

    expect(await screen.findByText('Flourish')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  it('renders the members route', async () => {
    signIn();
    server.use(mswHttp.get(`${env.API_URL}/members`, () => HttpResponse.json([])));

    renderAt('/members');

    expect(await screen.findByRole('heading', { name: 'Members' })).toBeInTheDocument();
  });

  it('renders the clients route', async () => {
    signIn();
    server.use(mswHttp.get(`${env.API_URL}/clients`, () => HttpResponse.json([])));

    renderAt('/clients');

    expect(await screen.findByRole('heading', { name: 'Clients' })).toBeInTheDocument();
  });

  it('renders the projects route', async () => {
    signIn();
    const clientId = crypto.randomUUID();
    server.use(
      mswHttp.get(`${env.API_URL}/clients/${clientId}/projects`, () => HttpResponse.json([])),
    );

    renderAt(`/clients/${clientId}/projects`);

    expect(await screen.findByRole('heading', { name: 'Projects' })).toBeInTheDocument();
  });

  it('renders not found for unknown paths', async () => {
    renderAt('/does-not-exist');

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });
});
