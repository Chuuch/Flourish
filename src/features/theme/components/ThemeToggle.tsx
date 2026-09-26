import { Button } from '@/components/ui';
import { useThemeStore } from '../store/theme.store';

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <Button type="button" aria-pressed={theme === 'dark'} onClick={toggleTheme}>
      {theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
    </Button>
  );
}
