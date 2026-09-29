import { t } from '@/features/i18n';
import { z } from 'zod';

export const sessionUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  display_name: z.string().default(''),
});

export const sessionOrganizationSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  created_at: z.string(),
  updated_at: z.string(),
});

export const sessionRoleSchema = z.enum(['owner', 'admin', 'member']);

export const loginInputSchema = z.object({
  email: z.email({ error: () => t('validation.email') }),
  password: z.string().min(1, { error: () => t('validation.passwordRequired') }),
});

export const registerInputSchema = z.object({
  email: z.email({ error: () => t('validation.email') }),
  password: z.string().min(1, { error: () => t('validation.passwordRequired') }),
  organization_name: z
    .string()
    .min(4, { error: () => t('validation.orgNameMin') })
    .max(100),
});

export const acceptInviteFormSchema = z.object({
  password: z.string().min(8, { error: () => t('validation.passwordMin') }),
});

export const accpetInviteInputSchema = acceptInviteFormSchema.extend({
  token: z.string().min(1, { error: () => t('validation.inviteToken') }),
});

export const forgotPasswordInputSchema = z.object({
  email: z.email({ error: () => t('validation.email') }),
});

export const resetPasswordFormSchema = z.object({
  password: z.string().min(8, { error: () => t('validation.passwordMin') }),
});

export const resetPasswordInputSchema = resetPasswordFormSchema.extend({
  token: z.string().min(1, { error: () => t('validation.resetToken') }),
});

export const changePasswordInputSchema = z.object({
  current_password: z.string().min(1, { error: () => t('validation.currentPassword') }),
  password: z.string().min(8, { error: () => t('validation.passwordMin') }),
});

export const updateDisplayNameInputSchema = z.object({
  display_name: z.string().max(100),
});

export const updateOrganizationInputSchema = z.object({
  name: z
    .string()
    .min(4, { error: () => t('validation.orgNameMin') })
    .max(100),
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
export type SessionUserInput = z.input<typeof sessionUserSchema>;
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
export type UpdateDisplayNameInput = z.infer<typeof updateDisplayNameInputSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationInputSchema>;
