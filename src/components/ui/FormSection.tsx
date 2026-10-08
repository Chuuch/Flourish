import type { ReactNode } from 'react';

interface FormSectionProps {
  title?: string | undefined;
  description?: string | undefined;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="form-section">
      {title || description ? (
        <div className="space-y-1">
          {title ? <h2>{title}</h2> : null}
          {description ? (
            <p className="text-muted m-0 text-sm leading-relaxed">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
