import { http } from '@/lib/api/http';
import { withIdempotencyKey } from '@/lib/api/idempotency';
import {
  projectSchema,
  projectsPageSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
} from '../schemas/project.schema';
import z from 'zod';

const DEFAULT_LIMIT = 50;

export const fetchProjects = (
  clientId: string,
  params?: { q?: string; cursor?: string; limit?: number },
) =>
  http.get(`/clients/${clientId}/projects`, projectsPageSchema, {
    params: {
      limit: params?.limit ?? DEFAULT_LIMIT,
      ...(params?.q ? { q: params.q } : {}),
      ...(params?.cursor ? { cursor: params.cursor } : {}),
    },
  });

export const createProject = (clientId: string, input: CreateProjectInput) =>
  http.post(`/clients/${clientId}/projects`, projectSchema, input, withIdempotencyKey());

export const updateProject = (projectId: string, input: UpdateProjectInput) =>
  http.patch(`/projects/${projectId}`, projectSchema, input);

export const deleteProject = (projectId: string) =>
  http.delete(`/projects/${projectId}`, z.unknown());
