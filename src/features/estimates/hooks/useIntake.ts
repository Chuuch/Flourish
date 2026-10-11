import { useQuery } from '@tanstack/react-query';
import { estimateQueries } from '../api/estimates.queries';

export function useIntake(intakeId: string) {
  return useQuery({
    ...estimateQueries.intakeDetail(intakeId),
    enabled: intakeId.length > 0,
  });
}
