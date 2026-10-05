import { Alert, Button, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDeleteClient } from '../hooks/useDeleteClient';
import { useUpdateClient } from '../hooks/useUpdateClient';
import { updateClientSchema, type Client, type UpdateClientInput } from '../schemas/client.schema';

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
    values: {
      name: client.name,
      notes: client.notes,
      legal_name: client.legal_name,
      vat_id: client.vat_id,
      address_line1: client.address_line1,
      address_line2: client.address_line2,
      city: client.city,
      postal_code: client.postal_code,
      country: client.country,
    },
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

        <h2>{t('clients.billingHeading')}</h2>
        <TextField
          label={t('clients.legalName')}
          error={errors.legal_name?.message}
          {...register('legal_name')}
        />
        <TextField
          label={t('clients.vatId')}
          error={errors.vat_id?.message}
          {...register('vat_id')}
        />
        <TextField
          label={t('clients.addressLine1')}
          error={errors.address_line1?.message}
          {...register('address_line1')}
        />
        <TextField
          label={t('clients.addressLine2')}
          error={errors.address_line2?.message}
          {...register('address_line2')}
        />
        <TextField label={t('clients.city')} error={errors.city?.message} {...register('city')} />
        <TextField
          label={t('clients.postalCode')}
          error={errors.postal_code?.message}
          {...register('postal_code')}
        />
        <TextField
          label={t('clients.country')}
          error={errors.country?.message}
          {...register('country')}
        />

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
