import { http } from '@/lib/api/http';
import {
  projectSchema,
  projectsSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
} from '../schemas/project.schema';
import z from 'zod';

export const fetchProjects = (clientId: string) =>
  http.get(`/clients/${clientId}/projects`, projectsSchema);

export const createProject = (clientId: string, input: CreateProjectInput) =>
  http.post(`/clients/${clientId}/projects`, projectSchema, input);

export const updateProject = (projectId: string, input: UpdateProjectInput) =>
  http.patch(`/projects/${projectId}`, projectSchema, input);

export const deleteProject = (projectId: string) =>
  http.delete(`/projects/${projectId}`, z.unknown());
