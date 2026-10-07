import type { ReactNode } from 'react';
import { Button } from './Button';
import { Plus } from 'lucide-react';

type PageHeaderProps = {
  title: ReactNode;
  createLabel?: string;
  onCreate?: () => void;
  description?: ReactNode;
};

export function PageHeader({ title, createLabel, onCreate, description }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="flex items-center gap-2">
        <h1 className="m-0">{title}</h1>
        {onCreate && createLabel ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={createLabel}
            className="size-8 shrink-0 px-0"
            onClick={onCreate}
          >
            <Plus className="size-4" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
