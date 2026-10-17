'use client';

import * as React from 'react';
import type { ThemeMode, ResolvedTheme, ThemeContextValue } from './types';

export const THEME_STORAGE_KEY = 'bramhkanti_theme';

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function applyThemeToDocument(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const isDark = resolved === 'dark';

  root.classList.toggle('dark', isDark);
  root.setAttribute('data-theme', resolved);
  root.style.colorScheme = resolved;
}

const themeListeners = new Set<() => void>();

function subscribeTheme(callback: () => void): () => void {
  themeListeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      callback();
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  return () => {
    themeListeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}

function getThemeSnapshot(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage may be unavailable
  }
  return 'system';
}

function getServerThemeSnapshot(): ThemeMode {
  return 'system';
}

function subscribeSystemTheme(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  return () => {
    mediaQuery.removeEventListener('change', callback);
  };
}

function getSystemThemeSnapshot(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getServerSystemThemeSnapshot(): ResolvedTheme {
  return 'light';
}

const emptySubscribe = () => () => {};

function getMountedSnapshot(): boolean {
  return true;
}

function getServerMountedSnapshot(): boolean {
  return false;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const theme = React.useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const systemTheme = React.useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeSnapshot,
    getServerSystemThemeSnapshot,
  );

  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    getMountedSnapshot,
    getServerMountedSnapshot,
  );

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  React.useEffect(() => {
    applyThemeToDocument(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = React.useCallback((next: ThemeMode) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignored
    }
    const resolved = next === 'system' ? getSystemThemeSnapshot() : next;
    applyThemeToDocument(resolved);
    themeListeners.forEach((listener) => listener());
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      mounted,
    }),
    [theme, resolvedTheme, setTheme, mounted],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
