import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TimeWeekPage } from './TimeWeekPage';
import { screen } from '@testing-library/react';
import { makeTimeEntry } from '@/test/factories/time-entry';
import userEvent from '@testing-library/user-event';
import { utcWeekRange } from '../lib/weekRange';

const rangeUrl = `${env.API_URL}/time-entries`;

describe('TimeWeekPage', () => {
  it('renders the current week total', async () => {
    const week = utcWeekRange(0);
    server.use(
      mswHttp.get(rangeUrl, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('from')).toBe(week.from);
        expect(url.searchParams.get('to')).toBe(week.to);
        return HttpResponse.json([
          makeTimeEntry({ minutes: 90, notes: 'OAuth' }),
          makeTimeEntry({ minutes: 30, notes: '' }),
        ]);
      }),
    );

    renderWithProviders(<TimeWeekPage />);

    expect(await screen.findByRole('heading', { name: 'Time entries' })).toBeInTheDocument();
    expect(screen.getByText('120 min this week')).toBeInTheDocument();
    expect(screen.getByText('90 min - OAuth')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('loads the previous week', async () => {
    const user = userEvent.setup();
    const previous = utcWeekRange(-1);
    server.use(
      mswHttp.get(rangeUrl, ({ request }) => {
        const url = new URL(request.url);
        const from = url.searchParams.get('from');
        if (from === previous.from) {
          return HttpResponse.json([makeTimeEntry({ minutes: 15, notes: 'Review' })]);
        }
        return HttpResponse.json([]);
      }),
    );

    renderWithProviders(<TimeWeekPage />);

    expect(await screen.findByText('No time entries this week.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Previous week' }));

    expect(await screen.findByText('15 min this week')).toBeInTheDocument();
    expect(screen.getByText('15 min - Review')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(rangeUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<TimeWeekPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });
});
