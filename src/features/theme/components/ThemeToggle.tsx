import { Button } from '@/components/ui';
import { useThemeStore } from '../store/theme.store';
import { useI18n } from '@/features/i18n';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { t } = useI18n();
  const isDark = theme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full justify-start px-2.5"
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
      {isDark ? t('theme.useLight') : t('theme.useDark')}
    </Button>
  );
}
