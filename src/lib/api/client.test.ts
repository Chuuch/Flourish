import { afterEach, describe, expect, it, vi } from 'vitest';
import { env } from '@/config/env';
import z from 'zod';
import { apiClient, setAccessToken, setAuthRealm } from './client';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { onUnauthorized } from './session';
import { ApiError } from './errors';

const pingSchema = z.object({ ok: z.boolean() });
const pingUrl = `${env.API_URL}/ping`;
const refreshUrl = `${env.API_URL}/auth/refresh`;
const portalRefreshUrl = `${env.API_URL}/client-auth/refresh`;

const refreshUser = {
  id: crypto.randomUUID(),
  email: 'a@b.com',
};

const refreshOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

const refreshClient = {
  id: crypto.randomUUID(),
  organization_id: refreshOrg.id,
  name: 'Northwind',
  notes: '',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

afterEach(() => {
  setAccessToken(null);
  setAuthRealm(null);
});

describe('apiClient refresh', () => {
  it('refreshes once and retries the original request', async () => {
    setAccessToken('expired');
    let pingCalls = 0;

    server.use(
      mswHttp.get(pingUrl, ({ request }) => {
        pingCalls += 1;
        if (request.headers.get('Authorization') === 'Bearer expired') {
          return HttpResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
        }
        return HttpResponse.json({ ok: true });
      }),
      mswHttp.post(refreshUrl, () =>
        HttpResponse.json({
          access_token: 'fresh',
          user: refreshUser,
          organization: refreshOrg,
          role: 'owner',
        }),
      ),
    );

    const response = await apiClient.get('/ping');
    const body = pingSchema.parse(response.data);

    expect(body).toEqual({ ok: true });
    expect(pingCalls).toBe(2);
  });

  it('shares one refresh across parallel 401s', async () => {
    setAccessToken('expired');
    let refreshCalls = 0;

    server.use(
      mswHttp.get(pingUrl, ({ request }) => {
        if (request.headers.get('Authorization') === 'Bearer expired') {
          return HttpResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
        }
        return HttpResponse.json({ ok: true });
      }),
      mswHttp.post(refreshUrl, () => {
        refreshCalls += 1;
        return HttpResponse.json({
          access_token: 'fresh',
          user: refreshUser,
          organization: refreshOrg,
          role: 'owner',
        });
      }),
    );

    await Promise.all([apiClient.get('/ping'), apiClient.get('/ping')]);
    expect(refreshCalls).toBe(1);
  });

  it('refreshes via client-auth when the session is a portal session', async () => {
    setAccessToken('expired');
    setAuthRealm('portal');
    let pingCalls = 0;
    let agencyRefreshCalls = 0;
    let portalRefreshCalls = 0;

    server.use(
      mswHttp.get(pingUrl, ({ request }) => {
        pingCalls += 1;
        if (request.headers.get('Authorization') === 'Bearer expired') {
          return HttpResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
        }
        return HttpResponse.json({ ok: true });
      }),
      mswHttp.post(refreshUrl, () => {
        agencyRefreshCalls += 1;
        return HttpResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
      }),
      mswHttp.post(portalRefreshUrl, () => {
        portalRefreshCalls += 1;
        return HttpResponse.json({
          access_token: 'fresh',
          user: refreshUser,
          organization: refreshOrg,
          client: refreshClient,
          role: 'client',
        });
      }),
    );

    const response = await apiClient.get('/ping');
    const body = pingSchema.parse(response.data);

    expect(body).toEqual({ ok: true });
    expect(pingCalls).toBe(2);
    expect(portalRefreshCalls).toBe(1);
    expect(agencyRefreshCalls).toBe(0);
  });

  it('clears the session when refresh fails', async () => {
    setAccessToken('expired');
    const unauthorized = vi.fn();
    onUnauthorized(unauthorized);

    server.use(
      mswHttp.get(pingUrl, () =>
        HttpResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 }),
      ),
      mswHttp.post(refreshUrl, () =>
        HttpResponse.json({ error: { message: 'Expired' } }, { status: 401 }),
      ),
    );

    await expect(apiClient.get('/ping')).rejects.toBeInstanceOf(ApiError);
    expect(unauthorized).toHaveBeenCalledTimes(1);
  });
});
