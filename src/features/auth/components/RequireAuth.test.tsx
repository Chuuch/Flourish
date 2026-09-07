import { screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { paths } from '@/app/router/paths';
import { routes } from '@/app/router/routes';
import { renderWithProviders } from '@/test/render';
import { useAuthStore } from '../store/auth.store';
import { server } from '@/test/server';
import { http as mswHttp, HttpResponse } from 'msw';
import { env } from '@/config/env';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return renderWithProviders(<RouterProvider router={router} />);
}

describe('RequireAuth', () => {
  it('redirects anonymous users to login', async () => {
    renderAt(paths.users);
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the protected page when a session exists', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token');

    server.use(mswHttp.get(`${env.API_URL}/users`, () => HttpResponse.json([])));

    renderAt(paths.users);

    expect(await screen.findByRole('heading', { name: 'Users' })).toBeInTheDocument();
  });
});
