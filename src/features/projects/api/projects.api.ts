import { http } from '@/lib/api/http';
import { projectSchema, projectsSchema, type CreateProjectInput } from '../schemas/project.schema';

export const fetchProjects = (clientId: string) =>
  http.get(`/clients/${clientId}/projects`, projectsSchema);

export const createProject = (clientId: string, input: CreateProjectInput) =>
  http.post(`/clients/${clientId}/projects`, projectSchema, input);
