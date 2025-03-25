import { useStore } from '@tanstack/react-store';
import { memo, useCallback, useEffect, useTransition } from 'react';

import { script } from '@/lib/theme-script';

import { themeActions, themeStore } from '@/stores/theme';

export type Attribute = `data-${string}` | 'class';

export interface ThemeProviderProps extends React.PropsWithChildren {
  themes?: string[];
  forcedTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  storageKey?: string;
  defaultTheme?: string;
  attribute?: Attribute | Attribute[];
  value?: Record<string, string>;
  nonce?: string;
}

const colorSchemes = ['light', 'dark'] as const;
const MEDIA = '(prefers-color-scheme: dark)';
const defaultThemes = ['light', 'dark'];

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
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
}) => {
  const theme = useStore(themeStore, (state) => state.theme);
  const attrs = !value ? themes : Object.values(value);

  const applyTheme = useCallback(
    (theme: string | undefined) => {
      if (!theme) return;

      let resolved = theme;
      if (theme === 'system' && enableSystem) {
        resolved = getSystemTheme();
      }

      const name = value?.[resolved] ?? resolved;
      const enable = disableTransitionOnChange ? disableAnimation() : null;
      const d = document.documentElement;

      const handleAttribute = (attr: Attribute) => {
        if (attr === 'class') {
          d.classList.remove(...attrs);
          if (name) d.classList.add(name);
        } else {
          if (name) {
            d.setAttribute(attr, name);
          } else {
            d.removeAttribute(attr);
          }
        }
      };

      if (Array.isArray(attribute)) {
        attribute.forEach(handleAttribute);
      } else {
        handleAttribute(attribute);
      }

      if (enableColorScheme) {
        const fallback = colorSchemes.includes(defaultTheme as 'light' | 'dark')
          ? defaultTheme
          : null;
        const colorScheme = colorSchemes.includes(resolved as 'light' | 'dark')
          ? resolved
          : fallback;
        d.style.colorScheme = colorScheme ?? '';
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

  const [_, startTransition] = useTransition();

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      startTransition(() => {
        themeActions.setResolvedTheme(resolved);
      });

      if (theme === 'system' && enableSystem && !forcedTheme) {
        applyTheme('system');
      }
    },
    [theme, forcedTheme, enableSystem, applyTheme],
  );

  useEffect(() => {
    const media = window.matchMedia(MEDIA);
    media.addEventListener('change', handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeEventListener('change', handleMediaQuery);
  }, [handleMediaQuery]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      const theme = e.newValue ?? defaultTheme;
      themeActions.setTheme(theme);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [forcedTheme, theme, applyTheme]);

  return (
    <>
      <ThemeScript
        forcedTheme={forcedTheme}
        storageKey={storageKey}
        attribute={attribute}
        enableSystem={enableSystem}
        enableColorScheme={enableColorScheme}
        defaultTheme={defaultTheme}
        value={value}
        themes={themes}
        nonce={nonce}
      />
      {children}
    </>
  );
};

const ThemeScript = memo<
  Omit<ThemeProviderProps, 'children'> & { defaultTheme: string }
>(
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
  }) => {
    const scriptArgs = JSON.stringify({
      attribute,
      storageKey,
      defaultTheme,
      forcedTheme,
      themes,
      value,
      enableSystem,
      enableColorScheme,
    });

    return (
      <script
        nonce={typeof window === 'undefined' ? nonce : undefined}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `(${script.toString()})(${scriptArgs.slice(1, -1)})`,
        }}
      />
    );
  },
);

ThemeScript.displayName = 'ThemeScript';

const getSystemTheme = (
  e?: MediaQueryList | MediaQueryListEvent,
): 'dark' | 'light' => {
  const event = e ?? window.matchMedia(MEDIA);
  return event.matches ? 'dark' : 'light';
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
    window.getComputedStyle(document.body);
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};
