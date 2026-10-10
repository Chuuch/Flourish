import { FieldGrid, SelectField, TextField } from '@/components/ui';
import type { EstimateInput } from '../../schemas/estimate.schema';
import { BoolToggleList, ToggleList } from '../ToggleList';

type Design = NonNullable<EstimateInput['design']>;

const DELIVERABLES = ['wireframes', 'hi_fi', 'design_system', 'prototype', 'handoff'].map(
  (value) => ({ value, label: value }),
);

export function DesignScopeFields({
  value,
  onChange,
}: {
  value: Design;
  onChange: (next: Design) => void;
}) {
  return (
    <FieldGrid>
      <SelectField
        label="Design size"
        value={value.design_size}
        onChange={(event) => {
          onChange({
            ...value,
            design_size: event.target.value as Design['design_size'],
          });
        }}
      >
        <option value="small">small</option>
        <option value="medium">medium</option>
        <option value="large">large</option>
      </SelectField>

      <TextField
        label="Screen count"
        type="number"
        min={0}
        value={String(value.screen_count)}
        onChange={(event) => {
          onChange({ ...value, screen_count: Number(event.target.value) || 0 });
        }}
      />

      <SelectField
        label="Expected revisions"
        value={value.expected_revisions}
        onChange={(event) => {
          onChange({
            ...value,
            expected_revisions: event.target.value as Design['expected_revisions'],
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
            key: 'brand_guidelines_exist',
            label: 'Brand guidelines exist',
            checked: value.brand_guidelines_exist,
          },
          { key: 'includes_mobile', label: 'Includes mobile', checked: value.includes_mobile },
          { key: 'includes_desktop', label: 'Includes desktop', checked: value.includes_desktop },
        ]}
        onChange={(key, next) => {
          onChange({ ...value, [key]: next });
        }}
      />
    </FieldGrid>
  );
}
