import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TaskList } from './TaskList';
import { screen } from '@testing-library/react';
import { makeTask } from '@/test/factories/task';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import type { Task } from '../schemas/task.schema';
import { updateTaskSchema } from '../schemas/task.schema';

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

    expect(await screen.findByRole('link', { name: 'Fix login - OAuth' })).toHaveAttribute(
      'href',
      `/clients/${clientId}/projects/${projectId}/tasks/${login.id}/time-entries`,
    );
    expect(screen.getByRole('link', { name: 'Ship site' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Comments' })[0]).toHaveAttribute(
      'href',
      `/clients/${clientId}/projects/${projectId}/tasks/${login.id}/comments`,
    );
  });

  it('updates task status with the last-seen version', async () => {
    const user = userEvent.setup();
    let task: Task = makeTask({
      project_id: projectId,
      title: 'Fix login',
      status: 'todo',
      version: 1,
    });

    server.use(
      mswHttp.get(tasksUrl, () => HttpResponse.json([task])),
      mswHttp.patch(`${env.API_URL}/tasks/${task.id}`, async ({ request }) => {
        const input = updateTaskSchema.parse(await request.json());
        expect(input.version).toBe(1);
        task = { ...task, status: input.status, version: input.version + 1 };
        return HttpResponse.json(task);
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <TaskList clientId={clientId} projectId={projectId} />
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText('Status for Fix login')).toHaveValue('todo');

    await user.selectOptions(screen.getByLabelText('Status for Fix login'), 'done');

    expect(await screen.findByLabelText('Status for Fix login')).toHaveValue('done');
  });

  it('renders a version conflict on update', async () => {
    const user = userEvent.setup();
    const task = makeTask({
      project_id: projectId,
      title: 'Fix login',
      status: 'todo',
      version: 1,
    });

    server.use(
      mswHttp.get(tasksUrl, () => HttpResponse.json([task])),
      mswHttp.patch(`${env.API_URL}/tasks/${task.id}`, () =>
        HttpResponse.json(
          { error: { code: 'task_version_mismatch', message: 'task was updated by someone else' } },
          { status: 409 },
        ),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <TaskList clientId={clientId} projectId={projectId} />
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText('Status for Fix login')).toHaveValue('todo');

    await user.selectOptions(screen.getByLabelText('Status for Fix login'), 'done');

    expect(await screen.findByRole('alert')).toHaveTextContent('task was updated by someone else');
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
