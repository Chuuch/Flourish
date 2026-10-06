import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { makeTask } from '@/test/factories/task';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { describe, expect, it } from 'vitest';
import { InboxList } from './InboxList';

const inboxUrl = `${env.API_URL}/inbox/tasks`;
const membersUrl = `${env.API_URL}/members`;

describe('InboxList', () => {
  it('renders inbox tasks as a compact list', async () => {
    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(inboxUrl, () =>
        HttpResponse.json([
          makeTask({ title: 'Mine', notes: '', assignee_id: crypto.randomUUID() }),
          makeTask({ title: 'Open', notes: 'Pick this up' }),
        ]),
      ),
    );

    renderWithProviders(<InboxList />);

    expect(await screen.findByRole('button', { name: /Mine/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open/ })).toBeInTheDocument();
    expect(screen.getByText('Pick this up')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Status for/)).not.toBeInTheDocument();
  });

  it('opens a task detail with the edit form', async () => {
    const user = userEvent.setup();
    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(inboxUrl, () =>
        HttpResponse.json([makeTask({ title: 'Open', notes: 'Pick this up', status: 'todo' })]),
      ),
    );

    renderWithProviders(<InboxList />);

    await user.click(await screen.findByRole('button', { name: /Open/ }));

    expect(screen.getByRole('button', { name: 'Back to inbox' })).toBeInTheDocument();
    expect(screen.getByLabelText('Status for Open')).toHaveAttribute('data-value', 'todo');
    expect(screen.getByLabelText('Title for Open')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json([])),
      mswHttp.get(inboxUrl, () => HttpResponse.json([])),
    );

    renderWithProviders(<InboxList />);

    expect(await screen.findByText('No inbox tasks.')).toBeInTheDocument();
  });
});
