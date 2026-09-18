import { http } from '@/lib/api/http';
import {
  commentSchema,
  commentsSchema,
  type CreateCommentInput,
  type UpdateCommentInput,
} from '../schemas/comment.schema';
import z from 'zod';

export const fetchComments = (taskId: string) =>
  http.get(`/tasks/${taskId}/comments`, commentsSchema);

export const createComment = (taskId: string, input: CreateCommentInput) =>
  http.post(`/tasks/${taskId}/comments`, commentSchema, input);

export const updateComment = (commentId: string, input: UpdateCommentInput) =>
  http.patch(`/comments/${commentId}`, commentSchema, input);

export const deleteComment = (commentId: string) =>
  http.delete(`/comments/${commentId}`, z.unknown());
