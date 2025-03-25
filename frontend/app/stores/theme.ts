import { Store } from '@tanstack/react-store';

type ThemeState = {
  theme: string;
  resolvedTheme: string | undefined;
  forcedTheme: string | undefined;
  systemTheme: 'light' | 'dark' | undefined;
};

const themeStore = new Store<ThemeState>({
  theme: 'light',
  resolvedTheme: undefined,
  forcedTheme: undefined,
  systemTheme: undefined,
});

const themeActions = {
  setTheme: (theme: string) => {
    themeStore.setState((state) => {
      try {
        localStorage.setItem('theme', theme);
      } catch {
        // Ignore localStorage errors
      }
      return {
        ...state,
        theme,
      };
    });
  },

  setResolvedTheme: (resolvedTheme: string) => {
    themeStore.setState((state) => ({
      ...state,
      resolvedTheme,
    }));
  },

  setForcedTheme: (forcedTheme: string | undefined) => {
    themeStore.setState((state) => ({
      ...state,
      forcedTheme,
    }));
  },

  setSystemTheme: (systemTheme: 'light' | 'dark' | undefined) => {
    themeStore.setState((state) => ({
      ...state,
      systemTheme,
    }));
  },
};

export { themeStore, themeActions };
