import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from './routes';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { env } from '@/config/env';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return renderWithProviders(<RouterProvider router={router} />);
}

describe('application router', () => {
  it('renders the home route inside the layout', async () => {
    renderAt('/');

    expect(await screen.findByText('Flourish')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  it('lazy-loads the users route', async () => {
    server.use(mswHttp.get(`${env.API_URL}/users`, () => HttpResponse.json([])));

    renderAt('/users');

    expect(await screen.findByRole('heading', { name: 'Users' })).toBeInTheDocument();
  });

  it('renders not found for unknown paths', async () => {
    renderAt('/does-not-exist');

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });
});
