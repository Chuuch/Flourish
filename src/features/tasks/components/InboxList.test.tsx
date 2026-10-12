import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth';
import { makeOrganization } from '@/test/factories/organization';
import { makeTask } from '@/test/factories/task';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { InboxList } from './InboxList';

const inboxUrl = `${env.API_URL}/inbox/tasks`;
const membersUrl = `${env.API_URL}/members`;

const testOrg = makeOrganization({ name: 'Acme' });

const userId = crypto.randomUUID();
const clientId = '44444444-4444-4444-8444-444444444444';
const projectId = '55555555-5555-5555-8555-555555555555';

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

function renderInbox() {
  return renderWithProviders(
    <MemoryRouter>
      <InboxList />
    </MemoryRouter>,
  );
}

describe('InboxList', () => {
  it('defaults to assigned-to-me and links to the task workspace', async () => {
    signIn();
    const mine = makeTask({
      title: 'Mine',
      notes: '',
      assignee_id: userId,
      client_id: clientId,
      project_id: projectId,
    });
    mockInbox([mine, makeTask({ title: 'Open', notes: 'Pick this up', assignee_id: null })]);

    renderInbox();

    const link = await screen.findByRole('link', { name: /Mine/ });
    expect(link).toHaveAttribute(
      'href',
      `/clients/${clientId}/projects/${projectId}/tasks/${mine.id}`,
    );
    expect(screen.queryByRole('link', { name: /Open/ })).not.toBeInTheDocument();
  });

  it('filters to all tasks', async () => {
    const user = userEvent.setup();
    signIn();
    mockInbox([
      makeTask({ title: 'Mine', notes: '', assignee_id: userId }),
      makeTask({ title: 'Open', notes: 'Pick this up', assignee_id: null }),
    ]);

    renderInbox();

    await user.click(await screen.findByRole('radio', { name: 'All' }));

    expect(screen.getByRole('link', { name: /Mine/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open/ })).toBeInTheDocument();
  });

  it('filters to unassigned tasks', async () => {
    const user = userEvent.setup();
    signIn();
    mockInbox([
      makeTask({ title: 'Mine', notes: '', assignee_id: userId }),
      makeTask({ title: 'Open', notes: 'Pick this up', assignee_id: null }),
    ]);

    renderInbox();

    await user.click(await screen.findByRole('radio', { name: 'Unassigned' }));

    expect(screen.queryByRole('link', { name: /Mine/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open/ })).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    signIn();
    mockInbox([]);

    renderInbox();

    expect(await screen.findByText('No inbox tasks.')).toBeInTheDocument();
  });
});
