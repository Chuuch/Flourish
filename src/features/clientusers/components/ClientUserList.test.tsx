import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ClientUserList } from './ClientUserList';
import { screen } from '@testing-library/react';
import { makeClientUser } from '@/test/factories/client-user';

const clientId = '44444444-4444-4444-4444-444444444444';
const clientUsersUrl = `${env.API_URL}/clients/${clientId}/users`;

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
});
