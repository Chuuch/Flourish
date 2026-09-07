import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import z from 'zod';
import { server } from './server';
import { HttpResponse, http as mswHttp } from 'msw';
import { http } from '@/lib/api/http';
import { ApiError } from '@/lib/api/errors';

const userSchema = z.object({ id: z.string(), email: z.email() });
const url = (path: string) => `${env.API_URL}${path}`;

describe('http', () => {
  it('returns schema-validated data on success', async () => {
    server.use(
      mswHttp.get(url('/users/1'), () => HttpResponse.json({ id: '1', email: 'a@b.com' })),
    );

    await expect(http.get('/users/1', userSchema)).resolves.toEqual({
      id: '1',
      email: 'a@b.com',
    });
  });

  it('maps server error bodies to ApiError', async () => {
    server.use(
      mswHttp.get(url('/users/1'), () =>
        HttpResponse.json({ message: 'Not found', code: 'USER_NOT_FOUND' }, { status: 404 }),
      ),
    );

    const promise = http.get('/users/1', userSchema);

    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({
      status: 404,
      code: 'USER_NOT_FOUND',
      message: 'Not found',
    });
  });

  it('rejects responses that do not match the schema', async () => {
    server.use(mswHttp.get(url('/users/1'), () => HttpResponse.json({ id: 1 })));

    const promise = http.get('/users/1', userSchema);

    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({ status: 200, code: 'INVALID_RESPONSE' });
  });
});
