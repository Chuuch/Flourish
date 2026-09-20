import { http } from '@/lib/api/http';
import { clientSchema, clientsSchema, type CreateClientInput } from '../schemas/client.schema';

export const fetchClients = () => http.get('/clients', clientsSchema);

export const createClient = (input: CreateClientInput) =>
  http.post('/clients', clientSchema, input);
