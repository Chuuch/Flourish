import { http } from '@/lib/api/http';
import { withIdempotencyKey } from '@/lib/api/idempotency';
import {
  clientSchema,
  clientsSchema,
  type CreateClientInput,
  type UpdateClientInput,
} from '../schemas/client.schema';
import z from 'zod';

export const fetchClients = (q = '') =>
  http.get('/clients', clientsSchema, q ? { params: { q } } : undefined);

export const createClient = (input: CreateClientInput) =>
  http.post('/clients', clientSchema, input, withIdempotencyKey());

export const updateClient = (clientId: string, input: UpdateClientInput) =>
  http.patch(`/clients/${clientId}`, clientSchema, input);

export const deleteClient = (clientId: string) => http.delete(`/clients/${clientId}`, z.unknown());
