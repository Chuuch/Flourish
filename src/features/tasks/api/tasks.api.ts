import { http } from '@/lib/api/http';
import { withIdempotencyKey } from '@/lib/api/idempotency';
import {
  taskSchema,
  tasksSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
} from '../schemas/task.schema';
import z from 'zod';

export const fetchTasks = (projectId: string, q = '') =>
  http.get(`/projects/${projectId}/tasks`, tasksSchema, q ? { params: { q } } : undefined);

export const fetchInbox = (q = '') =>
  http.get('/inbox/tasks', tasksSchema, q ? { params: { q } } : undefined);

export const createTask = (projectId: string, input: CreateTaskInput) =>
  http.post(`/projects/${projectId}/tasks`, taskSchema, input, withIdempotencyKey());

export const updateTask = (taskId: string, input: UpdateTaskInput) =>
  http.patch(`/tasks/${taskId}`, taskSchema, input);

export const deleteTask = (taskId: string) => http.delete(`/tasks/${taskId}`, z.unknown());
