import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { makeTask } from '@/test/factories/task';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { describe, expect, it } from 'vitest';
import { InboxList } from './InboxList';
import { useAuthStore } from '@/features/auth';

const inboxUrl = `${env.API_URL}/inbox/tasks`;
const membersUrl = `${env.API_URL}/members`;

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

const userId = crypto.randomUUID();

function signIn() {
  useAuthStore
    .getState()
    .setSession({ id: userId, email: 'ada@example.com' }, 'token', testOrg, 'owner');
}

describe('InboxList', () => {
  it('renders inbox tasks', async () => {
    signIn();
    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(inboxUrl, () =>
        HttpResponse.json([
          makeTask({ title: 'Mine', notes: '', assignee_id: userId }),
          makeTask({ title: 'Open', notes: 'Pick this up', assignee_id: null }),
        ]),
      ),
    );

    renderWithProviders(<InboxList />);

    expect(await screen.findByText('Mine')).toBeInTheDocument();
    expect(screen.getByText('Open - Pick this up')).toBeInTheDocument();
  });

  it('filters to assigned tasks', async () => {
    const user = userEvent.setup();
    signIn();
    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(inboxUrl, () =>
        HttpResponse.json([
          makeTask({ title: 'Mine', notes: '', assignee_id: userId }),
          makeTask({ title: 'Open', notes: 'Pick this up', assignee_id: null }),
        ]),
      ),
    );

    renderWithProviders(<InboxList />);

    await user.click(await screen.findByRole('radio', { name: 'Assigned to me' }));

    expect(screen.getByText('Mine')).toBeInTheDocument();
    expect(screen.queryByText('Open - Pick this up')).not.toBeInTheDocument();
  });

  it('filters to unassigned tasks', async () => {
    const user = userEvent.setup();
    signIn();
    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(inboxUrl, () =>
        HttpResponse.json([
          makeTask({ title: 'Mine', notes: '', assignee_id: userId }),
          makeTask({ title: 'Open', notes: 'Pick this up', assignee_id: null }),
        ]),
      ),
    );

    renderWithProviders(<InboxList />);

    await user.click(await screen.findByRole('radio', { name: 'Unassigned' }));

    expect(screen.queryByText('Mine')).not.toBeInTheDocument();
    expect(screen.getByText('Open - Pick this up')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    signIn();
    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(inboxUrl, () => HttpResponse.json([])),
    );

    renderWithProviders(<InboxList />);

    expect(await screen.findByText('No inbox tasks.')).toBeInTheDocument();
  });
});
