import { useQuery } from '@tanstack/react-query';
import { usersQueries } from '../api/users.queries';

export function useUsers() {
  return useQuery(usersQueries.list());
}
