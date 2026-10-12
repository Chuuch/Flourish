import { useI18n } from '@/features/i18n';
import type { Task } from '../schemas/task.schema';
import { useMemo, useState } from 'react';
import {
  buildMonthGrid,
  monthAnchor,
  monthTitle,
  shiftMonth,
  weekdayLabels,
} from '../lib/calendarMonth';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Link } from 'react-router';
import { taskPath } from '@/app/router/paths';

type ProjectMonthCalendarProps = {
  clientId: string;
  projectId: string;
  tasks: Task[];
};

export function ProjectMonthCalendar({ clientId, projectId, tasks }: ProjectMonthCalendarProps) {
  const { t, locale } = useI18n();
  const now = new Date();
  const [anchor, setAnchor] = useState(() => monthAnchor(now.getFullYear(), now.getMonth()));

  const labels = useMemo(() => weekdayLabels(locale), [locale]);
  const days = useMemo(() => buildMonthGrid(anchor, tasks), [anchor, tasks]);
  const title = monthTitle(anchor, locale);

  return (
    <section className="project-month-calendar" aria-label={t('tasks.calendarTitle')}>
      <div className="project-month-calendar__header">
        <h2 className="project-month-calendar__title">{title}</h2>
        <div className="project-month-calendar__nav">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setAnchor((current) => shiftMonth(current, -1));
            }}
          >
            {t('tasks.calendarPrev')}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setAnchor(monthAnchor(now.getFullYear(), now.getMonth()));
            }}
          >
            {t('tasks.calendarToday')}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setAnchor((current) => shiftMonth(current, 1));
            }}
          >
            {t('tasks.calendarNext')}
          </Button>
        </div>
      </div>

      <div className="project-month-calendar__weekdays" aria-hidden="true">
        {labels.map((label) => (
          <span key={label} className="project-month-calendar__weekday">
            {label}
          </span>
        ))}
      </div>

      <ol className="project-month-calendar__grid">
        {days.map((day) => (
          <li
            key={day.date}
            className={cn(
              'project-month-calendar__day',
              !day.inMonth && 'project-month-calendar__day--outside',
            )}
          >
            <span className="project-mont-calendar__day-num">{Number(day.date.slice(8))}</span>
            <ul className="project-mont-calendar__events">
              {day.tasks.map((task) => (
                <li key={task.id}>
                  <Link
                    className="project-month-calendar__event"
                    to={taskPath(clientId, projectId, task.id)}
                  >
                    {task.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
