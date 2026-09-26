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
  created_by: z.uuid().nullable(),
  assignee_id: z.uuid().nullable(),
  version: z.int().min(1),
  created_at: z.string(),
  updated_at: z.string(),
});

export const tasksSchema = z.array(taskSchema);

export const createTaskSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters').max(100),
  notes: z.string().max(2000),
  status: taskStatusSchema,
  assignee_id: z.uuid().nullable().optional(),
});

export const createTaskFormSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters').max(100),
  notes: z.string().max(2000),
  status: taskStatusSchema,
  assignee_id: z.string(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(4).max(100).optional(),
  notes: z.string().max(2000).optional(),
  status: taskStatusSchema,
  assignee_id: z.uuid().nullable().optional(),
  version: z.int().min(1),
});

export const editTaskFormSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters').max(100),
  notes: z.string().max(2000),
  assignee_id: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type CreateTaskFormInput = z.infer<typeof createTaskFormSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type EditTaskFormInput = z.infer<typeof editTaskFormSchema>;

export function canManageTasks(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}

export function canCreateTasks(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin' || role === 'member';
}

export function assigneeIdOrNull(value: string): string | null {
  return value === '' ? null : value;
}
