import { http } from '@/lib/api/http';
import {
  loginResponseSchema,
  sessionResponseSchema,
  type LoginInput,
} from '../schemas/auth.schema';

export const login = (input: LoginInput) => http.post('/auth/login', loginResponseSchema, input);

export const fetchSession = () => http.get('/auth/me', sessionResponseSchema);
