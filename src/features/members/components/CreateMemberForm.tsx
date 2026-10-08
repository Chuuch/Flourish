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

type CreateMemberFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreateMemberForm({ onSuccess, onCancel }: CreateMemberFormProps = {}) {
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
              onSuccess?.();
            },
          });
        })(event)
      }
      noValidate
    >
      <div className="space-y-1">
        <p className="text-muted m-0 text-sm leading-relaxed">{t('members.inviteDescription')}</p>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <TextField
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <SelectField label={t('members.role')} error={errors.role?.message} {...register('role')}>
          <option value="member">{t('role.member')}</option>
          <option value="admin">{t('role.admin')}</option>
        </SelectField>
      </div>

      {createMember.isError ? <Alert>{createMember.error.message}</Alert> : null}

      <div className="form-actions">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        ) : null}
        <Button type="submit" disabled={createMember.isPending}>
          {t('members.invite')}
        </Button>
      </div>
    </form>
  );
}
