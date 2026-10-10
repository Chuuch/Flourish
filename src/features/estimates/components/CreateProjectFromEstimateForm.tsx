import { useClients } from '@/features/clients';
import { useI18n } from '@/features/i18n';
import { useCreateProjectFromEstimate } from '../hooks/useCreateProjectFromEstimate';
import { useState } from 'react';
import { Alert, Button, FormSection, SelectField, TextField } from '@/components/ui';

export function CreateProjectFromEstimateForm({
  estimateId,
  defaultName = '',
  onCreated,
}: {
  estimateId: string;
  defaultName?: string;
  onCreated?: (projectId: string, clientId: string) => void;
}) {
  const { t } = useI18n();
  const clients = useClients();
  const createProject = useCreateProjectFromEstimate(estimateId);
  const [clientId, setClientId] = useState('');
  const [name, setName] = useState(defaultName);
  const [notes, setNotes] = useState('');

  const clientItems = clients.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!clientId || name.trim().length < 4) {
          return;
        }
        createProject.mutate(
          { client_id: clientId, name: name.trim(), notes },
          {
            onSuccess: (project) => {
              onCreated?.(project.id, project.client_id);
            },
          },
        );
      }}
      noValidate
    >
      <FormSection title={t('estimates.createProject')}>
        <SelectField
          label={t('estimates.client')}
          value={clientId}
          onChange={(event) => {
            setClientId(event.target.value);
          }}
        >
          <option value="">{t('estimates.noClient')}</option>
          {clientItems.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </SelectField>

        <TextField
          label={t('estimates.projectName')}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />

        <TextField
          label={t('clients.notes')}
          value={name}
          onChange={(event) => {
            setNotes(event.target.value);
          }}
        />

        {createProject.isError ? <Alert>{createProject.error.message}</Alert> : null}

        <div className="form-action">
          <Button type="submit" disabled={createProject.isPending || !clientId}>
            {t('estimates.createProject')}
          </Button>
        </div>
      </FormSection>
    </form>
  );
}
