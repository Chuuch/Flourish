import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, FieldGrid, FormSection, TextField } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { canManageMembers } from '@/features/members/schemas/member.schema';
import {
  updateOrganizationInputSchema,
  type UpdateOrganizationInput,
} from '@/features/auth/schemas/auth.schema';
import { useUpdateOrganization } from '../hooks/useUpdateOrganization';

export function OrganizationNameForm() {
  const role = useAuthStore((state) => state.role);
  const organization = useAuthStore((state) => state.organization);
  const updateOrganization = useUpdateOrganization();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationInputSchema),
    values: {
      name: organization?.name ?? '',
      legal_name: organization?.legal_name ?? '',
      registration_number: organization?.registration_number ?? '',
      vat_id: organization?.vat_id ?? '',
      address_line1: organization?.address_line1 ?? '',
      address_line2: organization?.address_line2 ?? '',
      city: organization?.city ?? '',
      postal_code: organization?.postal_code ?? '',
      country: organization?.country ?? '',
      default_vat_rate_bps: organization?.default_vat_rate_bps ?? 2000,
      bank_iban: organization?.bank_iban ?? '',
      bank_bic: organization?.bank_bic ?? '',
      bank_name: organization?.bank_name ?? '',
    },
  });

  if (!canManageMembers(role)) {
    return null;
  }

  return (
    <div className="panel-card">
      <h2 className="m-0 text-sm font-semibold tracking-tight">{t('auth.organizationHeading')}</h2>
      <form
        className="mt-3"
        onSubmit={(event) =>
          void handleSubmit((input) => {
            updateOrganization.mutate(input);
          })(event)
        }
        noValidate
      >
        <FormSection title={t('auth.billingHeading')}>
          <FieldGrid wide>
            <TextField
              label={t('auth.organizationName')}
              autoComplete="organization"
              error={errors.name?.message}
              {...register('name')}
            />
            <TextField
              label={t('auth.legalName')}
              error={errors.legal_name?.message}
              {...register('legal_name')}
            />
            <TextField
              label={t('auth.registrationNumber')}
              error={errors.registration_number?.message}
              {...register('registration_number')}
            />
            <TextField
              label={t('auth.vatId')}
              error={errors.vat_id?.message}
              {...register('vat_id')}
            />
            <TextField
              label={t('auth.defaultVatRate')}
              error={errors.default_vat_rate_bps?.message}
              {...register('default_vat_rate_bps', { valueAsNumber: true })}
            />
          </FieldGrid>
        </FormSection>

        <FormSection title={t('auth.addressHeading')}>
          <FieldGrid>
            <TextField
              label={t('auth.addressLine1')}
              error={errors.address_line1?.message}
              {...register('address_line1')}
            />
            <TextField
              label={t('auth.addressLine2')}
              error={errors.address_line2?.message}
              {...register('address_line2')}
            />
          </FieldGrid>
          <FieldGrid columns={3}>
            <TextField label={t('auth.city')} error={errors.city?.message} {...register('city')} />
            <TextField
              label={t('auth.postalCode')}
              error={errors.postal_code?.message}
              {...register('postal_code')}
            />
            <TextField
              label={t('auth.country')}
              error={errors.country?.message}
              {...register('country')}
            />
          </FieldGrid>
        </FormSection>

        <FormSection title={t('auth.bankHeading')}>
          <FieldGrid wide>
            <TextField
              label={t('auth.bankIban')}
              error={errors.bank_iban?.message}
              {...register('bank_iban')}
            />
            <TextField
              label={t('auth.bankBic')}
              error={errors.bank_bic?.message}
              {...register('bank_bic')}
            />
            <TextField
              label={t('auth.bankName')}
              error={errors.bank_name?.message}
              {...register('bank_name')}
            />
          </FieldGrid>
        </FormSection>

        {updateOrganization.isError ? <Alert>{updateOrganization.error.message}</Alert> : null}

        <div className="form-actions">
          <Button type="submit" disabled={updateOrganization.isPending}>
            {t('auth.saveOrganization')}
          </Button>
        </div>
      </form>
    </div>
  );
}
