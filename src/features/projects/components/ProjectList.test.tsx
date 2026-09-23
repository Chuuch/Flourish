import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ProjectList } from './ProjectList';
import { screen } from '@testing-library/react';
import { makeProject } from '@/test/factories/project';
import { MemoryRouter } from 'react-router';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import { updateProjectSchema, type Project } from '../schemas/project.schema';

const clientId = '44444444-4444-4444-4444-444444444444';
const projectsUrl = `${env.API_URL}/clients/${clientId}/projects`;

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

describe('ProjectList', () => {
  it('renders projects returned by the API', async () => {
    const website = makeProject({
      client_id: clientId,
      name: 'Website',
      notes: 'Launch',
    });
    server.use(
      mswHttp.get(projectsUrl, () =>
        HttpResponse.json([website, makeProject({ name: 'Brand', notes: '' })]),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ProjectList clientId={clientId} />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: 'Website - Launch' })).toHaveAttribute(
      'href',
      `/clients/${clientId}/projects/${website.id}/tasks`,
    );
    expect(screen.getByRole('link', { name: 'Brand' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Files' })[0]).toHaveAttribute(
      'href',
      `/clients/${clientId}/projects/${website.id}/files`,
    );
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(projectsUrl, () => HttpResponse.json([])));
    renderWithProviders(
      <MemoryRouter>
        <ProjectList clientId={clientId} />
      </MemoryRouter>,
    );
    expect(await screen.findByText('No projects yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(projectsUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ProjectList clientId={clientId} />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });

  it('hides manage controls for members', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(projectsUrl, () =>
        HttpResponse.json([makeProject({ client_id: clientId, name: 'Website', notes: 'Launch' })]),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ProjectList clientId={clientId} />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: 'Website - Launch' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Name for Website')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove Website' })).not.toBeInTheDocument();
  });

  it('updates a project name and notes', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    let project: Project = makeProject({
      client_id: clientId,
      name: 'Website',
      notes: 'Launch',
    });

    server.use(
      mswHttp.get(projectsUrl, () => HttpResponse.json([project])),
      mswHttp.patch(`${env.API_URL}/projects/${project.id}`, async ({ request }) => {
        const input = updateProjectSchema.parse(await request.json());
        project = { ...project, name: input.name, notes: input.notes };
        return HttpResponse.json(project);
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <ProjectList clientId={clientId} />
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText('Name for Website')).toHaveValue('Website');

    await user.clear(screen.getByLabelText('Name for Website'));
    await user.type(screen.getByLabelText('Name for Website'), 'Mobile');
    await user.clear(screen.getByLabelText('Notes for Website'));
    await user.type(screen.getByLabelText('Notes for Website'), 'App');
    await user.click(screen.getByRole('button', { name: 'Save Website' }));

    expect(await screen.findByRole('link', { name: 'Mobile - App' })).toBeInTheDocument();
  });

  it('removes a project', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    const project = makeProject({ client_id: clientId, name: 'Website', notes: 'Launch' });
    let projects: Project[] = [project];

    server.use(
      mswHttp.get(projectsUrl, () => HttpResponse.json(projects)),
      mswHttp.delete(`${env.API_URL}/projects/${project.id}`, () => {
        projects = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <ProjectList clientId={clientId} />
      </MemoryRouter>,
    );

    await user.click(await screen.findByRole('button', { name: 'Remove Website' }));

    expect(await screen.findByText('No projects yet.')).toBeInTheDocument();
  });

  it('shows a name conflict from the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const project = makeProject({ client_id: clientId, name: 'Mobile', notes: '' });

    server.use(
      mswHttp.get(projectsUrl, () => HttpResponse.json([project])),
      mswHttp.patch(`${env.API_URL}/projects/${project.id}`, () =>
        HttpResponse.json({ error: { message: 'project name already exists' } }, { status: 409 }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ProjectList clientId={clientId} />
      </MemoryRouter>,
    );

    await user.clear(await screen.findByLabelText('Name for Mobile'));
    await user.type(screen.getByLabelText('Name for Mobile'), 'Website');
    await user.click(screen.getByRole('button', { name: 'Save Mobile' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('project name already exists');
  });
});
