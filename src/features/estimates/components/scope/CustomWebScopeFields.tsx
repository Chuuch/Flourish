import { FieldGrid, SelectField } from '@/components/ui';
import type { EstimateInput } from '../../schemas/estimate.schema';
import { BoolToggleList, ToggleList } from '../ToggleList';

type CustomWeb = NonNullable<EstimateInput['custom_web']>;

const PLATFORMS = ['app', 'admin', 'marketing'].map((value) => ({
  value,
  label: `platform: ${value}`,
}));

export function CustomWebScopeFields({
  value,
  onChange,
}: {
  value: CustomWeb;
  onChange: (next: CustomWeb) => void;
}) {
  return (
    <FieldGrid>
      <SelectField
        label="App scale"
        value={value.app_scale}
        onChange={(event) => {
          onChange({ ...value, app_scale: event.target.value as CustomWeb['app_scale'] });
        }}
      >
        <option value="mvp">mvp</option>
        <option value="growth">growth</option>
        <option value="complex">complex</option>
      </SelectField>

      <SelectField
        label="Auth"
        value={value.auth}
        onChange={(event) => {
          onChange({ ...value, auth: event.target.value as CustomWeb['auth'] });
        }}
      >
        <option value="none">none</option>
        <option value="email">email</option>
        <option value="sso">sso</option>
        <option value="both">both</option>
      </SelectField>

      <SelectField
        label="Payments"
        value={value.payments}
        onChange={(event) => {
          onChange({ ...value, payments: event.target.value as CustomWeb['payments'] });
        }}
      >
        <option value="none">none</option>
        <option value="one_time">one_time</option>
        <option value="subscriptions">subscriptions</option>
        <option value="marketplace">marketplace</option>
      </SelectField>

      <SelectField
        label="Hosting / devops"
        value={value.hosting_devops}
        onChange={(event) => {
          onChange({
            ...value,
            hosting_devops: event.target.value as CustomWeb['hosting_devops'],
          });
        }}
      >
        <option value="none">none</option>
        <option value="basic">basic</option>
        <option value="cicd">cicd</option>
      </SelectField>

      <SelectField
        label="Expected revisions"
        value={value.expected_revisions}
        onChange={(event) => {
          onChange({
            ...value,
            expected_revisions: event.target.value as CustomWeb['expected_revisions'],
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

      <BoolToggleList
        items={[
          {
            key: 'roles_permissions',
            label: 'Roles & permissions',
            checked: value.roles_permissions,
          },
          { key: 'realtime', label: 'Realtime', checked: value.realtime },
          { key: 'file_uploads', label: 'File uploads', checked: value.file_uploads },
          { key: 'multilingual', label: 'Multilingual', checked: value.multilingual },
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
