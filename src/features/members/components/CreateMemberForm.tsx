import { useAuthStore } from '@/features/auth';
import { useCreateMember } from '../hooks/useCreateMember';
import { useForm } from 'react-hook-form';
import {
  canManageMembers,
  createMemberSchema,
  type CreateMemberInput,
} from '../schemas/member.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function CreateMemberForm() {
  const role = useAuthStore((state) => state.role);
  const createMember = useCreateMember();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMemberInput>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: { email: '', role: 'member' },
  });

  if (!canManageMembers(role)) {
    return null;
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          createMember.mutate(input, {
            onSuccess: () => {
              reset();
            },
          });
        })(event)
      }
      noValidate
    >
      <TextField
        label={t('auth.email')}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <label htmlFor="role">{t('members.role')}</label>
        <select id="role" className="block rounded border px-2 py-1" {...register('role')}>
          <option value="member">{t('role.member')}</option>
          <option value="admin">{t('role.admin')}</option>
        </select>
        {errors.role ? <p role="alert">{errors.role.message}</p> : null}
      </div>

      {createMember.isError ? <Alert>{createMember.error.message}</Alert> : null}

      <Button type="submit" disabled={createMember.isPending}>
        {t('members.invite')}
      </Button>
    </form>
  );
}
