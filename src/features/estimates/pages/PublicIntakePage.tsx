import { Alert, Button, FormSection, TextArea, TextField } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import type { MessageKey } from '@/features/i18n';
import { useState } from 'react';
import { useParams } from 'react-router';
import { BrandingScopeFields } from '../components/scope/BrandingScopeFields';
import { CustomMobileScopeFields } from '../components/scope/CustomMobileScopeFields';
import { CustomWebScopeFields } from '../components/scope/CustomWebScopeFields';
import { DesignScopeFields } from '../components/scope/DesignScopeFields';
import { MarketingScopeFields } from '../components/scope/MarketingScopeFields';
import { WebsiteScopeFields } from '../components/scope/WebsiteScopeFields';
import { usePublicIntake } from '../hooks/usePublicIntake';
import { useSubmitIntake } from '../hooks/useSubmitIntake';
import { defaultIntakeScope } from '../lib/intakeScope';
import type { IntakeScope } from '../schemas/intake.schema';

function label(t: (key: MessageKey) => string, key: MessageKey, fallback: string): string {
  const value = t(key);
  return value.trim() ? value : fallback;
}

export function PublicIntakePage() {
  const { token = '' } = useParams();
  const { t } = useI18n();
  const { data, error, isPending, isError, refetch } = usePublicIntake(token);
  const submit = useSubmitIntake(token);
  const [submitted, setSubmitted] = useState(false);

  const [respondentEmail, setRespondentEmail] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [preferredDeadline, setPreferredDeadline] = useState('');
  const [scope, setScope] = useState<IntakeScope | null>(null);

  if (!token) {
    return (
      <main>
        <h1>Project questionnaire</h1>
        <p>Missing token in URL.</p>
      </main>
    );
  }

  if (isPending) {
    return (
      <main>
        <ListSkeleton label={label(t, 'intake.loading', 'Loading questionnaire...')} />
      </main>
    );
  }

  if (isError) {
    return (
      <main>
        <h1>Project questionnaire</h1>
        <Alert>
          <p>
            {error instanceof Error ? error.message : 'Could not open this questionnaire link.'}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              void refetch();
            }}
          >
            Retry
          </Button>
        </Alert>
      </main>
    );
  }

  const activeScope = scope ?? defaultIntakeScope(data.category);

  if (submitted || data.status === 'submitted' || data.status === 'consumed') {
    return (
      <main>
        <div className="page-header">
          <h1>{label(t, 'intake.thanksTitle', 'Thank you')}</h1>
          <p>
            {label(
              t,
              'intake.thanksBody',
              'We received your answers. Our team will follow up shortly.',
            )}
          </p>
        </div>
      </main>
    );
  }

  if (data.status === 'expired') {
    return (
      <main>
        <div className="page-header">
          <h1>{label(t, 'intake.expiredTitle', 'This link has expired')}</h1>
          <p>{label(t, 'intake.expiredBody', 'Please ask us for a new questionnaire link.')}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="page-header">
        <h1>{label(t, 'intake.title', 'Project questionnaire')}</h1>
        <p>
          {data.category} · {data.mode}
        </p>
      </div>

      <form
        className="flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          submit.mutate(
            {
              respondent_email: respondentEmail.trim(),
              respondent_name: respondentName.trim(),
              company_name: companyName.trim(),
              project_name: projectName.trim(),
              customer_notes: customerNotes.trim(),
              preferred_deadline: preferredDeadline,
              scope: {
                ...activeScope,
                project_name: projectName.trim(),
                respondent_name: respondentName.trim(),
                company_name: companyName.trim(),
                customer_notes: customerNotes.trim(),
                ...(preferredDeadline ? { preferred_deadline: preferredDeadline } : {}),
              },
            },
            {
              onSuccess: () => {
                setSubmitted(true);
              },
            },
          );
        }}
        noValidate
      >
        <FormSection title={label(t, 'intake.contact', 'Your details')}>
          <TextField
            label={label(t, 'intake.email', 'Email')}
            type="email"
            required
            value={respondentEmail}
            onChange={(e) => {
              setRespondentEmail(e.target.value);
            }}
          />
          <TextField
            label={label(t, 'intake.name', 'Name')}
            required
            value={respondentName}
            onChange={(e) => {
              setRespondentName(e.target.value);
            }}
          />
          <TextField
            label={label(t, 'intake.company', 'Company')}
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
            }}
          />
          <TextField
            label={label(t, 'estimates.projectName', 'Project name')}
            required
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
            }}
          />
          <TextField
            label={label(t, 'intake.preferredDeadline', 'Preferred deadline')}
            type="date"
            value={preferredDeadline}
            onChange={(e) => {
              setPreferredDeadline(e.target.value);
            }}
          />
          <TextArea
            label={label(t, 'estimates.customerNotes', 'Notes')}
            value={customerNotes}
            onChange={(e) => {
              setCustomerNotes(e.target.value);
            }}
          />
        </FormSection>

        <FormSection title={label(t, 'estimates.scope', 'Scope')}>
          {data.category === 'website' && activeScope.website ? (
            <WebsiteScopeFields
              value={activeScope.website}
              onChange={(website) => {
                setScope({ ...activeScope, website });
              }}
            />
          ) : null}
          {data.category === 'design' && activeScope.design ? (
            <DesignScopeFields
              value={activeScope.design}
              onChange={(design) => {
                setScope({ ...activeScope, design });
              }}
            />
          ) : null}
          {data.category === 'branding' && activeScope.branding ? (
            <BrandingScopeFields
              value={activeScope.branding}
              onChange={(branding) => {
                setScope({ ...activeScope, branding });
              }}
            />
          ) : null}
          {data.category === 'custom_web' && activeScope.custom_web ? (
            <CustomWebScopeFields
              value={activeScope.custom_web}
              onChange={(custom_web) => {
                setScope({ ...activeScope, custom_web });
              }}
            />
          ) : null}
          {data.category === 'custom_mobile' && activeScope.custom_mobile ? (
            <CustomMobileScopeFields
              value={activeScope.custom_mobile}
              onChange={(custom_mobile) => {
                setScope({ ...activeScope, custom_mobile });
              }}
            />
          ) : null}
          {data.category === 'marketing' && activeScope.marketing ? (
            <MarketingScopeFields
              value={activeScope.marketing}
              onChange={(marketing) => {
                setScope({ ...activeScope, marketing });
              }}
            />
          ) : null}
        </FormSection>

        {submit.isError ? (
          <Alert>{submit.error instanceof Error ? submit.error.message : 'Submit failed'}</Alert>
        ) : null}

        <div className="form-actions">
          <Button type="submit" disabled={submit.isPending}>
            {label(t, 'intake.submit', 'Submit')}
          </Button>
        </div>
      </form>
    </main>
  );
}
