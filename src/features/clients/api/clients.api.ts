import { http } from '@/lib/api/http';
import {
  clientSchema,
  clientsSchema,
  type CreateClientInput,
  type UpdateClientInput,
} from '../schemas/client.schema';
import z from 'zod';

export const fetchClients = () => http.get('/clients', clientsSchema);

export const createClient = (input: CreateClientInput) =>
  http.post('/clients', clientSchema, input);

export const updateClient = (clientId: string, input: UpdateClientInput) =>
  http.patch(`/clients/${clientId}`, clientSchema, input);

export const deleteClient = (clientId: string) => http.delete(`/clients/${clientId}`, z.unknown());
