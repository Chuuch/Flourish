import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ProjectHubPage } from './ProjectHubPage';
import { screen } from '@testing-library/react';
import { makeProject } from '@/test/factories/project';
import { makeTask } from '@/test/factories/task';
import { makeFile } from '@/test/factories/file';
import { MemoryRouter, Route, Routes } from 'react-router';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import { updateProjectSchema, type Project } from '../schemas/project.schema';
import { makeOrganization } from '@/test/factories/organization';

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

function signInAs(role: 'owner' | 'admin' | 'member') {
  useAuthStore
    .getState()
    .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, role);
}

function mockHubApis(project: Project, tasks: unknown[] = [], files: unknown[] = []) {
  server.use(
    mswHttp.get(`${env.API_URL}/clients/${project.client_id}/projects`, () =>
      HttpResponse.json({ items: [project], next_cursor: null }),
    ),
    mswHttp.get(`${env.API_URL}/projects/${project.id}/tasks`, () =>
      HttpResponse.json({ items: tasks, next_cursor: null }),
    ),
    mswHttp.get(`${env.API_URL}/projects/${project.id}/files`, () => HttpResponse.json(files)),
  );
}

function renderHub(clientId: string, projectId: string) {
  return renderWithProviders(
    <MemoryRouter initialEntries={[`/clients/${clientId}/projects/${projectId}`]}>
      <Routes>
        <Route path="/clients/:clientId/projects/:projectId" element={<ProjectHubPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProjectHubPage', () => {
  it('renders the project hub', async () => {
    signInAs('owner');
    const project = makeProject({ name: 'Website', notes: 'Launch' });
    const task = makeTask({ project_id: project.id, title: 'Fix login' });
    const file = makeFile({ project_id: project.id, filename: 'spec.pdf', size: 2048 });
    mockHubApis(project, [task], [file]);

    renderHub(project.client_id, project.id);

    expect(await screen.findByRole('heading', { name: 'Website' })).toBeInTheDocument();
    expect(screen.getByText('Launch')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Tasks/ })).toHaveAttribute(
      'href',
      `/clients/${project.client_id}/projects/${project.id}/tasks`,
    );
    expect(screen.getByRole('link', { name: /Files/ })).toHaveAttribute(
      'href',
      `/clients/${project.client_id}/projects/${project.id}/files`,
    );
  });

  it('updates a project name and notes', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    let project: Project = makeProject({ name: 'Website', notes: 'Launch' });

    server.use(
      mswHttp.get(`${env.API_URL}/clients/${project.client_id}/projects`, () =>
        HttpResponse.json({ items: [project], next_cursor: null }),
      ),
      mswHttp.get(`${env.API_URL}/projects/${project.id}/tasks`, () =>
        HttpResponse.json({ items: [], next_cursor: null }),
      ),
      mswHttp.get(`${env.API_URL}/projects/${project.id}/files`, () => HttpResponse.json([])),
      mswHttp.patch(`${env.API_URL}/projects/${project.id}`, async ({ request }) => {
        const input = updateProjectSchema.parse(await request.json());
        project = { ...project, name: input.name, notes: input.notes };
        return HttpResponse.json(project);
      }),
    );

    renderHub(project.client_id, project.id);

    await user.click(await screen.findByText('Edit project'));
    expect(await screen.findByLabelText('Name')).toHaveValue('Website');

    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Mobile');
    await user.clear(screen.getByLabelText('Notes'));
    await user.type(screen.getByLabelText('Notes'), 'App');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('heading', { name: 'Mobile' })).toBeInTheDocument();
    expect(screen.getByText('App')).toBeInTheDocument();
  });

  it('hides manage controls for members', async () => {
    signInAs('member');
    const project = makeProject({ name: 'Website', notes: 'Launch' });
    mockHubApis(project);

    renderHub(project.client_id, project.id);

    expect(await screen.findByRole('heading', { name: 'Website' })).toBeInTheDocument();
    expect(screen.queryByText('Edit project')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('shows not found when the project is missing', async () => {
    signInAs('owner');
    const clientId = crypto.randomUUID();
    const projectId = crypto.randomUUID();

    server.use(
      mswHttp.get(`${env.API_URL}/clients/${clientId}/projects`, () =>
        HttpResponse.json({ items: [], next_cursor: null }),
      ),
    );

    renderHub(clientId, projectId);

    expect(await screen.findByRole('heading', { name: 'Project not found' })).toBeInTheDocument();
  });
});
