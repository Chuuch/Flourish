import { http } from '@/lib/api/http';
import { userSchema, usersSchema } from '../schemas/user.schema';

export const fetchUsers = () => http.get('/users', usersSchema);

export const fetchUser = (id: string) => http.get(`/users/${id}`, userSchema);
