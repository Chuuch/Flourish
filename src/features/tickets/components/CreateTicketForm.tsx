import { useForm } from 'react-hook-form';
import { useCreateTicket } from '../hooks/useCreateTicket';
import { createTicketSchema, type CreateTicketInput } from '../schemas/ticket.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, SelectField, TextArea, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

type CreateTicketFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreateTicketForm({ onSuccess, onCancel }: CreateTicketFormProps = {}) {
  const createTicket = useCreateTicket();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { kind: 'bug', title: '', body: '' },
  });

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          createTicket.mutate(input, {
            onSuccess: () => {
              reset();
              onSuccess?.();
            },
          });
        })(event)
      }
      noValidate
    >
      <SelectField label={t('tickets.kind')} error={errors.kind?.message} {...register('kind')}>
        <option value="bug">{t('tickets.kind.bug')}</option>
        <option value="feature">{t('tickets.kind.feature')}</option>
        <option value="question">{t('tickets.kind.question')}</option>
        <option value="other">{t('tickets.kind.other')}</option>
      </SelectField>

      <TextField
        label={t('tasks.titleLabel')}
        autoComplete="off"
        error={errors.title?.message}
        {...register('title')}
      />

      <TextArea
        label={t('comments.body')}
        rows={4}
        error={errors.body?.message}
        {...register('body')}
      />

      {createTicket.isError ? <Alert>{createTicket.error.message}</Alert> : null}

      <div className="form-actions">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        ) : null}
        <Button type="submit" disabled={createTicket.isPending}>
          {t('tickets.submit')}
        </Button>
      </div>
    </form>
  );
}
