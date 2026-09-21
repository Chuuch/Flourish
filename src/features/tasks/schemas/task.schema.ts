import z from 'zod';

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'done']);

export const taskSchema = z.object({
  id: z.uuid(),
  organization_id: z.string(),
  project_id: z.string(),
  ticket_id: z.string().nullable(),
  title: z.string().min(1),
  notes: z.string(),
  status: taskStatusSchema,
  completed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const tasksSchema = z.array(taskSchema);

export const createTaskSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters').max(100),
  notes: z.string().max(2000),
  status: taskStatusSchema,
});

export const updateTaskSchema = z.object({
  status: taskStatusSchema,
});

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export function canManageTasks(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}
