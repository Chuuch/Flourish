import { useForm } from 'react-hook-form';
import { useCreateTicket } from '../hooks/useCreateTicket';
import { createTicketSchema, type CreateTicketInput } from '../schemas/ticket.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';

export function CreateTicketForm() {
  const createTicket = useCreateTicket();

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
        <label htmlFor="kind">Kind</label>
        <select id="kind" className="block rounded border px-2 py-1" {...register('kind')}>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="question">Question</option>
          <option value="other">Other</option>
        </select>
        {errors.kind ? <p role="alert">{errors.kind.message}</p> : null}
      </div>

      <TextField
        label="Title"
        autoComplete="off"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label htmlFor="body">Body</label>
        <textarea id="body" className="block rounded border px-2 py-1" {...register('body')} />
        {errors.body ? <p role="alert">{errors.body.message}</p> : null}

        {createTicket.isError ? <Alert>{createTicket.error.message}</Alert> : null}

        <Button type="submit" disabled={createTicket.isPending}>
          Submit ticket
        </Button>
      </div>
    </form>
  );
}
