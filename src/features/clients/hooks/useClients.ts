import { useQuery } from '@tanstack/react-query';
import { clientsQueries } from '../api/clients.queries';

export function useClients() {
  return useQuery(clientsQueries.list());
}
