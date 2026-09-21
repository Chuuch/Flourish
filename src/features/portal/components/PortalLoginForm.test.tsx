import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PortalLoginForm } from './PortalLoginForm';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { useAuthStore } from '@/features/auth';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/router/routes';

const loginUrl = `${env.API_URL}/client-auth/login`;
const ticketsUrl = `${env.API_URL}/client-auth/tickets`;

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

const testUser = {
  id: crypto.randomUUID(),
  email: 'pat@example.com',
};

describe('PortalLoginForm', () => {
  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    let called = false;

    server.use(
      mswHttp.post(loginUrl, () => {
        called = true;
        return HttpResponse.json({});
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <PortalLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(called).toBe(false);
  });

  it('creates a portal session after a successful login', async () => {
    const user = userEvent.setup();

    server.use(
      mswHttp.post(loginUrl, async ({ request }) => {
        const body = await request.json();

        expect(body).toEqual({
          email: 'pat@example.com',
          password: 'password1',
        });

        return HttpResponse.json({
          access_token: 'token',
          user: testUser,
          organization: testOrg,
          client: testClient,
          role: 'client',
        });
      }),
      mswHttp.get(ticketsUrl, () => HttpResponse.json([])),
    );

    const router = createMemoryRouter(routes, { initialEntries: ['/portal/login'] });
    renderWithProviders(<RouterProvider router={router} />);

    await user.type(await screen.findByLabelText('Email'), 'pat@example.com');
    await user.type(screen.getByLabelText('Password'), 'password1');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('heading', { name: 'Portal' })).toBeInTheDocument();
    expect(screen.getByText('pat@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('Northwind')).toHaveLength(2);
    expect(useAuthStore.getState().role).toBe('client');
    expect(useAuthStore.getState().client?.name).toBe('Northwind');
  });

  it('shows an API error', async () => {
    const user = userEvent.setup();

    server.use(
      mswHttp.post(loginUrl, () =>
        HttpResponse.json({ error: { message: 'invalid credentials' } }, { status: 401 }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <PortalLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'password1');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('invalid credentials')).toBeInTheDocument();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().client).toBeNull();
    expect(useAuthStore.getState().role).toBeNull();
  });
});
