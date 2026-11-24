/**
 * Contrast ratio on a white background below which a theme color gets a warning. Material uses
 * the brand colors also for text, icons and outlines on light surfaces (text buttons, tabs,
 * checkboxes, focused fields). The WCAG minimums are 4.5:1 for text and 3:1 for icons and
 * outlines; 2.5:1 is a deliberate compromise (product decision), so that only the colors that
 * are really hard to read get a warning.
 */
export const MIN_CONTRAST_ON_WHITE = 2.5;

const WHITE: Rgb = [255, 255, 255];

type Rgb = [number, number, number];

/** Parses a CSS hex color (#rgb or #rrggbb). */
function parseHex(hex: string): Rgb {
  const digits = hex.replace('#', '');
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

function toHex(rgb: Rgb): string {
  return '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

/** Relative luminance as defined by WCAG. */
function luminance([r, g, b]: Rgb): number {
  const linear = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function ratio(a: Rgb, b: Rgb): number {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG contrast ratio of a hex color on white, from 1 to 21. */
export function contrastOnWhite(hex: string): number {
  return ratio(parseHex(hex), WHITE);
}

/**
 * Darker version of a hex color that reaches the given contrast on white: the color is mixed
 * with black (as `color-mix(in srgb, color, black)`), which keeps its hue, only as much as
 * needed. Returns the color itself when it already has enough contrast.
 */
export function darkenForWhite(hex: string, minRatio = MIN_CONTRAST_ON_WHITE): string {
  const rgb = parseHex(hex);
  for (let black = 0; black <= 100; black++) {
    const mixed = rgb.map((v) => (v * (100 - black)) / 100) as Rgb;
    if (ratio(mixed, WHITE) >= minRatio) {
      return toHex(mixed);
    }
  }
  return '#000000';
}
