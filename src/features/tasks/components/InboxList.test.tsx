import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { makeTask } from '@/test/factories/task';
import { screen } from '@testing-library/react';
import { HttpResponse, http as mswHttp } from 'msw';
import { describe, expect, it } from 'vitest';
import { InboxList } from './InboxList';

const inboxUrl = `${env.API_URL}/inbox/tasks`;
const membersUrl = `${env.API_URL}/members`;

describe('InboxList', () => {
  it('renders inbox tasks', async () => {
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

    expect(await screen.findByText('Mine')).toBeInTheDocument();
    expect(screen.getByText('Open - Pick this up')).toBeInTheDocument();
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
