import { http } from '@/lib/api/http';
import { loginResponseSchema, type LoginInput } from '../schemas/auth.schema';

export const login = (input: LoginInput) => http.post('/auth/login', loginResponseSchema, input);
