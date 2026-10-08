import { http } from '@/lib/api/http';
import { withIdempotencyKey } from '@/lib/api/idempotency';
import {
  clientSchema,
  clientsPageSchema,
  type CreateClientInput,
  type UpdateClientInput,
} from '../schemas/client.schema';
import z from 'zod';

const DEFAULT_LIMIT = 50;

export const fetchClients = (params?: { q?: string; cursor?: string; limit?: number }) =>
  http.get('/clients', clientsPageSchema, {
    params: {
      limit: params?.limit ?? DEFAULT_LIMIT,
      ...(params?.q ? { q: params.q } : {}),
      ...(params?.cursor ? { cursor: params.cursor } : {}),
    },
  });

export const createClient = (input: CreateClientInput) =>
  http.post('/clients', clientSchema, input, withIdempotencyKey());

export const updateClient = (clientId: string, input: UpdateClientInput) =>
  http.patch(`/clients/${clientId}`, clientSchema, input);

export const deleteClient = (clientId: string) => http.delete(`/clients/${clientId}`, z.unknown());
