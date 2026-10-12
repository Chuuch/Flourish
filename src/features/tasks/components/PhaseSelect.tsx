import { SelectField } from '@/components/ui';
import { useI18n } from '@/features/i18n';
import type { Phase } from '@/features/phases';
import type { UseFormRegisterReturn } from 'react-hook-form';

export function PhaseSelect({
  id,
  label,
  phases,
  error,
  registration,
}: {
  id: string;
  label: string;
  phases: Phase[];
  error?: string | undefined;
  registration: UseFormRegisterReturn;
}) {
  const { t } = useI18n();
  return (
    <SelectField id={id} label={label} error={error} {...registration}>
      <option value="">{t('tasks.noPhase')}</option>
      {phases.map((phase) => (
        <option key={phase.id} value={phase.id}>
          {phase.name}
        </option>
      ))}
    </SelectField>
  );
}
