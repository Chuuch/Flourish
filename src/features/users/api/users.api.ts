import { http } from '@/lib/api/http';
import { userSchema, usersSchema, type CreateUserInput } from '../schemas/user.schema';

export const fetchUsers = () => http.get('/users', usersSchema);

export const fetchUser = (id: string) => http.get(`/users/${id}`, userSchema);

export const createUser = (input: CreateUserInput) => http.post('/users/', userSchema, input);
