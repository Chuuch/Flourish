import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ProjectList } from './ProjectList';
import { screen } from '@testing-library/react';
import { makeProject } from '@/test/factories/project';
import { MemoryRouter } from 'react-router';

const clientId = '44444444-4444-4444-4444-444444444444';
const projectsUrl = `${env.API_URL}/clients/${clientId}/projects`;

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
});
