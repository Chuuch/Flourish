import { http } from '@/lib/api/http';
import { timeReportSchema } from '../schemas/report.schema';

export const fetchTimeReport = (from: string, to: string) =>
  http.get('/reports/time', timeReportSchema, { params: { from, to } });
