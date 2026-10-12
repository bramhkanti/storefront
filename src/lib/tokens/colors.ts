/**
 * Official Brand Color Tokens
 *
 * Primary Brand Palette:
 * - Primary Base: #DC2B1B (Official brand crimson-red)
 * - Primary Hover: #bb2417 (Interactive hover tone)
 * - Primary Dark: #8f1c11 (High-contrast accessible tone for text & active states, WCAG AAA compliant 8.6:1)
 * - Primary Light: #fdedec (Subtle tint for badges, tags, and surface fills)
 * - Gold: #f6ce40 (Extracted from the Devanagari calligraphy script in the logo)
 *
 * Single Source of Truth:
 * All UI components, Next.js ImageResponse (Open Graph), app icons, and error boundaries
 * consume colors exclusively from these tokens. Zero hard-coded hex codes in code.
 */

export const COLOR_TOKENS = {
  primary: {
    DEFAULT: '#DC2B1B',
    hover: '#bb2417',
    dark: '#8f1c11',
    light: '#fdedec',
  },
  heritage: {
    maroon: '#DC2B1B',
    maroonHover: '#bb2417',
    maroonDark: '#8f1c11',
    maroonLight: '#fdedec',
    saffron: '#d97706',
    saffronDark: '#78350f',
    saffronLight: '#fef3c7',
    gold: '#f6ce40',
    cream: '#fcfaf7',
    creamDark: '#f4ede4',
    border: '#e7ded3',
    charcoal: '#241814',
    muted: '#685950',
    green: '#14532d',
    greenBg: '#ecfdf5',
  },
} as const;

export type ColorTokens = typeof COLOR_TOKENS;
