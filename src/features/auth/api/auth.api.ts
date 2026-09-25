import { http } from '@/lib/api/http';
import {
  loginResponseSchema,
  registerResponseSchema,
  sessionResponseSchema,
  type AccpetInviteInput,
  type LoginInput,
  type RegisterInput,
} from '../schemas/auth.schema';
import z from 'zod';

export const login = (input: LoginInput) => http.post('/auth/login', loginResponseSchema, input);

export const register = (input: RegisterInput) =>
  http.post('/auth/register', registerResponseSchema, input);

export const acceptInvite = (input: AccpetInviteInput) =>
  http.post('/auth/accept-invite', z.unknown(), input);

export const fetchSession = () => http.get('/auth/me', sessionResponseSchema);

export const logout = () => http.post('/auth/logout', z.unknown());
