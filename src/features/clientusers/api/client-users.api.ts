import { http } from '@/lib/api/http';
import {
  clientUserSchema,
  clientUsersSchema,
  type CreateClientUserInput,
} from '../schemas/client-user.schema';
import z from 'zod';

export const fetchClientUsers = (clientId: string) =>
  http.get(`/clients/${clientId}/users`, clientUsersSchema);

export const createClientUser = (clientId: string, input: CreateClientUserInput) =>
  http.post(`/clients/${clientId}/users`, clientUserSchema, input);

export const deleteClientUser = (clientId: string, userId: string) =>
  http.delete(`/clients/${clientId}/users/${userId}`, z.unknown());
