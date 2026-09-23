import { http } from '@/lib/api/http';
import {
  memberSchema,
  membersSchema,
  type CreateMemberInput,
  type UpdateMemberInput,
} from '../schemas/member.schema';
import z from 'zod';

export const fetchMembers = () => http.get('/members', membersSchema);
export const createMember = (input: CreateMemberInput) =>
  http.post('/members', memberSchema, input);

export const updateMember = (userId: string, input: UpdateMemberInput) =>
  http.patch(`/members/${userId}`, memberSchema, input);

export const deleteMember = (userId: string) => http.delete(`/members/${userId}`, z.unknown());
