import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ActivityList } from './ActivityList';
import { screen } from '@testing-library/react';
import { useAuthStore } from '@/features/auth';
import { makeOrganization } from '@/test/factories/organization';
import userEvent from '@testing-library/user-event';

const activityUrl = `${env.API_URL}/activity`;

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

describe('ActivityList', () => {
  it('renders activity returned by the API', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    const createdAt = '2026-01-02T03:04:05Z';

    server.use(
      mswHttp.get(activityUrl, () =>
        HttpResponse.json({
          items: [
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
          ],
          next_cursor: null,
        }),
      ),
    );

    renderWithProviders(<ActivityList />);

    expect(await screen.findByText('Ada created a task: Draw wireframes')).toBeInTheDocument();
    expect(screen.getByRole('time')).toHaveAttribute('dateTime', createdAt);
  });

  it('falls back to email when display name is empty', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(activityUrl, () =>
        HttpResponse.json({
          items: [
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
          ],
          next_cursor: null,
        }),
      ),
    );

    renderWithProviders(<ActivityList />);

    expect(await screen.findByText('linus@example.com deleted a file')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(activityUrl, () =>
        HttpResponse.json({
          items: [],
          next_cursor: null,
        }),
      ),
    );
    renderWithProviders(<ActivityList />);

    expect(await screen.findByText('No activity yet.')).toBeInTheDocument();
  });

  it('loads the next page when Load more is clicked', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(activityUrl, ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursor');

        if (cursor === null) {
          return HttpResponse.json({
            items: [
              {
                id: '11111111-1111-4111-8111-111111111111',
                organization_id: testOrg.id,
                actor_id: crypto.randomUUID(),
                actor_email: 'ada@example.com',
                actor_display_name: 'Ada',
                action: 'created',
                entity_type: 'task',
                entity_id: crypto.randomUUID(),
                summary: 'First page',
                created_at: '2026-01-03T00:00:00Z',
              },
            ],
            next_cursor: 'cursor-page-2',
          });
        }

        return HttpResponse.json({
          items: [
            {
              id: '22222222-2222-4222-8222-222222222222',
              organization_id: testOrg.id,
              actor_id: crypto.randomUUID(),
              actor_email: 'ada@example.com',
              actor_display_name: 'Ada',
              action: 'updated',
              entity_type: 'task',
              entity_id: crypto.randomUUID(),
              summary: 'Second page',
              created_at: '2026-01-01T00:00:00Z',
            },
          ],
          next_cursor: null,
        });
      }),
    );

    renderWithProviders(<ActivityList />);

    expect(await screen.findByText('Ada created a task: First page')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(await screen.findByText('Ada updated a task: Second page')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
  });
});
