import type { Task } from '../schemas/task.schema';

export type CalendarDay = {
  date: string;
  inMonth: boolean;
  tasks: Task[];
};

function parseDay(value: string): Date {
  const parts = value.split('-');
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatDay(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${String(y)}-${m}-${d}`;
}

function taskScheduleSpan(task: Task): { start: string; end: string } | null {
  if (task.starts_on && task.due_on) {
    return task.starts_on <= task.due_on
      ? { start: task.starts_on, end: task.due_on }
      : { start: task.due_on, end: task.starts_on };
  }
  if (task.starts_on) return { start: task.starts_on, end: task.starts_on };
  if (task.due_on) return { start: task.due_on, end: task.due_on };
  return null;
}

export function monthAnchor(year: number, monthIndex: number): Date {
  return new Date(Date.UTC(year, monthIndex, 1));
}

export function shiftMonth(anchor: Date, delta: number): Date {
  return new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + delta, 1));
}

export function buildMonthGrid(anchor: Date, tasks: Task[]): CalendarDay[] {
  const year = anchor.getUTCFullYear();
  const month = anchor.getUTCMonth();
  const first = new Date(Date.UTC(year, month, 1));
  const weekday = (first.getUTCDay() + 6) % 7;
  const gridStart = new Date(Date.UTC(year, month, 1 - weekday));

  const dated = tasks
    .map((task) => ({ task, span: taskScheduleSpan(task) }))
    .filter((row): row is { task: Task; span: { start: string; end: string } } => row.span != null);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setUTCDate(gridStart.getUTCDate() + i);
    const key = formatDay(date);
    days.push({
      date: key,
      inMonth: date.getUTCMonth() == month,
      tasks: dated
        .filter(({ span }) => span.start <= key && key <= span.end)
        .map(({ task }) => task),
    });
  }
  return days;
}

export function weekdayLabels(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(2024, 0, 1 + i));
    return formatter.format(d);
  });
}

export function monthTitle(anchor: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(anchor);
}

export { formatDay, parseDay };
