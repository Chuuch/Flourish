import { http } from '@/lib/api/http';
import {
  clientUserSchema,
  clientUsersSchema,
  type CreateClientUserInput,
} from '../schemas/client-user.schema';

export const fetchClientUsers = (clientId: string) =>
  http.get(`/clients/${clientId}/users`, clientUsersSchema);

export const createClientUser = (clientId: string, input: CreateClientUserInput) =>
  http.post(`/clients/${clientId}/users`, clientUserSchema, input);
