import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth';
import { makeOrganization } from '@/test/factories/organization';
import { makeTask } from '@/test/factories/task';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { describe, expect, it } from 'vitest';
import { InboxList } from './InboxList';

const inboxUrl = `${env.API_URL}/inbox/tasks`;
const membersUrl = `${env.API_URL}/members`;

const testOrg = makeOrganization({ name: 'Acme' });

const userId = crypto.randomUUID();

function signIn() {
  useAuthStore
    .getState()
    .setSession({ id: userId, email: 'ada@example.com' }, 'token', testOrg, 'owner');
}

function mockInbox(tasks: ReturnType<typeof makeTask>[]) {
  server.use(
    mswHttp.get(membersUrl, () => HttpResponse.json([])),
    mswHttp.get(inboxUrl, () => HttpResponse.json({ items: tasks, next_cursor: null })),
  );
}

describe('InboxList', () => {
  it('renders inbox tasks as a compact list', async () => {
    signIn();
    mockInbox([
      makeTask({ title: 'Mine', notes: '', assignee_id: userId }),
      makeTask({ title: 'Open', notes: 'Pick this up', assignee_id: null }),
    ]);

    renderWithProviders(<InboxList />);

    expect(await screen.findByRole('button', { name: /Mine/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open/ })).toBeInTheDocument();
    expect(screen.getByText('Pick this up')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Status for/)).not.toBeInTheDocument();
  });

  it('filters to assigned tasks', async () => {
    const user = userEvent.setup();
    signIn();
    mockInbox([
      makeTask({ title: 'Mine', notes: '', assignee_id: userId }),
      makeTask({ title: 'Open', notes: 'Pick this up', assignee_id: null }),
    ]);

    renderWithProviders(<InboxList />);

    await user.click(await screen.findByRole('radio', { name: 'Assigned to me' }));

    expect(screen.getByRole('button', { name: /Mine/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Open/ })).not.toBeInTheDocument();
  });

  it('filters to unassigned tasks', async () => {
    const user = userEvent.setup();
    signIn();
    mockInbox([
      makeTask({ title: 'Mine', notes: '', assignee_id: userId }),
      makeTask({ title: 'Open', notes: 'Pick this up', assignee_id: null }),
    ]);

    renderWithProviders(<InboxList />);

    await user.click(await screen.findByRole('radio', { name: 'Unassigned' }));

    expect(screen.queryByRole('button', { name: /Mine/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open/ })).toBeInTheDocument();
  });

  it('opens a task detail with the edit form', async () => {
    const user = userEvent.setup();
    signIn();
    mockInbox([
      makeTask({ title: 'Open', notes: 'Pick this up', status: 'todo', assignee_id: null }),
    ]);

    renderWithProviders(<InboxList />);

    await user.click(await screen.findByRole('button', { name: /Open/ }));

    expect(screen.getByRole('button', { name: 'Back to inbox' })).toBeInTheDocument();
    expect(screen.getByLabelText('Status for Open')).toHaveAttribute('data-value', 'todo');
    expect(screen.getByLabelText('Title for Open')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    signIn();
    mockInbox([]);

    renderWithProviders(<InboxList />);

    expect(await screen.findByText('No inbox tasks.')).toBeInTheDocument();
  });
});
