import { http } from '@/lib/api/http';
import {
  timeEntriesSchema,
  timeEntrySchema,
  type CreateTimeEntryInput,
  type UpdateTimeEntryInput,
} from '../schemas/time-entry.schema';
import z from 'zod';

export const fetchTimeEntries = (taskId: string) =>
  http.get(`/tasks/${taskId}/time-entries`, timeEntriesSchema);

export const createTimeEntry = (taskId: string, input: CreateTimeEntryInput) =>
  http.post(`/tasks/${taskId}/time-entries`, timeEntrySchema, input);

export const updateTimeEntry = (entryId: string, input: UpdateTimeEntryInput) =>
  http.patch(`/time-entries/${entryId}`, timeEntrySchema, input);

export const deleteTimeEntry = (entryId: string) =>
  http.delete(`/time-entries/${entryId}`, z.unknown());
