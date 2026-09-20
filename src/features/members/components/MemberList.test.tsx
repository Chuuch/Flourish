import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { MemberList } from './MemberList';
import { screen } from '@testing-library/react';
import { makeMember } from '@/test/factories/member';

const membersUrl = `${env.API_URL}/members`;

describe('MemberList', () => {
  it('renders members returned by the API', async () => {
    server.use(
      mswHttp.get(membersUrl, () =>
        HttpResponse.json([
          makeMember({ email: 'ada@example.com', role: 'owner' }),
          makeMember({ email: 'linus@example.com', role: 'member' }),
        ]),
      ),
    );

    renderWithProviders(<MemberList />);

    expect(await screen.findByText('ada@example.com - owner')).toBeInTheDocument();
    expect(screen.getByText('linus@example.com - member')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(membersUrl, () => HttpResponse.json([])));
    renderWithProviders(<MemberList />);

    expect(await screen.findByText('No members yet.')).toBeInTheDocument();
  });

  it('renders the API error message', async () => {
    server.use(
      mswHttp.get(membersUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<MemberList />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });
});
