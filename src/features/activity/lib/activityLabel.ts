import { t } from '@/features/i18n';
import type { ActivityEvent } from '../schemas/activity.schema';
import { memberLabel } from '@/features/members/schemas/member.schema';

function actionLabel(action: ActivityEvent['action']): string {
  switch (action) {
    case 'created':
      return t('activity.action.created');
    case 'updated':
      return t('activity.action.updated');
    case 'deleted':
      return t('activity.action.deleted');
    case 'converted':
      return t('activity.action.converted');
    default:
      return action;
  }
}

function entityLabel(entityType: ActivityEvent['entity_type']): string {
  switch (entityType) {
    case 'task':
      return t('activity.entity.task');
    case 'ticket':
      return t('activity.entity.ticket');
    case 'file':
      return t('activity.entity.file');
    case 'ticket_file':
      return t('activity.entity.ticket_file');
    case 'comment':
      return t('activity.entity.comment');
    case 'ticket_comment':
      return t('activity.entity.ticket_comment');
    default:
      return entityType;
  }
}

export function activityLine(event: ActivityEvent): string {
  const actor = memberLabel({
    display_name: event.actor_display_name,
    email: event.actor_email,
  });
  const action = actionLabel(event.action);
  const entity = entityLabel(event.entity_type);

  if (event.summary.trim() === '') {
    return t('activity.line', { actor, action, entity });
  }

  return t('activity.lineWithSummary', {
    actor,
    action,
    entity,
    summary: event.summary,
  });
}
