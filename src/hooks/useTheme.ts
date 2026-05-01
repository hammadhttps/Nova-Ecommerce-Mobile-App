import { useThemeStore } from '@/store/theme.store';

export const useTheme = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeStore();

  return {
    theme,
    isDark: resolvedTheme === 'dark',
    setTheme,
    toggleTheme,
  };
};
