import { http } from '@/lib/api/http';
import { withIdempotencyKey } from '@/lib/api/idempotency';
import {
  clientUserSchema,
  clientUsersSchema,
  type CreateClientUserInput,
} from '../schemas/client-user.schema';
import z from 'zod';

export const fetchClientUsers = (clientId: string, q = '') =>
  http.get(`/clients/${clientId}/users`, clientUsersSchema, q ? { params: { q } } : undefined);

export const createClientUser = (clientId: string, input: CreateClientUserInput) =>
  http.post(`/clients/${clientId}/users`, clientUserSchema, input, withIdempotencyKey());

export const deleteClientUser = (clientId: string, userId: string) =>
  http.delete(`/clients/${clientId}/users/${userId}`, z.unknown());
