import { useInfiniteQuery } from '@tanstack/react-query';
import { clientsQueries } from '../api/clients.queries';

export function useClients(q = '') {
  return useInfiniteQuery(clientsQueries.list(q));
}
