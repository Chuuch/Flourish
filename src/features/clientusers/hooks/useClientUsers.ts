import { useQuery } from '@tanstack/react-query';
import { clientUsersQueries } from '../api/client-users.queries';

export function useClientUsers(clientId: string, q = '') {
  return useQuery(clientUsersQueries.list(clientId, q));
}
