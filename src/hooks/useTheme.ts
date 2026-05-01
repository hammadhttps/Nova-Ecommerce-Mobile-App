import { useThemeStore } from '@/store/theme.store';

export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return {
    theme,
    isDark: resolvedTheme === 'dark',
    setTheme,
    toggleTheme,
  };
};
