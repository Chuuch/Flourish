import { http } from '@/lib/api/http';
import { sessionOrganizationSchema, type UpdateOrganizationInput } from '@/features/auth/schemas/auth.schema';

export const updateOrganization = (input: UpdateOrganizationInput) =>
  http.patch('/organization', sessionOrganizationSchema, input);
