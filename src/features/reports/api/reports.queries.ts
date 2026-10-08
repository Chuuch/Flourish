import { queryOptions } from '@tanstack/react-query';
import { fetchTimeReport } from './reports.api';

export const reportKeys = {
  all: ['reports'] as const,
  time: (from: string, to: string) => [...reportKeys.all, 'time', from, to] as const,
};

export const reportQueries = {
  time: (from: string, to: string) =>
    queryOptions({
      queryKey: reportKeys.time(from, to),
      queryFn: () => fetchTimeReport(from, to),
    }),
};
