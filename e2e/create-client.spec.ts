import { expect, test } from '@playwright/test';
import { staffLogin } from './helpers/auth';

test('staff can create a client', async ({ page }) => {
  const name = `E2E Client ${Date.now()}`;

  await staffLogin(page);
  await page.getByRole('link', { name: 'Clients' }).click();
  await page.getByRole('button', { name: 'Add client' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill(name);
  await dialog.getByLabel('Notes').fill('Created by Playwright smoke');
  await dialog.getByRole('button', { name: 'Add client' }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByRole('main').getByRole('link', { name })).toBeVisible();
});
