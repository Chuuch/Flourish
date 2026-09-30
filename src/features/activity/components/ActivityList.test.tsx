import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ActivityList } from './ActivityList';
import { screen } from '@testing-library/react';
import { useAuthStore } from '@/features/auth';

const activityUrl = `${env.API_URL}/activity`;

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

describe('ActivityList', () => {
  it('renders activity returned by the API', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    const createdAt = '2026-01-02T03:04:05Z';

    server.use(
      mswHttp.get(activityUrl, () =>
        HttpResponse.json([
          {
            id: crypto.randomUUID(),
            organization_id: testOrg.id,
            actor_id: crypto.randomUUID(),
            actor_email: 'ada@example.com',
            actor_display_name: 'Ada',
            action: 'created',
            entity_type: 'task',
            entity_id: crypto.randomUUID(),
            summary: 'Draw wireframes',
            created_at: createdAt,
          },
        ]),
      ),
    );

    renderWithProviders(<ActivityList />);

    expect(await screen.findByText('Ada created a task: Draw wireframes')).toBeInTheDocument();
    expect(screen.getByText(createdAt)).toBeInTheDocument();
  });

  it('falls back to email when display name is empty', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(activityUrl, () =>
        HttpResponse.json([
          {
            id: crypto.randomUUID(),
            organization_id: testOrg.id,
            actor_id: crypto.randomUUID(),
            actor_email: 'linus@example.com',
            action: 'deleted',
            entity_type: 'file',
            entity_id: crypto.randomUUID(),
            summary: '',
            created_at: '2026-01-02T03:04:05Z',
          },
        ]),
      ),
    );

    renderWithProviders(<ActivityList />);

    expect(await screen.findByText('linus@example.com deleted a file')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(mswHttp.get(activityUrl, () => HttpResponse.json([])));
    renderWithProviders(<ActivityList />);

    expect(await screen.findByText('No activity yet.')).toBeInTheDocument();
  });
});
