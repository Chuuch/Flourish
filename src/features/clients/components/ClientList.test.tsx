import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ClientList } from './ClientList';
import { screen } from '@testing-library/react';
import { makeClient } from '@/test/factories/client';

const clientsUrl = `${env.API_URL}/clients`;

describe('ClientList', () => {
  it('renders clients returned by the API', async () => {
    server.use(
      mswHttp.get(clientsUrl, () =>
        HttpResponse.json([
          makeClient({ name: 'Northwind', notes: 'Retail' }),
          makeClient({ name: 'Contoso', notes: '' }),
        ]),
      ),
    );

    renderWithProviders(<ClientList />);

    expect(await screen.findByText('Northwind - Retail')).toBeInTheDocument();
    expect(screen.getByText('Contoso')).toBeInTheDocument();
  });

  it('renders and empty state', async () => {
    server.use(mswHttp.get(clientsUrl, () => HttpResponse.json([])));
    renderWithProviders(<ClientList />);

    expect(await screen.findByText('No clients yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(clientsUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<ClientList />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });
});
