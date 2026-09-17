import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CreateTaskForm } from './CreateTaskForm';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { createTaskSchema, type Task } from '../schemas/task.schema';
import { makeTask } from '@/test/factories/task';
import { useAuthStore } from '@/features/auth';
import { MemoryRouter, Route, Routes } from 'react-router';
import { TasksPage } from '../pages/TasksPage';

const clientId = '44444444-4444-4444-4444-444444444444';
const projectId = '55555555-5555-5555-5555-555555555555';
const tasksUrl = `${env.API_URL}/projects/${projectId}/tasks`;

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

function signInAs(role: 'owner' | 'admin' | 'member') {
  useAuthStore
    .getState()
    .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, role);
}

describe('CreateTaskForm', () => {
  it('hides the form for members', () => {
    signInAs('member');
    renderWithProviders(<CreateTaskForm projectId={projectId} />);

    expect(screen.queryByRole('button', { name: 'Add task' })).not.toBeInTheDocument();
  });

  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    renderWithProviders(<CreateTaskForm projectId={projectId} />);

    await user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(await screen.findByText('Title must be at least 4 characters')).toBeInTheDocument();
  });

  it('creates a task and refreshes the list', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const tasks: Task[] = [];

    server.use(
      mswHttp.get(tasksUrl, () => HttpResponse.json(tasks)),
      mswHttp.post(tasksUrl, async ({ request }) => {
        const input = createTaskSchema.parse(await request.json());
        const created = makeTask({
          project_id: projectId,
          title: input.title,
          notes: input.notes,
          status: input.status,
        });
        tasks.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithProviders(
      <MemoryRouter initialEntries={[`/clients/${clientId}/projects/${projectId}/tasks`]}>
        <Routes>
          <Route path="/clients/:clientId/projects/:projectId/tasks" element={<TasksPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('No tasks yet.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Title'), 'Fix login');
    await user.type(screen.getByLabelText('Notes'), 'OAuth');
    await user.selectOptions(screen.getByLabelText('Status'), 'in_progress');
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(await screen.findByRole('link', { name: 'Fix login - OAuth' })).toBeInTheDocument();
    expect(screen.getByLabelText('Status for Fix login')).toHaveValue('in_progress');
    expect(screen.getByLabelText('Title')).toHaveValue('');
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    server.use(
      mswHttp.post(tasksUrl, () =>
        HttpResponse.json({ error: { message: 'task title already exists' } }, { status: 409 }),
      ),
    );

    renderWithProviders(<CreateTaskForm projectId={projectId} />);

    await user.type(screen.getByLabelText('Title'), 'Fix login');
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('task title already exists');
  });
});
