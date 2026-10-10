import { http } from '@/lib/api/http';
import {
  catalogSchema,
  estimateSchema,
  estimatesPageSchema,
  previewResponseSchema,
  type CreateEstimateBody,
  type CreateProjectFromEstimateInput,
  type EstimateInput,
} from '../schemas/estimate.schema';
import { withIdempotencyKey } from '@/lib/api/idempotency';
import { projectSchema } from '@/features/projects/schemas/project.schema';

const DEFAULT_LIMIT = 50;

export const fetchEstimateCatalog = () => http.get('/estimate-catalog', catalogSchema);

export const previewEstimate = (input: EstimateInput) =>
  http.post('/estimates/preview', previewResponseSchema, { input });

export const createEstimate = (body: CreateEstimateBody) =>
  http.post('/estimates', estimateSchema, body, withIdempotencyKey());

export const fetchEstimates = (params?: { client_id?: string; cursor?: string; limit?: number }) =>
  http.get('/estimates', estimatesPageSchema, {
    params: {
      limit: params?.limit ?? DEFAULT_LIMIT,
      ...(params?.client_id ? { client_id: params.client_id } : {}),
      ...(params?.cursor ? { cursor: params.cursor } : {}),
    },
  });

export const fetchEstimate = (estimateId: string) =>
  http.get(`/estimates/${estimateId}`, estimateSchema);

export const createProjectFromEstimate = (
  estimateId: string,
  body: CreateProjectFromEstimateInput,
) =>
  http.post(`/estimates/${estimateId}/create-project`, projectSchema, body, withIdempotencyKey());
