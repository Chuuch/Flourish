import { useRef, useState } from 'react';
import { useUploadTicketFile } from '../hooks/useUploadTicketFile';
import { isAllowedTicketFile, MAX_TICKET_FILE_SIZE_BYTES } from '../schemas/ticket-file.schema';
import { Alert, Button } from '@/components/ui';
import type { TicketFileSource } from '../api/ticket-files.api';
import { useI18n } from '@/features/i18n';

export function CreateTicketFileForm({
  ticketId,
  source = 'portal',
}: {
  ticketId: string;
  source?: TicketFileSource;
}) {
  const uploadFile = useUploadTicketFile(ticketId, source);
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { t } = useI18n();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const file = inputRef.current?.files?.[0];
        if (!file) {
          setValidationError(t('validation.fileRequired'));
          return;
        }
        if (!isAllowedTicketFile(file)) {
          setValidationError(t('validation.fileRequired'));
          return;
        }
        if (file.size < 1 || file.size > MAX_TICKET_FILE_SIZE_BYTES) {
          setValidationError(t('validation.fileTooLarge'));
          return;
        }
        setValidationError(null);
        uploadFile.mutate(file, {
          onSuccess: () => {
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          },
        });
      }}
      noValidate
    >
      <div>
        <label htmlFor={`file-${ticketId}`}>{t('tickets.attachment')}</label>
        <input
          id={`file-${ticketId}`}
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpeg,.webp,.txt,.zip,applicetion/pdf,image/png,image/jpeg,image/webp,text/plain,application/zip"
          className="block rounded border px-2 py-1"
        />
      </div>

      {validationError ? <p role="alert">{validationError}</p> : null}
      {uploadFile.isError ? <Alert>{uploadFile.error.message}</Alert> : null}

      <Button type="submit" disabled={uploadFile.isPending}>
        {t('common.upload')}
      </Button>
    </form>
  );
}
