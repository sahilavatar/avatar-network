/**
 * Per-tutor accent theming.
 *
 * Every `accent-*` Tailwind utility resolves to a `--accent-{shade}` CSS variable
 * (see index.css). Switching tutors rewrites those variables on <html>, so the
 * whole tutor experience re-tints without touching component markup.
 */

export const ACCENT_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type AccentShade = (typeof ACCENT_SHADES)[number];
export type AccentPalette = Record<AccentShade, string>;

// Hand-tuned palettes for the built-in tutors. Emerald and amber shift their
// 600/700 steps one notch darker so white button text and accent text on light
// backgrounds stay above WCAG AA (4.5:1).
const CURATED_PALETTES: Record<string, AccentPalette> = {
  // Indigo — brand fallback
  '#6366f1': {
    50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1',
    600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b'
  },
  // Blue — Algebra
  '#3b82f6': {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6',
    600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554'
  },
  // Emerald — Biology
  '#10b981': {
    50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981',
    600: '#047857', 700: '#065f46', 800: '#064e3b', 900: '#053d2f', 950: '#022c22'
  },
  // Amber — History
  '#f59e0b': {
    50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b',
    600: '#b45309', 700: '#92400e', 800: '#78350f', 900: '#62300d', 950: '#451a03'
  },
  // Violet — Chemistry
  '#8b5cf6': {
    50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6',
    600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065'
  }
};

export const DEFAULT_ACCENT = '#6366f1';

type Rgb = [number, number, number];

const parseHex = (hex: string): Rgb | null => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
};

const toHex = (rgb: Rgb): string =>
  '#' + rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('');

const mix = (a: Rgb, b: Rgb, amountOfB: number): Rgb =>
  a.map((c, i) => c + (b[i] - c) * amountOfB) as Rgb;

const luminance = (rgb: Rgb): number => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastWithWhite = (rgb: Rgb): number => 1.05 / (luminance(rgb) + 0.05);

const WHITE: Rgb = [255, 255, 255];
const BLACK: Rgb = [0, 0, 0];

/**
 * Builds an 11-step scale from any hex color (used for custom avatars).
 * Light steps tint toward white; dark steps shade toward black, starting from
 * the lightest shade of 600 that still passes AA against white text.
 */
const generatePalette = (base: Rgb): AccentPalette => {
  let darken600 = 0.12;
  while (darken600 < 0.7 && contrastWithWhite(mix(base, BLACK, darken600)) < 4.5) {
    darken600 += 0.04;
  }
  const shade = (extra: number) => toHex(mix(base, BLACK, Math.min(0.85, darken600 + extra)));

  return {
    50: toHex(mix(base, WHITE, 0.92)),
    100: toHex(mix(base, WHITE, 0.84)),
    200: toHex(mix(base, WHITE, 0.7)),
    300: toHex(mix(base, WHITE, 0.5)),
    400: toHex(mix(base, WHITE, 0.25)),
    500: toHex(base),
    600: shade(0),
    700: shade(0.14),
    800: shade(0.28),
    900: shade(0.4),
    950: shade(0.56)
  };
};

export const getAccentPalette = (accentColor?: string): AccentPalette => {
  const key = (accentColor || DEFAULT_ACCENT).trim().toLowerCase();
  if (CURATED_PALETTES[key]) return CURATED_PALETTES[key];
  const rgb = parseHex(key);
  return rgb ? generatePalette(rgb) : CURATED_PALETTES[DEFAULT_ACCENT];
};

export const applyAccentTheme = (accentColor?: string, root: HTMLElement = document.documentElement) => {
  const palette = getAccentPalette(accentColor);
  for (const shade of ACCENT_SHADES) {
    root.style.setProperty(`--accent-${shade}`, palette[shade]);
  }
};
