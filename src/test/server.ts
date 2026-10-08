import { env } from '@/config/env';
import { HttpResponse, http as mswHttp } from 'msw';
import { setupServer } from 'msw/node';

const unauthorized = () =>
  HttpResponse.json({ error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 });

/** Default guest bootstrap: no refresh cookie / expired session. */
export const defaultHandlers = [
  mswHttp.post(`${env.API_URL}/auth/refresh`, unauthorized),
  mswHttp.post(`${env.API_URL}/client-auth/refresh`, unauthorized),
];

export const server = setupServer(...defaultHandlers);
