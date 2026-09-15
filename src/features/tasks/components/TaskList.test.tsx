import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TaskList } from './TaskList';
import { screen } from '@testing-library/react';
import { makeTask } from '@/test/factories/task';

const projectId = '55555555-5555-5555-5555-555555555555';
const tasksUrl = `${env.API_URL}/projects/${projectId}/tasks`;

describe('TaskList', () => {
  it('renders tasks returned by the API', async () => {
    server.use(
      mswHttp.get(tasksUrl, () =>
        HttpResponse.json([
          makeTask({ title: 'Fix login', notes: 'OAuth', status: 'todo' }),
          makeTask({ title: 'Ship site', notes: '', status: 'done' }),
        ]),
      ),
    );

    renderWithProviders(<TaskList projectId={projectId} />);

    expect(await screen.findByText('Fix login - OAuth (todo)')).toBeInTheDocument();
    expect(screen.getByText('Ship site (done)')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(tasksUrl, () => HttpResponse.json([])));
    renderWithProviders(<TaskList projectId={projectId} />);

    expect(await screen.findByText('No tasks yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(tasksUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<TaskList projectId={projectId} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });
});
