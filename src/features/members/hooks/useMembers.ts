import { useQuery } from '@tanstack/react-query';
import { membersQueries } from '../api/members.queries';

export function useMembers() {
  return useQuery(membersQueries.list());
}
