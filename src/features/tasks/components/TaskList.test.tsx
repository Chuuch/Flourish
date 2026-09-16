import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TaskList } from './TaskList';
import { screen } from '@testing-library/react';
import { makeTask } from '@/test/factories/task';
import { MemoryRouter } from 'react-router';

const clientId = '44444444-4444-4444-4444-444444444444';
const projectId = '55555555-5555-5555-5555-555555555555';
const tasksUrl = `${env.API_URL}/projects/${projectId}/tasks`;

describe('TaskList', () => {
  it('renders tasks returned by the API', async () => {
    const login = makeTask({
      project_id: projectId,
      title: 'Fix login',
      notes: 'OAuth',
      status: 'todo',
    });
    server.use(
      mswHttp.get(tasksUrl, () =>
        HttpResponse.json([login, makeTask({ title: 'Ship site', notes: '', status: 'done' })]),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <TaskList clientId={clientId} projectId={projectId} />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: 'Fix login - OAuth (todo)' })).toHaveAttribute(
      'href',
      `/clients/${clientId}/projects/${projectId}/tasks/${login.id}/time-entries`,
    );
    expect(screen.getByRole('link', { name: 'Ship site (done)' })).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(tasksUrl, () => HttpResponse.json([])));
    renderWithProviders(
      <MemoryRouter>
        <TaskList clientId={clientId} projectId={projectId} />
      </MemoryRouter>,
    );

    expect(await screen.findByText('No tasks yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(tasksUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <TaskList clientId={clientId} projectId={projectId} />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });
});
