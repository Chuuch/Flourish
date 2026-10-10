import { FieldGrid, SelectField } from '@/components/ui';
import type { EstimateInput } from '../../schemas/estimate.schema';
import { BoolToggleList, ToggleList } from '../ToggleList';

type CustomMobile = NonNullable<EstimateInput['custom_mobile']>;

const PLATFORMS = ['ios', 'android', 'both'].map((value) => ({
  value,
  label: `platform: ${value}`,
}));

const DEVICE_FEATURES = ['camera', 'maps', 'bluetooth', 'biometrics'].map((value) => ({
  value,
  label: value,
}));

export function CustomMobileScopeFields({
  value,
  onChange,
}: {
  value: CustomMobile;
  onChange: (next: CustomMobile) => void;
}) {
  return (
    <FieldGrid>
      <SelectField
        label="App scale"
        value={value.app_scale}
        onChange={(event) => {
          onChange({ ...value, app_scale: event.target.value as CustomMobile['app_scale'] });
        }}
      >
        <option value="mvp">mvp</option>
        <option value="growth">growth</option>
        <option value="complex">complex</option>
      </SelectField>

      <SelectField
        label="Backend"
        value={value.backend}
        onChange={(event) => {
          onChange({ ...value, backend: event.target.value as CustomMobile['backend'] });
        }}
      >
        <option value="none">none</option>
        <option value="existing">existing</option>
        <option value="new">new</option>
      </SelectField>

      <SelectField
        label="Auth"
        value={value.auth}
        onChange={(event) => {
          onChange({ ...value, auth: event.target.value as CustomMobile['auth'] });
        }}
      >
        <option value="none">none</option>
        <option value="email">email</option>
        <option value="sso">sso</option>
        <option value="both">both</option>
      </SelectField>

      <SelectField
        label="Expected revisions"
        value={value.expected_revisions}
        onChange={(event) => {
          onChange({
            ...value,
            expected_revisions: event.target.value as CustomMobile['expected_revisions'],
          });
        }}
      >
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </SelectField>

      <ToggleList
        options={PLATFORMS}
        values={value.platforms}
        onChange={(platforms) => {
          onChange({ ...value, platforms });
        }}
      />

      <ToggleList
        options={DEVICE_FEATURES}
        values={value.device_features}
        onChange={(device_features) => {
          onChange({ ...value, device_features });
        }}
      />

      <BoolToggleList
        items={[
          { key: 'offline', label: 'Offline', checked: value.offline },
          {
            key: 'push_notifications',
            label: 'Push notifications',
            checked: value.push_notifications,
          },
          { key: 'payments_in_app', label: 'Payments in app', checked: value.payments_in_app },
          { key: 'store_release', label: 'Store release', checked: value.store_release },
          { key: 'design_included', label: 'Design included', checked: value.design_included },
          { key: 'content_ready', label: 'Content ready', checked: value.content_ready },
        ]}
        onChange={(key, next) => {
          onChange({ ...value, [key]: next });
        }}
      />
    </FieldGrid>
  );
}
