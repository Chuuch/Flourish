import { FieldGrid, SelectField, TextField } from '@/components/ui';
import type { EstimateInput } from '../../schemas/estimate.schema';
import { BoolToggle, ToggleList } from '../ToggleList';

type Marketing = NonNullable<EstimateInput['marketing']>;

const CHANNELS = ['meta', 'google', 'linkedin', 'tiktok', 'email'].map((value) => ({
  value,
  label: value,
}));

export function MarketingScopeFields({
  value,
  onChange,
}: {
  value: Marketing;
  onChange: (next: Marketing) => void;
}) {
  return (
    <FieldGrid>
      <SelectField
        label="Reporting"
        value={value.reporting_level}
        onChange={(event) => {
          onChange({
            ...value,
            reporting_level: event.target.value as Marketing['reporting_level'],
          });
        }}
      >
        <option value="basic">basic</option>
        <option value="standard">standard</option>
        <option value="advanced">advanced</option>
      </SelectField>

      <SelectField
        label="Campaign complexity"
        value={value.campaign_complexity}
        onChange={(event) => {
          onChange({
            ...value,
            campaign_complexity: event.target.value as Marketing['campaign_complexity'],
          });
        }}
      >
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </SelectField>

      <SelectField
        label="Ad spend band"
        value={value.ad_spend_band}
        onChange={(event) => {
          onChange({
            ...value,
            ad_spend_band: event.target.value as Marketing['ad_spend_band'],
          });
        }}
      >
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </SelectField>

      <TextField
        label="Creatives / month"
        type="number"
        min={0}
        value={String(value.creatives_per_month)}
        onChange={(event) => {
          onChange({ ...value, creatives_per_month: Number(event.target.value) || 0 });
        }}
      />

      <TextField
        label="Creatives one-shot"
        type="number"
        min={0}
        value={String(value.creatives_one_shot)}
        onChange={(event) => {
          onChange({ ...value, creatives_one_shot: Number(event.target.value) || 0 });
        }}
      />

      <TextField
        label="Duration weeks"
        type="number"
        min={0}
        value={String(value.duration_weeks)}
        onChange={(event) => {
          onChange({ ...value, duration_weeks: Number(event.target.value) || 0 });
        }}
      />

      <TextField
        label="Campaign goal"
        value={value.campaign_goal}
        onChange={(event) => {
          onChange({ ...value, campaign_goal: event.target.value });
        }}
      />

      <ToggleList
        options={CHANNELS}
        values={value.channels}
        onChange={(channels) => {
          onChange({ ...value, channels });
        }}
      />

      <BoolToggle
        label="Landing page support"
        checked={value.landing_page_support}
        onChange={(landing_page_support) => {
          onChange({ ...value, landing_page_support });
        }}
      />
    </FieldGrid>
  );
}
