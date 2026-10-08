import { http } from '@/lib/api/http';
import { withIdempotencyKey } from '@/lib/api/idempotency';
import {
  taskSchema,
  tasksPageSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
} from '../schemas/task.schema';
import z from 'zod';

const DEFAULT_LIMIT = 50;

export const fetchTasks = (
  projectId: string,
  params?: { q?: string; cursor?: string; limit?: number },
) =>
  http.get(`/projects/${projectId}/tasks`, tasksPageSchema, {
    params: {
      limit: params?.limit ?? DEFAULT_LIMIT,
      ...(params?.q ? { q: params.q } : {}),
      ...(params?.cursor ? { cursor: params.cursor } : {}),
    },
  });

export const fetchInbox = (params?: { q?: string; cursor?: string; limit?: number }) =>
  http.get('/inbox/tasks', tasksPageSchema, {
    params: {
      limit: params?.limit ?? DEFAULT_LIMIT,
      ...(params?.q ? { q: params.q } : {}),
      ...(params?.cursor ? { cursor: params.cursor } : {}),
    },
  });

export const createTask = (projectId: string, input: CreateTaskInput) =>
  http.post(`/projects/${projectId}/tasks`, taskSchema, input, withIdempotencyKey());

export const updateTask = (taskId: string, input: UpdateTaskInput) =>
  http.patch(`/tasks/${taskId}`, taskSchema, input);

export const deleteTask = (taskId: string) => http.delete(`/tasks/${taskId}`, z.unknown());
