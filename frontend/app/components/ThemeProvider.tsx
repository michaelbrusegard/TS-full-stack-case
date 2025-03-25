import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  memo,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';

import { script } from '@/lib/theme-script';

type ValueObject = Record<string, string>;

export interface UseThemeProps {
  /** List of all available theme names */
  themes: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Update the theme */
  setTheme: Dispatch<SetStateAction<string>>;
  /** Active theme name */
  theme?: string | undefined;
  /** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
  resolvedTheme?: string | undefined;
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: 'dark' | 'light' | undefined;
}

export type Attribute = `data-${string}` | 'class';

export interface ThemeProviderProps extends PropsWithChildren {
  /** List of all available theme names */
  themes?: string[] | undefined;
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean | undefined;
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean | undefined;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean | undefined;
  /** Key used to store theme setting in localStorage */
  storageKey?: string | undefined;
  /** Default theme name (for v0.0.12 and lower the default was light). If `enableSystem` is false, the default theme is light */
  defaultTheme?: string | undefined;
  /** HTML attribute modified based on the active theme. Accepts `class`, `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.), or an array which could include both */
  attribute?: Attribute | Attribute[] | undefined;
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ValueObject | undefined;
  /** Nonce string to pass to the inline script for CSP headers */
  nonce?: string | undefined;
}

const colorSchemes = ['light', 'dark'];
const MEDIA = '(prefers-color-scheme: dark)';
const isServer = typeof window === 'undefined';
const ThemeContext = createContext<UseThemeProps | undefined>(undefined);
const defaultContext: UseThemeProps = {
  setTheme: (_: string) => undefined,
  themes: [],
};

export const useTheme = () => use(ThemeContext) ?? defaultContext;

export const ThemeProvider = (props: ThemeProviderProps): JSX.Element => {
  const context = use(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return <>{props.children}</>;
  return <Theme {...props} />;
};

const defaultThemes = ['light', 'dark'];

const Theme = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  themes = defaultThemes,
  defaultTheme = enableSystem ? 'system' : 'light',
  attribute = 'data-theme',
  value,
  children,
  nonce,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState(() =>
    getTheme(storageKey, defaultTheme),
  );
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    getTheme(storageKey),
  );
  const attrs = !value ? themes : Object.values(value);

  const applyTheme = useCallback(
    (theme: string | undefined) => {
      let resolved = theme;
      if (!resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === 'system' && enableSystem) {
        resolved = getSystemTheme();
      }

      const name = value ? value[resolved] : resolved;
      const enable = disableTransitionOnChange ? disableAnimation() : null;
      const d = document.documentElement;

      const handleAttribute = (attr: Attribute) => {
        if (attr === 'class') {
          d.classList.remove(...attrs);
          if (name) d.classList.add(name);
        } else if (attr.startsWith('data-')) {
          if (name) {
            d.setAttribute(attr, name);
          } else {
            d.removeAttribute(attr);
          }
        }
      };

      if (Array.isArray(attribute)) attribute.forEach(handleAttribute);
      else handleAttribute(attribute);

      if (enableColorScheme) {
        const fallback = colorSchemes.includes(defaultTheme)
          ? defaultTheme
          : null;
        const colorScheme = colorSchemes.includes(resolved)
          ? resolved
          : fallback;
        // @ts-expect-error colorScheme is valid CSS property
        d.style.colorScheme = colorScheme;
      }

      enable?.();
    },
    [
      attribute,
      attrs,
      defaultTheme,
      disableTransitionOnChange,
      enableColorScheme,
      enableSystem,
      value,
    ],
  );

  const setTheme = useCallback(
    (theme: string | ((prev: string) => string)) => {
      const newTheme = typeof theme === 'function' ? theme(theme) : theme;
      setThemeState(newTheme);

      // Save to storage
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // Unsupported
      }
    },
    [storageKey],
  );

  const [_unused, startTransition] = useTransition();

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      requestAnimationFrame(() => {
        setResolvedTheme(resolved);
      });

      if (theme === 'system' && enableSystem && !forcedTheme) {
        applyTheme('system');
      }
    },
    [theme, forcedTheme, enableSystem, applyTheme],
  );

  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      const theme = e.newValue ?? defaultTheme;
      setTheme(theme);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setTheme, storageKey, defaultTheme]);

  // Whenever theme or forcedTheme changes, apply it
  useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [forcedTheme, theme, applyTheme]);

  const providerValue = useMemo(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: theme === 'system' ? resolvedTheme : theme,
      themes: enableSystem ? [...themes, 'system'] : themes,
      systemTheme: (enableSystem ? resolvedTheme : undefined) as
        | 'light'
        | 'dark'
        | undefined,
    }),
    [theme, setTheme, forcedTheme, resolvedTheme, enableSystem, themes],
  );

  return (
    <ThemeContext value={providerValue}>
      <ThemeScript
        {...{
          forcedTheme,
          storageKey,
          attribute,
          enableSystem,
          enableColorScheme,
          defaultTheme,
          value,
          themes,
          nonce,
        }}
      />
      {children}
    </ThemeContext>
  );
};

const ThemeScript = memo(
  ({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    themes,
    nonce,
  }: Omit<ThemeProviderProps, 'children'> & { defaultTheme: string }) => {
    const scriptArgs = JSON.stringify([
      attribute,
      storageKey,
      defaultTheme,
      forcedTheme,
      themes,
      value,
      enableSystem,
      enableColorScheme,
    ]).slice(1, -1);

    return (
      <script
        suppressHydrationWarning
        nonce={typeof window === 'undefined' ? nonce : ''}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for theme initialization
        dangerouslySetInnerHTML={{
          __html: `(${script.toString()})(${scriptArgs})`,
        }}
      />
    );
  },
);

// Helpers
const getTheme = (key: string, fallback?: string) => {
  if (isServer) return undefined;
  let theme: string | undefined;
  try {
    theme = localStorage.getItem(key) ?? undefined;
  } catch {
    // Unsupported
  }
  return theme ?? fallback;
};

const disableAnimation = () => {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}',
    ),
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  const event = e ?? window.matchMedia(MEDIA);
  const isDark = event.matches;
  const systemTheme = isDark ? 'dark' : 'light';
  return systemTheme;
};
