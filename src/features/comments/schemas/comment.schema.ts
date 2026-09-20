import z from 'zod';

export const commentSchema = z.object({
  id: z.uuid(),
  organization_id: z.string(),
  task_id: z.string(),
  user_id: z.string(),
  body: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const commentsSchema = z.array(commentSchema);

export const createCommentSchema = z.object({
  body: z.string().min(1, 'Body is required').max(2000),
});

export const updateCommentSchema = z.object({
  body: z.string().min(1, 'Body is required').max(2000),
});

export type Comment = z.infer<typeof commentSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

export function canEditComment(userId: string | null | undefined, comment: Comment): boolean {
  return userId === comment.user_id;
}

export function canDeleteComment(
  userId: string | null | undefined,
  role: string | null | undefined,
  comment: Comment,
): boolean {
  return userId === comment.user_id || role === 'owner' || role === 'admin';
}
