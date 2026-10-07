import { useQuery } from '@tanstack/react-query';
import { clientsQueries } from '../api/clients.queries';

export function useClients(q = '') {
  return useQuery(clientsQueries.list(q));
}
