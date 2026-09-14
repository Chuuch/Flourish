import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ProjectList } from './ProjectList';
import { screen } from '@testing-library/react';
import { makeProject } from '@/test/factories/project';

const clientId = '44444444-4444-4444-4444-444444444444';
const projectsUrl = `${env.API_URL}/clients/${clientId}/projects`;

describe('ProjectList', () => {
  it('renders projects returned by the API', async () => {
    server.use(
      mswHttp.get(projectsUrl, () =>
        HttpResponse.json([
          makeProject({ name: 'Website', notes: 'Launch' }),
          makeProject({ name: 'Brand', notes: '' }),
        ]),
      ),
    );

    renderWithProviders(<ProjectList clientId={clientId} />);

    expect(await screen.findByText('Website - Launch')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(projectsUrl, () => HttpResponse.json([])));
    renderWithProviders(<ProjectList clientId={clientId} />);

    expect(await screen.findByText('No projects yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(projectsUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<ProjectList clientId={clientId} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });
});
