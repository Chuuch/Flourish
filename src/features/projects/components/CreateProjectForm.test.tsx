import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CreateProjectForm } from './CreateProjectForm';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { createProjectSchema, type Project } from '../schemas/project.schema';
import { makeProject } from '@/test/factories/project';
import { useAuthStore } from '@/features/auth';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ProjectsPage } from '../pages/ProjectPage';

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

describe('CreateProjectForm', () => {
  it('hides the form for members', () => {
    signInAs('member');
    renderWithProviders(<CreateProjectForm clientId={clientId} />);

    expect(screen.queryByRole('button', { name: 'Add project' })).not.toBeInTheDocument();
  });

  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    renderWithProviders(<CreateProjectForm clientId={clientId} />);

    await user.click(screen.getByRole('button', { name: 'Add project' }));

    expect(await screen.findByText('Name must be at least 4 characters')).toBeInTheDocument();
  });

  it('creates a project and refreshes the list', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const projects: Project[] = [];

    server.use(
      mswHttp.get(projectsUrl, () => HttpResponse.json(projects)),
      mswHttp.post(projectsUrl, async ({ request }) => {
        const input = createProjectSchema.parse(await request.json());
        const created = makeProject({
          client_id: clientId,
          name: input.name,
          notes: input.notes,
        });
        projects.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithProviders(
      <MemoryRouter initialEntries={[`/clients/${clientId}/projects`]}>
        <Routes>
          <Route path="/clients/:clientId/projects" element={<ProjectsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('No projects yet.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Name'), 'Website');
    await user.type(screen.getByLabelText('Notes'), 'Launch');
    await user.click(screen.getByRole('button', { name: 'Add project' }));

    expect(await screen.findByText('Website - Launch')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    server.use(
      mswHttp.post(projectsUrl, () =>
        HttpResponse.json({ error: { message: 'project name already exists' } }, { status: 409 }),
      ),
    );

    renderWithProviders(<CreateProjectForm clientId={clientId} />);

    await user.type(screen.getByLabelText('Name'), 'Website');
    await user.click(screen.getByRole('button', { name: 'Add project' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('project name already exists');
  });
});
