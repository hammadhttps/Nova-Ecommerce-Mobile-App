import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  initializeTheme: () => Promise<void>;
}

const STORAGE_KEY = 'nova-theme';

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  resolvedTheme: 'light',

  initializeTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        const theme = savedTheme as ThemeMode;
        const resolved = theme === 'system' ? 'light' : theme;
        set({ theme, resolvedTheme: resolved });
      }
    } catch (error) {
      console.error('Theme initialization error:', error);
    }
  },

  setTheme: async (theme: ThemeMode) => {
    const resolved = theme === 'system' ? 'light' : theme;
    await AsyncStorage.setItem(STORAGE_KEY, theme);
    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: async () => {
    const current = get().resolvedTheme;
    const newResolved = current === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem(STORAGE_KEY, newResolved);
    set({ theme: newResolved, resolvedTheme: newResolved });
  },
}));
