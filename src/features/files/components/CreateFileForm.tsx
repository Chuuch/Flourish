import { useAuthStore } from '@/features/auth';
import { useUploadFIle } from '../hooks/useUploadFile';
import { useRef, useState } from 'react';
import { canManageFiles, isAllowedFile, MAX_FILE_SIZE_BYTES } from '../schemas/file.schema';
import { Alert, Button, FileField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function CreateFileForm({ projectId }: { projectId: string }) {
  const role = useAuthStore((state) => state.role);
  const uploadFile = useUploadFIle(projectId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pickerKey, setPickerKey] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { t } = useI18n();

  if (!canManageFiles(role)) {
    return null;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const file = inputRef.current?.files?.[0];
        if (!file) {
          setValidationError(t('validation.fileRequired'));
          return;
        }
        if (!isAllowedFile(file)) {
          setValidationError(t('validation.fileType'));
          return;
        }
        if (file.size < 1 || file.size > MAX_FILE_SIZE_BYTES) {
          setValidationError(t('validation.fileTooLarge'));
          return;
        }
        setValidationError(null);
        uploadFile.mutate(file, {
          onSuccess: () => {
            setPickerKey((key) => key + 1);
          },
        });
      }}
      noValidate
    >
      <FileField
        key={pickerKey}
        id="file"
        ref={inputRef}
        label={t('files.file')}
        accept=".pdf,.png,.jpeg,.jpg,.webp,.txt,.zip,.application/pdf,image/png,image/jpeg,image/webp,text/plain,application/zip"
        error={validationError ?? undefined}
      />

      {uploadFile.isError ? <Alert>{uploadFile.error.message}</Alert> : null}

      <div className="form-actions">
        <Button type="submit" disabled={uploadFile.isPending}>
          {t('common.upload')}
        </Button>
      </div>
    </form>
  );
}
