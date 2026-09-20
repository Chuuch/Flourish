import { routes } from '@/app/router/routes';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { HttpResponse, http as mswHttp } from 'msw';
import { env } from '@/config/env';
import { paths } from '@/app/router/paths';
import { screen } from '@testing-library/react';
import { useAuthStore } from '../store/auth.store';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return renderWithProviders(<RouterProvider router={router} />);
}

describe('GuestOnly', () => {
  it('shows login for anonymous users', async () => {
    server.use(
      mswHttp.get(`${env.API_URL}/auth/me`, () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
      ),
      mswHttp.post(`${env.API_URL}/auth/refresh`, () =>
        HttpResponse.json({ message: 'Expired' }, { status: 401 }),
      ),
    );

    renderAt(paths.login);
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('redirects authenticated users home', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token');

    renderAt(paths.login);
    expect(await screen.findByText('Flourish')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Sign in' })).not.toBeInTheDocument();
  });
});
