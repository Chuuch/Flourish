import { FieldGrid, SelectField, TextField } from '@/components/ui';
import type { EstimateInput } from '../../schemas/estimate.schema';
import { BoolToggleList, ToggleList } from '../ToggleList';

type Website = NonNullable<EstimateInput['website']>;

const FLAGS: { key: keyof Website; label: string }[] = [
  { key: 'multilingual', label: 'Multilingual' },
  { key: 'cms_required', label: 'CMS required' },
  { key: 'content_ready', label: 'Content ready' },
  { key: 'seo_setup', label: 'SEO setup' },
  { key: 'uiux_included', label: 'UI/UX included' },
  { key: 'branding_included', label: 'Branding included' },
];

const INTEGRATIONS = [
  'crm',
  'newsletter',
  'analytics',
  'booking',
  'payments',
  'maps',
  'live_chat',
].map((value) => ({ value, label: value }));

export function WebsiteScopeFields({
  value,
  onChange,
}: {
  value: Website;
  onChange: (next: Website) => void;
}) {
  return (
    <FieldGrid>
      <SelectField
        label="Website type"
        value={value.website_type}
        onChange={(event) => {
          onChange({
            ...value,
            website_type: event.target.value as Website['website_type'],
          });
        }}
      >
        <option value="landing">Landing</option>
        <option value="corporate">Corporate</option>
        <option value="ecommerce">Ecommerce</option>
      </SelectField>

      <TextField
        label="Page count"
        type="number"
        min={1}
        value={String(value.page_count)}
        onChange={(event) => {
          onChange({ ...value, page_count: Number(event.target.value) || 1 });
        }}
      />

      <SelectField
        label="Expected revisions"
        value={value.expected_revisions}
        onChange={(event) => {
          onChange({
            ...value,
            expected_revisions: event.target.value as Website['expected_revisions'],
          });
        }}
      >
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </SelectField>

      <BoolToggleList
        items={FLAGS.map((flag) => ({
          key: flag.key,
          label: flag.label,
          checked: Boolean(value[flag.key]),
        }))}
        onChange={(key, next) => {
          onChange({ ...value, [key]: next });
        }}
      />

      <ToggleList
        options={INTEGRATIONS}
        values={value.integrations}
        onChange={(integrations) => {
          onChange({ ...value, integrations });
        }}
      />
    </FieldGrid>
  );
}
