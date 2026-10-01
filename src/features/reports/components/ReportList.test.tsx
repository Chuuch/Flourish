import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { ReportList } from './ReportList';
import { screen } from '@testing-library/react';
import { useAuthStore } from '@/features/auth';

const reportUrl = `${env.API_URL}/reports/time`;

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

const fromDate = '2026-09-28';
const toDate = '2026-10-04';

function renderReport() {
  useAuthStore
    .getState()
    .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

  return renderWithProviders(
    <ReportList fromDate={fromDate} toDate={toDate} onRangeChange={() => undefined} />,
  );
}

describe('ReportList', () => {
  it('renders totals returned by the API', async () => {
    server.use(
      mswHttp.get(reportUrl, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('from')).toBe('2026-09-28T00:00:00.000Z');
        expect(url.searchParams.get('to')).toBe('2026-10-05T00:00:00.000Z');

        return HttpResponse.json({
          from: '2026-09-28T00:00:00.000Z',
          to: '2026-10-05T00:00:00.000Z',
          total_minutes: 90,
          by_client: [
            {
              client_id: crypto.randomUUID(),
              client_name: 'Northwind',
              minutes: 90,
            },
          ],
          by_project: [
            {
              project_id: crypto.randomUUID(),
              project_name: 'Portal',
              client_id: crypto.randomUUID(),
              client_name: 'Northwind',
              minutes: 90,
            },
          ],
          by_member: [
            {
              user_id: crypto.randomUUID(),
              email: 'linus@example.com',
              display_name: '',
              minutes: 90,
            },
          ],
        });
      }),
    );

    renderReport();

    expect(await screen.findByText('90 min')).toBeInTheDocument();
    expect(screen.getByText('Northwind - 90 min')).toBeInTheDocument();
    expect(screen.getByText('Portal (Northwind) - 90 min')).toBeInTheDocument();
    expect(screen.getByText('linus@example.com - 90 min')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(
      mswHttp.get(reportUrl, () =>
        HttpResponse.json({
          from: '2026-09-28T00:00:00.000Z',
          to: '2026-10-05T00:00:00.000Z',
          total_minutes: 0,
          by_client: [],
          by_project: [],
          by_member: [],
        }),
      ),
    );

    renderReport();

    expect(await screen.findByText('No time in this range.')).toBeInTheDocument();
  });
});
