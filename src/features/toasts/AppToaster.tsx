import { Toaster } from 'sonner';
import { useThemeStore } from '../theme';

export function AppToaster() {
  const theme = useThemeStore((state) => state.theme);
  return <Toaster theme={theme} richColors closeButton position="top-right" />;
}
