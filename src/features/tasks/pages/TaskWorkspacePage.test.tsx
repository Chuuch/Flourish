import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TaskWorkspacePage } from './TaskWorkspacePage';
import { screen } from '@testing-library/react';
import { makeTask } from '@/test/factories/task';
import { MemoryRouter, Route, Routes } from 'react-router';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import { updateTaskSchema, type Task } from '../schemas/task.schema';

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

function mockWorkspaceApis(task: Task) {
  server.use(
    mswHttp.get(`${env.API_URL}/members`, () => HttpResponse.json([])),
    mswHttp.get(`${env.API_URL}/projects/${task.project_id}/tasks`, () =>
      HttpResponse.json([task]),
    ),
    mswHttp.get(`${env.API_URL}/tasks/${task.id}/comments`, () => HttpResponse.json([])),
    mswHttp.get(`${env.API_URL}/tasks/${task.id}/time-entries`, () => HttpResponse.json([])),
  );
}

function renderWorkspace(clientId: string, projectId: string, taskId: string) {
  return renderWithProviders(
    <MemoryRouter initialEntries={[`/clients/${clientId}/projects/${projectId}/tasks/${taskId}`]}>
      <Routes>
        <Route
          path="/clients/:clientId/projects/:projectId/tasks/:taskid"
          element={<TaskWorkspacePage />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('TaskWorkspacePage', () => {
  it('renders the task workspace', async () => {
    signInAs('owner');
    const clientId = crypto.randomUUID();
    const task = makeTask({ title: 'Fix login', notes: 'OAuth' });
    mockWorkspaceApis(task);

    renderWorkspace(clientId, task.project_id, task.id);

    expect(await screen.findByRole('heading', { name: 'Fix login' })).toBeInTheDocument();
    expect(screen.getByText('OAuth')).toBeInTheDocument();
    expect(await screen.findByText('No comments yet.')).toBeInTheDocument();
    expect(await screen.findByText('No time entries yet.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add comment' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add time' })).toBeInTheDocument();
  });

  it('updates task status with the last-seen version', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const clientId = crypto.randomUUID();
    let task: Task = makeTask({ title: 'Fix login', status: 'todo', version: 1 });

    server.use(
      mswHttp.get(`${env.API_URL}/members`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/projects/${task.project_id}/tasks`, () =>
        HttpResponse.json([task]),
      ),
      mswHttp.get(`${env.API_URL}/tasks/${task.id}/comments`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tasks/${task.id}/time-entries`, () => HttpResponse.json([])),
      mswHttp.patch(`${env.API_URL}/tasks/${task.id}`, async ({ request }) => {
        const input = updateTaskSchema.parse(await request.json());
        expect(input.version).toBe(1);
        task = { ...task, status: input.status, version: input.version + 1 };
        return HttpResponse.json(task);
      }),
    );

    renderWorkspace(clientId, task.project_id, task.id);

    expect(await screen.findByLabelText('Status for Fix login')).toHaveValue('todo');

    await user.selectOptions(screen.getByLabelText('Status for Fix login'), 'done');

    expect(await screen.findByLabelText('Status for Fix login')).toHaveValue('done');
  });

  it('hides manage controls for members', async () => {
    signInAs('member');
    const clientId = crypto.randomUUID();
    const task = makeTask({ title: 'Fix login', notes: 'OAuth' });
    mockWorkspaceApis(task);

    renderWorkspace(clientId, task.project_id, task.id);

    expect(await screen.findByRole('heading', { name: 'Fix login' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove Fix login' })).not.toBeInTheDocument();
  });

  it('shows not found when the task is missing', async () => {
    signInAs('owner');
    const clientId = crypto.randomUUID();
    const projectId = crypto.randomUUID();
    const taskId = crypto.randomUUID();

    server.use(
      mswHttp.get(`${env.API_URL}/projects/${projectId}/tasks`, () => HttpResponse.json([])),
    );

    renderWorkspace(clientId, projectId, taskId);

    expect(await screen.findByRole('heading', { name: 'Task not found' })).toBeInTheDocument();
  });
});
