import { queryOptions } from '@tanstack/react-query';
import { fetchNavCounts } from './nav.api';

export const navKeys = {
  all: ['nav'] as const,
  counts: (portal: boolean) => [...navKeys.all, 'counts', portal] as const,
};

export const navQueries = {
  counts: (portal: boolean) =>
    queryOptions({
      queryKey: navKeys.counts(portal),
      queryFn: () => fetchNavCounts(portal),
      refetchInterval: 60_000,
    }),
};
