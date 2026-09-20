import { http } from '@/lib/api/http';
import {
  timeEntriesSchema,
  timeEntrySchema,
  type CreateTimeEntryInput,
} from '../schemas/time-entry.schema';

export const fetchTimeEntries = (taskId: string) =>
  http.get(`/tasks/${taskId}/time-entries`, timeEntriesSchema);

export const createTimeEntry = (taskId: string, input: CreateTimeEntryInput) =>
  http.post(`/tasks/${taskId}/time-entries`, timeEntrySchema, input);
