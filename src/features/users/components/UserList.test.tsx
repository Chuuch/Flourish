import { env } from '@/config/env';
import type { User } from '../schemas/user.schema';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { UserList } from './UserList';
import { screen } from '@testing-library/react';

const usersUrl = `${env.VITE_API_URL}/users`;

function makeUser(email: string): User {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), email, created_at: now, updated_at: now };
}

describe('UserList', () => {
  it('renders users returned by the API', async () => {
    server.use(
      mswHttp.get(usersUrl, () =>
        HttpResponse.json([makeUser('ada@example.com'), makeUser('linus@example.com')]),
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
