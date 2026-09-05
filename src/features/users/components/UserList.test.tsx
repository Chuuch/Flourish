import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { UserList } from './UserList';
import { screen } from '@testing-library/react';
import { makeUser } from '@/test/factories/user';

const usersUrl = `${env.API_URL}/users`;

describe('UserList', () => {
  it('renders users returned by the API', async () => {
    server.use(
      mswHttp.get(usersUrl, () =>
        HttpResponse.json([
          makeUser({ email: 'ada@example.com' }),
          makeUser({ email: 'linus@example.com' }),
        ]),
      ),
    );

    renderWithProviders(<UserList />);

    expect(await screen.findByText('ada@example.com')).toBeInTheDocument();
    expect(screen.getByText('linus@example.com')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(usersUrl, () => HttpResponse.json([])));
    renderWithProviders(<UserList />);

    expect(await screen.findByText('No users yet.')).toBeInTheDocument();
  });

  it('renders the API error message', async () => {
    server.use(
      mswHttp.get(usersUrl, () =>
        HttpResponse.json({ message: 'Database unavailable' }, { status: 503 }),
      ),
    );

    renderWithProviders(<UserList />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });
});
