import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CreateClientUserForm } from './CreateClientUserForm';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { createClientUserSchema, type ClientUser } from '../schemas/client-user.schema';
import { useAuthStore } from '@/features/auth';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ClientUsersPage } from '../pages/ClientUsersPage';
import { makeClientUser } from '@/test/factories/client-user';

const clientId = '44444444-4444-4444-4444-444444444444';
const clientUsersUrl = `${env.API_URL}/clients/${clientId}/users`;

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

function signInAs(role: 'owner' | 'admin' | 'member') {
  useAuthStore
    .getState()
    .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, role);
}

describe('CreateClientUserForm', () => {
  it('hides the form for members', () => {
    signInAs('member');
    renderWithProviders(<CreateClientUserForm clientId={clientId} />);

    expect(screen.queryByRole('button', { name: 'Add client user' })).not.toBeInTheDocument();
  });

  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    renderWithProviders(<CreateClientUserForm clientId={clientId} />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Add client user' }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('creates a client user and refreshes the list', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const clientUsers: ClientUser[] = [];

    server.use(
      mswHttp.get(clientUsersUrl, () => HttpResponse.json(clientUsers)),
      mswHttp.post(clientUsersUrl, async ({ request }) => {
        const input = createClientUserSchema.parse(await request.json());
        const created = makeClientUser({ client_id: clientId, email: input.email });
        clientUsers.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithProviders(
      <MemoryRouter initialEntries={[`/clients/${clientId}/users`]}>
        <Routes>
          <Route path="/clients/:clientId/users" element={<ClientUsersPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('No client users yet.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Email'), 'pat@northwind.test');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Add client user' }));

    expect(await screen.findByText('pat@northwind.test')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveValue('');
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    server.use(
      mswHttp.post(clientUsersUrl, () =>
        HttpResponse.json({ error: { message: 'user is staff' } }, { status: 409 }),
      ),
    );

    renderWithProviders(<CreateClientUserForm clientId={clientId} />);

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Add client user' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('user is staff');
  });
});
