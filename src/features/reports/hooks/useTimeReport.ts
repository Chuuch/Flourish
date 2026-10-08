import { useQuery } from '@tanstack/react-query';
import { reportQueries } from '../api/reports.queries';

export function useTimeReport(from: string, to: string) {
  return useQuery(reportQueries.time(from, to));
}
