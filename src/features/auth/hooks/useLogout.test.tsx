import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { routes } from '@/app/router/routes';
import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { useAuthStore } from '../store/auth.store';

describe('useLogout', () => {
  it('clears the session after a successful logout', async () => {
    const user = userEvent.setup();
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token');

    server.use(
      mswHttp.post(`${env.API_URL}/auth/logout`, () => new HttpResponse(null, { status: 204 })),
      mswHttp.get(`${env.API_URL}/auth/me`, () =>
        HttpResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 }),
      ),
      mswHttp.post(`${env.API_URL}/auth/refresh`, () =>
        HttpResponse.json({ error: { message: 'Expired' } }, { status: 401 }),
      ),
    );

    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    renderWithProviders(<RouterProvider router={router} />);

    await user.click(await screen.findByRole('button', { name: 'Sign out' }));

    expect(await screen.findByRole('link', { name: 'Sign in' })).toBeInTheDocument();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
