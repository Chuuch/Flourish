import { http } from '@/lib/api/http';
import { taskSchema, tasksSchema, type CreateTaskInput } from '../schemas/task.schema';

export const fetchTasks = (projectId: string) =>
  http.get(`/projects/${projectId}/tasks`, tasksSchema);

export const createTask = (projectId: string, input: CreateTaskInput) =>
  http.post(`/projects/${projectId}/tasks`, taskSchema, input);
