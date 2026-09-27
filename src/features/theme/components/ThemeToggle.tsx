import { Button } from '@/components/ui';
import { useThemeStore } from '../store/theme.store';
import { useI18n } from '@/features/i18n';

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { t } = useI18n();

  return (
    <Button type="button" aria-pressed={theme === 'dark'} onClick={toggleTheme}>
      {theme === 'dark' ? t('theme.useLight') : t('theme.useDark')}
    </Button>
  );
}
