import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect } from 'react';
import { applyPaletteToColors } from '@/constants/theme';

export type ThemeMode = 'light' | 'dark';

type Palette = {
  background: { primary: string; secondary: string; tertiary: string };
  text: { primary: string; secondary: string; inverse: string; muted: string };
  border: { default: string; light: string };
  primary: { 500: string; 600: string };
  success: { 500: string };
};

const light: Palette = {
  background: { primary: '#FFFFFF', secondary: '#F8FAFC', tertiary: '#F1F5F9' },
  text: { primary: '#0F172A', secondary: '#334155', inverse: '#FFFFFF', muted: '#94A3B8' },
  border: { default: '#E2E8F0', light: '#F1F5F9' },
  // Green primary
  primary: { 500: '#10B981', 600: '#059669' },
  success: { 500: '#22C55E' },
};

const dark: Palette = {
  background: { primary: '#0B1220', secondary: '#0F172A', tertiary: '#111827' },
  text: { primary: '#E5E7EB', secondary: '#CBD5E1', inverse: '#0B1220', muted: '#94A3B8' },
  border: { default: '#1F2937', light: '#111827' },
  // Green primary
  primary: { 500: '#10B981', 600: '#059669' },
  success: { 500: '#22C55E' },
};

type ThemeContextValue = {
  mode: ThemeMode;
  palette: Palette;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({ mode: 'light', palette: light, toggle: () => {}, setMode: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const palette = useMemo(() => (mode === 'dark' ? dark : light), [mode]);

  useEffect(() => {
    applyPaletteToColors(palette);
  }, [palette]);
  const value = useMemo(() => ({ mode, palette, toggle: () => setMode(mode === 'dark' ? 'light' : 'dark'), setMode }), [mode, palette]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
