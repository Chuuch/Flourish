import z from 'zod';

export const projectSchema = z.object({
  id: z.uuid(),
  organization_id: z.string(),
  client_id: z.string(),
  name: z.string().min(1),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const projectsSchema = z.array(projectSchema);

export const createProjectSchema = z.object({
  name: z.string().min(4, 'Name must be at least 4 characters').max(100),
  notes: z.string().max(2000),
});

export const updateProjectSchema = createProjectSchema;

export type Project = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export function canManageProjects(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}
