import { useI18n } from '@/features/i18n';
import { useDeleteClient } from '../hooks/useDeleteClient';
import { useUpdateClient } from '../hooks/useUpdateClient';
import { useForm } from 'react-hook-form';
import { updateClientSchema, type Client, type UpdateClientInput } from '../schemas/client.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';

export function ClientManageForm({ client }: { client: Client }) {
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateClientInput>({
    resolver: zodResolver(updateClientSchema),
    values: { name: client.name, notes: client.notes },
  });

  return (
    <>
      {updateClient.isError ? <Alert>{updateClient.error.message}</Alert> : null}
      {deleteClient.isError ? <Alert>{deleteClient.error.message}</Alert> : null}
      <form
        onSubmit={(event) =>
          void handleSubmit((input) => {
            updateClient.mutate({ clientId: client.id, input });
          })(event)
        }
        noValidate
      >
        <TextField
          label={t('clients.nameFor', { name: client.name })}
          autoComplete="organization"
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <label htmlFor={`notes-${client.id}`}>
            {t('clients.notesFor', { name: client.name })}
          </label>
          <textarea
            id={`notes-${client.id}`}
            className="block rounded px-2 py-1"
            {...register('notes')}
          />
          {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}
        </div>

        <Button type="submit" disabled={updateClient.isPending}>
          {t('clients.save', { name: client.name })}
        </Button>
      </form>
      <Button
        type="button"
        disabled={deleteClient.isPending}
        onClick={() => {
          deleteClient.mutate(client.id);
        }}
      >
        {t('clients.remove', { name: client.name })}
      </Button>
    </>
  );
}
