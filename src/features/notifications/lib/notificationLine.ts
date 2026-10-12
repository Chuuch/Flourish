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
  intake_submitted: 'notifications.kind.intakeSubmitted',
} as const satisfies Record<Notification['kind'], MessageKey>;

const ticketStatusKeys = {
  open: 'tickets.status.open',
  in_progress: 'tickets.status.inProgress',
  resolved: 'tickets.status.resolved',
  closed: 'tickets.status.closed',
} as const satisfies Record<string, MessageKey>;

function formatSummary(item: Notification): string {
  const summary = item.summary.trim();
  if (summary === '') {
    return '';
  }

  if (
    (item.kind === 'ticket_status_changed' || item.kind === 'ticket_converted') &&
    summary in ticketStatusKeys
  ) {
    return t(ticketStatusKeys[summary as keyof typeof ticketStatusKeys]);
  }
  return summary;
}

export function notificationLine(item: Notification): string {
  const actor = memberLabel({
    display_name: item.actor_display_name,
    email: item.actor_email,
  });

  const kindLine = t(kindKeys[item.kind], { actor });
  const summary = formatSummary(item);

  if (summary === '') {
    return kindLine;
  }

  return t('notifications.lineWithSummary', { kind: kindLine, summary });
}
