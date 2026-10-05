import { useAuthStore } from '@/features/auth';
import { useCreateMember } from '../hooks/useCreateMember';
import { useForm } from 'react-hook-form';
import {
  canManageMembers,
  createMemberSchema,
  type CreateMemberInput,
} from '../schemas/member.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, SelectField, TextField } from '@/components/ui';
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
    <div className="panel-card">
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
        <div className="space-y-1">
          <h2 className="m-0 text-sm font-bold tracking-tight">{t('members.inviteHeading')}</h2>
          <p className="text-muted m-0 text-sm leading-relaxed">{t('members.inviteDescription')}</p>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <TextField
              label={t('auth.email')}
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div className="w-full sm:w-44">
            <SelectField
              label={t('members.role')}
              error={errors.role?.message}
              {...register('role')}
            >
              <option value="member">{t('role.member')}</option>
              <option value="admin">{t('role.admin')}</option>
            </SelectField>
          </div>
          <div className="form-actions sm:pb-0.5">
            <Button type="submit" disabled={createMember.isPending}>
              {t('members.invite')}
            </Button>
          </div>
        </div>

        {createMember.isError ? <Alert>{createMember.error.message}</Alert> : null}
      </form>
    </div>
  );
}
