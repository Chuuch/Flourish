import { http } from '@/lib/api/http';
import { activityPageSchema } from '../schemas/activity.schema';

const DEFAULT_LIMIT = 50;

export const fetchActivity = (params?: { cursor?: string; limit?: number }) =>
  http.get('/activity', activityPageSchema, {
    params: {
      limit: params?.limit ?? DEFAULT_LIMIT,
      ...(params?.cursor ? { cursor: params.cursor } : {}),
    },
  });
