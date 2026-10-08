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
import { makeOrganization } from '@/test/factories/organization';

const clientId = '44444444-4444-4444-8444-444444444444';
const projectsUrl = `${env.API_URL}/clients/${clientId}/projects`;

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

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
        HttpResponse.json({
          items: [website, makeProject({ name: 'Brand', notes: '' })],
          next_cursor: null,
        }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ProjectList clientId={clientId} />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: 'Website' })).toHaveAttribute(
      'href',
      `/clients/${clientId}/projects/${website.id}`,
    );
    expect(screen.getByText('Launch')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Brand' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Tasks' })[0]).toHaveAttribute(
      'href',
      `/clients/${clientId}/projects/${website.id}/tasks`,
    );
    expect(screen.getAllByRole('link', { name: 'Files' })[0]).toHaveAttribute(
      'href',
      `/clients/${clientId}/projects/${website.id}/files`,
    );
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(projectsUrl, () => HttpResponse.json({ items: [], next_cursor: null })));
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
        HttpResponse.json({
          items: [makeProject({ client_id: clientId, name: 'Website', notes: 'Launch' })],
          next_cursor: null,
        }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ProjectList clientId={clientId} />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: 'Website' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });
});
