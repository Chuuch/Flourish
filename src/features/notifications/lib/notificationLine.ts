import { t, type MessageKey } from '@/features/i18n';
import { memberLabel } from '@/features/members/schemas/member.schema';
import type { Notification } from '../schemas/notification.schema';

const kindKeys = {
  ticket_opened: 'notifications.kind.ticketOpened',
  ticket_client_comment: 'notifications.kind.ticketClientComment',
  task_assigned: 'notifications.kind.taskAssigned',
  task_commented: 'notifications.kind.taskCommented',
  ticket_staff_comment: 'notifications.kind.ticketStaffComment',
  ticket_status_changed: 'notifications.kind.ticketStatusChanged',
  ticket_converted: 'notifications.kind.ticketConverted',
} as const satisfies Record<Notification['kind'], MessageKey>;

export function notificationLine(item: Notification): string {
  const actor = memberLabel({
    display_name: item.actor_display_name,
    email: item.actor_email,
  });
  const kind = t(kindKeys[item.kind], { actor });

  if (item.summary.trim() === '') {
    return kind;
  }

  return t('notifications.lineWithSummary', { kind, summary: item.summary });
}
