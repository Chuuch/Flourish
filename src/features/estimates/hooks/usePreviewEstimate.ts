import { useMutation } from '@tanstack/react-query';
import type { EstimateInput } from '../schemas/estimate.schema';
import { previewEstimate } from '../api/estimates.api';

export function usePreviewEstimate() {
  return useMutation({
    mutationFn: (input: EstimateInput) => previewEstimate(input),
  });
}
