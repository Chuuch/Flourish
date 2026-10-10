import { FieldGrid, SelectField } from '@/components/ui';
import type { EstimateInput } from '../../schemas/estimate.schema';
import { BoolToggleList, ToggleList } from '../ToggleList';

type Branding = NonNullable<EstimateInput['branding']>;

const DELIVERABLES = ['palette', 'typography', 'guidelines', 'social_kit', 'business_cards'].map(
  (value) => ({ value, label: value }),
);

export function BrandingScopeFields({
  value,
  onChange,
}: {
  value: Branding;
  onChange: (next: Branding) => void;
}) {
  return (
    <FieldGrid>
      <SelectField
        label="Package"
        value={value.package}
        onChange={(event) => {
          onChange({ ...value, package: event.target.value as Branding['package'] });
        }}
      >
        <option value="logo">logo</option>
        <option value="identity">identity</option>
        <option value="full">full</option>
      </SelectField>

      <SelectField
        label="Stakeholders"
        value={value.stakeholder_count}
        onChange={(event) => {
          onChange({
            ...value,
            stakeholder_count: event.target.value as Branding['stakeholder_count'],
          });
        }}
      >
        <option value="1-2">1-2</option>
        <option value="3-5">3-5</option>
        <option value="6+">6+</option>
      </SelectField>

      <SelectField
        label="Expected revisions"
        value={value.expected_revisions}
        onChange={(event) => {
          onChange({
            ...value,
            expected_revisions: event.target.value as Branding['expected_revisions'],
          });
        }}
      >
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </SelectField>

      <ToggleList
        options={DELIVERABLES}
        values={value.deliverables}
        onChange={(deliverables) => {
          onChange({ ...value, deliverables });
        }}
      />

      <BoolToggleList
        items={[
          {
            key: 'has_existing_brand',
            label: 'Existing brand refresh',
            checked: value.has_existing_brand,
          },
          {
            key: 'competitor_research',
            label: 'Competitor research',
            checked: value.competitor_research,
          },
        ]}
        onChange={(key, next) => {
          onChange({ ...value, [key]: next });
        }}
      />
    </FieldGrid>
  );
}
