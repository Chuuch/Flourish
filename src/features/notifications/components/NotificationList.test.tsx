import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { NotificationList } from './NotificationList';
import { screen } from '@testing-library/react';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import { makeOrganization } from '@/test/factories/organization';
import { MemoryRouter } from 'react-router';

const notificationsUrl = `${env.API_URL}/notifications`;

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

describe('NotificationList', () => {
  it('renders a staff notification and marks it read', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    const id = crypto.randomUUID();
    let readAt: string | null = null;

    server.use(
      mswHttp.get(notificationsUrl, () =>
        HttpResponse.json({
          items: [
            {
              id,
              organization_id: testOrg.id,
              recipient_id: crypto.randomUUID(),
              actor_id: crypto.randomUUID(),
              actor_email: 'pat@example.com',
              actor_display_name: 'Pat',
              kind: 'ticket_opened',
              entity_type: 'ticket',
              entity_id: crypto.randomUUID(),
              client_id: crypto.randomUUID(),
              project_id: null,
              summary: 'Login broken',
              read_at: readAt,
              created_at: '2026-10-01T12:00:00Z',
            },
          ],
          next_cursor: null,
        }),
      ),
      mswHttp.patch(`${notificationsUrl}/${id}/read`, () => {
        readAt = '2026-10-01T12:01:00Z';
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <NotificationList />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Pat opened a ticket: Login broken')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Mark as read' }));
    expect(screen.queryByText('Pat opened a ticket: Login broken')).not.toBeInTheDocument();
    expect(await screen.findByText('No notifications.')).toBeInTheDocument();
  });

  it('falls back to email for unread notifications', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(notificationsUrl, () =>
        HttpResponse.json({
          items: [
            {
              id: crypto.randomUUID(),
              organization_id: testOrg.id,
              recipient_id: crypto.randomUUID(),
              actor_id: crypto.randomUUID(),
              actor_email: 'linus@example.com',
              actor_display_name: '',
              kind: 'task_assigned',
              entity_type: 'task',
              entity_id: crypto.randomUUID(),
              client_id: crypto.randomUUID(),
              project_id: crypto.randomUUID(),
              summary: 'Draw wireframes',
              read_at: null,
              created_at: '2026-10-01T12:00:00Z',
            },
          ],
          next_cursor: null,
        }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <NotificationList />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText('linus@example.com assigned you a task: Draw wireframes'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark as read' })).toBeInTheDocument();
  });

  it('hides already-read notifications', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(notificationsUrl, () =>
        HttpResponse.json({
          items: [
            {
              id: crypto.randomUUID(),
              organization_id: testOrg.id,
              recipient_id: crypto.randomUUID(),
              actor_id: crypto.randomUUID(),
              actor_email: 'linus@example.com',
              actor_display_name: '',
              kind: 'task_assigned',
              entity_type: 'task',
              entity_id: crypto.randomUUID(),
              client_id: null,
              project_id: null,
              summary: 'Draw wireframes',
              read_at: '2026-10-01T12:01:00Z',
              created_at: '2026-10-01T12:00:00Z',
            },
          ],
          next_cursor: null,
        }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <NotificationList />
      </MemoryRouter>,
    );

    expect(await screen.findByText('No notifications.')).toBeInTheDocument();
    expect(
      screen.queryByText('linus@example.com assigned you a task: Draw wireframes'),
    ).not.toBeInTheDocument();
  });
});
