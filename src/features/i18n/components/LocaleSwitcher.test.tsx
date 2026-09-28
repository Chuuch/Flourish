import { renderWithProviders } from '@/test/render';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LOCALE_STORAGE_KEY } from '../lib/i18n';
import { LocaleSwitcher } from './LocaleSwitcher';

describe('LocaleSwitcher', () => {
  it('switches from English to Bulgarian', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LocaleSwitcher />);

    await user.selectOptions(screen.getByLabelText('Language'), 'bg');

    expect(screen.getByLabelText('Език')).toHaveValue('bg');
    expect(document.documentElement.lang).toBe('bg');
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('bg');
  });
});
