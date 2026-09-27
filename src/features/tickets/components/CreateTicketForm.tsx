import { useForm } from 'react-hook-form';
import { useCreateTicket } from '../hooks/useCreateTicket';
import { createTicketSchema, type CreateTicketInput } from '../schemas/ticket.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function CreateTicketForm() {
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
            },
          });
        })(event)
      }
      noValidate
    >
      <div>
        <label htmlFor="kind">{t('tickets.kind')}</label>
        <select id="kind" className="block rounded border px-2 py-1" {...register('kind')}>
          <option value="bug">{t('tickets.kind.bug')}</option>
          <option value="feature">{t('tickets.kind.feature')}</option>
          <option value="question">{t('tickets.kind.question')}</option>
          <option value="other">{t('tickets.kind.other')}</option>
        </select>
        {errors.kind ? <p role="alert">{errors.kind.message}</p> : null}
      </div>

      <TextField
        label={t('tasks.titleLabel')}
        autoComplete="off"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label htmlFor="body">{t('comments.body')}</label>
        <textarea id="body" className="block rounded border px-2 py-1" {...register('body')} />
        {errors.body ? <p role="alert">{errors.body.message}</p> : null}

        {createTicket.isError ? <Alert>{createTicket.error.message}</Alert> : null}

        <Button type="submit" disabled={createTicket.isPending}>
          {t('tickets.submit')}
        </Button>
      </div>
    </form>
  );
}
