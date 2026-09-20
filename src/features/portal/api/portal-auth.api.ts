import type { LoginInput } from '@/features/auth/schemas/auth.schema';
import { http } from '@/lib/api/http';
import { portalAuthResponseSchema } from '../schemas/portal-auth.schema';
import z from 'zod';

export const portalLogin = (input: LoginInput) =>
  http.post('/client-auth/login', portalAuthResponseSchema, input);

export const fetchPortalSession = () => http.get('/client-auth/me', portalAuthResponseSchema);
export const portalLogout = () => http.post('/client-auth/logout', z.unknown());
