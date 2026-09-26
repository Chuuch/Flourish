import { z } from 'zod';

export const sessionUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
});

export const sessionOrganizationSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  created_at: z.string(),
  updated_at: z.string(),
});

export const sessionRoleSchema = z.enum(['owner', 'admin', 'member']);

export const loginInputSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerInputSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  organization_name: z.string().min(4, 'Organization name must be at least 4 characters').max(100),
});

export const acceptInviteFormSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const accpetInviteInputSchema = acceptInviteFormSchema.extend({
  token: z.string().min(1, 'Invite token is required'),
});

export const forgotPasswordInputSchema = z.object({
  email: z.email('Enter a valid email address'),
});

export const resetPasswordFormSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const resetPasswordInputSchema = resetPasswordFormSchema.extend({
  token: z.string().min(1, 'Reset token is required'),
});

export const changePasswordInputSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const authResponseSchema = z.object({
  access_token: z.string().min(1),
  user: sessionUserSchema,
  organization: sessionOrganizationSchema,
  role: sessionRoleSchema,
});

export const loginResponseSchema = authResponseSchema;
export const refreshResponseSchema = authResponseSchema;
export const sessionResponseSchema = authResponseSchema;
export const registerResponseSchema = authResponseSchema;

export type SessionUser = z.infer<typeof sessionUserSchema>;
export type SessionOrganization = z.infer<typeof sessionOrganizationSchema>;
export type SessionRole = z.infer<typeof sessionRoleSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type AcceptInviteFormInput = z.infer<typeof acceptInviteFormSchema>;
export type AccpetInviteInput = z.infer<typeof accpetInviteInputSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;
