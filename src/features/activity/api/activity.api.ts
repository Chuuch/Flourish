import { http } from '@/lib/api/http';
import { activityEventsSchema } from '../schemas/activity.schema';

export const fetchActivity = () => http.get('/activity', activityEventsSchema);
