import { Alert, Button, FieldGrid, FormSection, TextArea, TextField } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateClient } from '../hooks/useCreateClient';
import {
  canManageClients,
  createClientSchema,
  type CreateClientInput,
} from '../schemas/client.schema';

const emptyClient: CreateClientInput = {
  name: '',
  notes: '',
  legal_name: '',
  vat_id: '',
  address_line1: '',
  address_line2: '',
  city: '',
  postal_code: '',
  country: '',
};

export function CreateClientForm() {
  const role = useAuthStore((state) => state.role);
  const createClient = useCreateClient();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: emptyClient,
  });

  if (!canManageClients(role)) {
    return null;
  }

  return (
    <div className="panel-card">
      <form
        onSubmit={(event) =>
          void handleSubmit((input) => {
            createClient.mutate(input, {
              onSuccess: () => {
                reset();
              },
            });
          })(event)
        }
        noValidate
      >
        <FormSection title={t('clients.billingHeading')}>
          <TextField
            label={t('clients.name')}
            autoComplete="organization"
            error={errors.name?.message}
            {...register('name')}
          />
          <TextArea
            label={t('clients.notes')}
            error={errors.notes?.message}
            {...register('notes')}
          />
          <FieldGrid>
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
          </FieldGrid>
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
          <FieldGrid>
            <TextField
              label={t('clients.city')}
              error={errors.city?.message}
              {...register('city')}
            />
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
          </FieldGrid>
        </FormSection>

        {createClient.isError ? <Alert>{createClient.error.message}</Alert> : null}

        <div className="form-actions">
          <Button type="submit" disabled={createClient.isPending}>
            {t('clients.add')}
          </Button>
        </div>
      </form>
    </div>
  );
}
