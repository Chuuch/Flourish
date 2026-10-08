import { expect, test } from '@playwright/test';
import { portalLogin } from './helpers/auth';

test('portal user can submit a ticket', async ({ page }) => {
  const title = `E2E ticket ${Date.now()}`;

  await portalLogin(page);
  await page.getByRole('button', { name: 'Submit ticket' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Kind').click();
  await page.getByRole('option', { name: 'Bug' }).click();
  await dialog.getByLabel('Title').fill(title);
  await dialog.getByLabel('Body').fill('Submitted by Playwright smoke.');
  await dialog.getByRole('button', { name: 'Submit ticket' }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: new RegExp(title) })).toBeVisible();
});
