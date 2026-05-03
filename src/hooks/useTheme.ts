import { useThemeStore } from "@/store/theme.store";

interface UseThemeReturn {
  theme: "light" | "dark" | "system";
  resolvedTheme: "light" | "dark";
  setTheme: (theme: "light" | "dark" | "system") => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useTheme = (): UseThemeReturn => {
  const theme = useThemeStore((state) => state.theme) || "system";
  const resolvedTheme =
    useThemeStore((state) => state.resolvedTheme) || "light";
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return {
    theme: theme as "light" | "dark" | "system",
    resolvedTheme: resolvedTheme as "light" | "dark",
    setTheme,
    toggleTheme,
  };
};
