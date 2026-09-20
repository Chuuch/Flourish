import { http } from '@/lib/api/http';
import { memberSchema, membersSchema, type CreateMemberInput } from '../schemas/member.schema';

export const fetchMembers = () => http.get('/members', membersSchema);
export const createMember = (input: CreateMemberInput) =>
  http.post('/members', memberSchema, input);
