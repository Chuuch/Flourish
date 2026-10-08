import { expect, type Page } from '@playwright/test';

export function staffCredentials() {
  return {
    email: process.env.E2E_EMAIL ?? 'admin@zyntera.seed',
    password: process.env.E2E_PASSWORD ?? 'password12',
  };
}

export function portalCredentials() {
  return {
    email: process.env.E2E_PORTAL_EMAIL ?? 'portal@northwind.seed',
    password: process.env.E2E_PORTAL_PASSWORD ?? process.env.E2E_PASSWORD ?? 'password12',
  };
}

export async function staffLogin(page: Page) {
  const { email, password } = staffCredentials();

  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('link', { name: 'Clients' })).toBeVisible();
}

export async function portalLogin(page: Page) {
  const { email, password } = portalCredentials();

  await page.goto('/portal/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('button', { name: 'Submit ticket' })).toBeVisible();
}
