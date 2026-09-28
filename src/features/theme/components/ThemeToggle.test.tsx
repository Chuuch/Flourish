import { renderWithProviders } from '@/test/render';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '../lib/theme';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('switches from light to dark', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Use dark theme' }));

    expect(screen.getByRole('button', { name: 'Use light theme' })).toBeInTheDocument();
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('switches from dark to light', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Use dark theme' }));
    await user.click(screen.getByRole('button', { name: 'Use light theme' }));

    expect(screen.getByRole('button', { name: 'Use dark theme' })).toBeInTheDocument();
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });
});
