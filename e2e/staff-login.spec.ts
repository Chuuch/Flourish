import { expect, test } from '@playwright/test';
import { staffLogin } from './helpers/auth';

test('staff can sign in and see Clients nav', async ({ page }) => {
  await staffLogin(page);
  await expect(page.getByRole('link', { name: 'Clients' })).toBeVisible();
  await page.getByRole('link', { name: 'Clients' }).click();
  await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible();
});
