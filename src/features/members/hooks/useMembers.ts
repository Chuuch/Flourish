import { useQuery } from '@tanstack/react-query';
import { membersQueries } from '../api/members.queries';

export function useMembers(q = '') {
  return useQuery(membersQueries.list(q));
}
