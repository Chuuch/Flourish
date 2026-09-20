import { screen } from '@testing-library/react';
import { HttpResponse, http as mswHttp } from 'msw';
import { describe, expect, it } from 'vitest';
import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { SessionGate } from './SessionGate';

const meUrl = `${env.API_URL}/auth/me`;

const sessionUser = {
  id: crypto.randomUUID(),
  email: 'ada@example.com',
};

const sessionOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

describe('SessionGate', () => {
  it('restores the session from /auth/me', async () => {
    server.use(
      mswHttp.get(meUrl, () =>
        HttpResponse.json({
          access_token: 'restored',
          user: sessionUser,
          organization: sessionOrg,
          role: 'owner',
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
    expect(useAuthStore.getState().organization?.name).toBe('Acme');
    expect(useAuthStore.getState().role).toBe('owner');
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
    expect(useAuthStore.getState().organization).toBeNull();
    expect(useAuthStore.getState().role).toBeNull();
  });
});
