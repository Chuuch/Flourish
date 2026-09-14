import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ClientList } from './ClientList';
import { screen } from '@testing-library/react';
import { makeClient } from '@/test/factories/client';
import { MemoryRouter } from 'react-router';

const clientsUrl = `${env.API_URL}/clients`;

describe('ClientList', () => {
  it('renders clients returned by the API', async () => {
    const northWind = makeClient({ name: 'Northwind', notes: 'Retail' });

    server.use(
      mswHttp.get(clientsUrl, () =>
        HttpResponse.json([northWind, makeClient({ name: 'Contoso', notes: '' })]),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: 'Northwind - Retail' })).toHaveAttribute(
      'href',
      `/clients/${northWind.id}/projects`,
    );
    expect(screen.getByRole('link', { name: 'Contoso' })).toBeInTheDocument();
  });

  it('renders and empty state', async () => {
    server.use(mswHttp.get(clientsUrl, () => HttpResponse.json([])));
    renderWithProviders(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>,
    );

    expect(await screen.findByText('No clients yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(clientsUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });
});
