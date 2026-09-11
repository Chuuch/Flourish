import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { routes } from '@/app/router/routes';
import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { RegisterForm } from './RegisterForm';

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

const testUser = {
  id: crypto.randomUUID(),
  email: 'ada@example.com',
};

describe('RegisterForm', () => {
  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    let called = false;

    server.use(
      mswHttp.post(`${env.API_URL}/auth/register`, () => {
        called = true;
        return HttpResponse.json({});
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      await screen.findByText('Organization name must be at least 2 characters'),
    ).toBeInTheDocument();
    expect(called).toBe(false);
  });

  it('creates a session after a successful register', async () => {
    const user = userEvent.setup();

    server.use(
      mswHttp.post(`${env.API_URL}/auth/register`, async ({ request }) => {
        const body = await request.json();

        expect(body).toEqual({
          email: 'ada@example.com',
          password: 'password1',
          organization_name: 'Acme',
        });

        return HttpResponse.json(
          {
            access_token: 'token',
            user: testUser,
            organization: testOrg,
          },
          { status: 201 },
        );
      }),
    );

    const router = createMemoryRouter(routes, { initialEntries: ['/register'] });
    renderWithProviders(<RouterProvider router={router} />);

    await user.type(await screen.findByLabelText('Organization name'), 'Acme');
    await user.type(screen.getByLabelText('email'), 'ada@example.com');
    await user.type(screen.getByLabelText('password'), 'password1');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(useAuthStore.getState().user?.email).toBe('ada@example.com');
    expect(useAuthStore.getState().organization?.name).toBe('Acme');
  });

  it('shows an API error', async () => {
    const user = userEvent.setup();

    server.use(
      mswHttp.post(`${env.API_URL}/auth/register`, () =>
        HttpResponse.json(
          { error: { message: 'Email already exists', code: 'email_already_exists' } },
          { status: 409 },
        ),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Organization name'), 'Acme');
    await user.type(screen.getByLabelText('email'), 'ada@example.com');
    await user.type(screen.getByLabelText('password'), 'password1');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Email already exists')).toBeInTheDocument();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().organization).toBeNull();
  });
});
