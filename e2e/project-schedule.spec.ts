import { expect, test } from '@playwright/test';
import { staffLogin } from './helpers/auth';
import { seedScheduleFixture } from './helpers/api';

test('project hub shows phases and scheduled tasks on the calendar', async ({ page, request }) => {
  const fixture = await seedScheduleFixture(request);

  await staffLogin(page);
  await page.goto(`/clients/${fixture.clientId}/projects/${fixture.projectId}`);

  await expect(page.getByRole('heading', { name: fixture.projectName })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Progress' })).toBeVisible();
  await expect(page.getByText('Kickoff', { exact: true })).toBeVisible();
  await expect(page.getByText('Discovery', { exact: true })).toBeVisible();

  const calendar = page.locator('section.project-month-calendar');
  await expect(calendar).toBeVisible();
  await expect(calendar.getByRole('link', { name: fixture.taskTitle })).toBeVisible();
});
