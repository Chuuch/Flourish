import { http } from '@/lib/api/http';
import { navCountsSchema } from '../schemas/nav-counts.schema';

const countsPath = (portal: boolean) => (portal ? '/client-auth/nav/counts' : '/nav/counts');

export const fetchNavCounts = (portal: boolean) => http.get(countsPath(portal), navCountsSchema);
