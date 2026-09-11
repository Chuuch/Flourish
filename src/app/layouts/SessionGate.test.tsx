import { screen } from '@testing-library/react';
import { HttpResponse, http as mswHttp } from 'msw';
import { describe, expect, it } from 'vitest';
import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { SessionGate } from './SessionGate';

const meUrl = `${env.API_URL}/auth/me`;

describe('SessionGate', () => {
  it('restores the session from /auth/me', async () => {
    server.use(
      mswHttp.get(meUrl, () =>
        HttpResponse.json({
          access_token: 'restored',
          user: { id: crypto.randomUUID(), email: 'ada@example.com' },
        }),
      ),
    );

    renderWithProviders(
      <SessionGate>
        <p>ready</p>
      </SessionGate>,
    );

    expect(await screen.findByText('ready')).toBeInTheDocument();
    expect(useAuthStore.getState().user?.email).toBe('ada@example.com');
  });

  it('renders children when there is no session', async () => {
    server.use(
      mswHttp.get(meUrl, () =>
        HttpResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 }),
      ),
      mswHttp.post(`${env.API_URL}/auth/refresh`, () =>
        HttpResponse.json({ error: { message: 'Expired' } }, { status: 401 }),
      ),
    );

    renderWithProviders(
      <SessionGate>
        <p>ready</p>
      </SessionGate>,
    );

    expect(await screen.findByText('ready')).toBeInTheDocument();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
