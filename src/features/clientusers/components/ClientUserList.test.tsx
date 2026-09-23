import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ClientUserList } from './ClientUserList';
import { screen } from '@testing-library/react';
import { makeClientUser } from '@/test/factories/client-user';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import type { ClientUser } from '../schemas/client-user.schema';

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

describe('ClientUserList', () => {
  it('renders client users returned by the API', async () => {
    server.use(
      mswHttp.get(clientUsersUrl, () =>
        HttpResponse.json([
          makeClientUser({ client_id: clientId, email: 'pat@northwind.test' }),
          makeClientUser({ client_id: clientId, email: 'sam@northwind.test' }),
        ]),
      ),
    );

    renderWithProviders(<ClientUserList clientId={clientId} />);

    expect(await screen.findByText('pat@northwind.test')).toBeInTheDocument();
    expect(screen.getByText('sam@northwind.test')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(clientUsersUrl, () => HttpResponse.json([])));
    renderWithProviders(<ClientUserList clientId={clientId} />);

    expect(await screen.findByText('No client users yet.')).toBeInTheDocument();
  });

  it('renders the API error message', async () => {
    server.use(
      mswHttp.get(clientUsersUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<ClientUserList clientId={clientId} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });

  it('hides manage controls for members', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(clientUsersUrl, () =>
        HttpResponse.json([makeClientUser({ client_id: clientId, email: 'pat@northwind.test' })]),
      ),
    );

    renderWithProviders(<ClientUserList clientId={clientId} />);

    expect(await screen.findByText('pat@northwind.test')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove pat@northwind.test' }),
    ).not.toBeInTheDocument();
  });

  it('removes a client user', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    const clientUser = makeClientUser({ client_id: clientId, email: 'pat@northwind.test' });
    let clientUsers: ClientUser[] = [clientUser];

    server.use(
      mswHttp.get(clientUsersUrl, () => HttpResponse.json(clientUsers)),
      mswHttp.delete(`${clientUsersUrl}/${clientUser.user_id}`, () => {
        clientUsers = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<ClientUserList clientId={clientId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove pat@northwind.test' }));

    expect(await screen.findByText('No client users yet.')).toBeInTheDocument();
  });

  it('shows a not-found error from the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const clientUser = makeClientUser({ client_id: clientId, email: 'pat@northwind.test' });

    server.use(
      mswHttp.get(clientUsersUrl, () => HttpResponse.json([clientUser])),
      mswHttp.delete(`${clientUsersUrl}/${clientUser.user_id}`, () =>
        HttpResponse.json(
          { error: { code: 'client_user_not_found', message: 'client user not found' } },
          { status: 404 },
        ),
      ),
    );

    renderWithProviders(<ClientUserList clientId={clientId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove pat@northwind.test' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('client user not found');
  });
});
