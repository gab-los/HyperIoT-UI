import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

/**
 * Colors of the HyperIoT theme that the user can choose, as CSS hex colors. Only the primary
 * color: the secondary one is derived from it in the stylesheet.
 */
export interface ThemeColors {
  primary: string;
}

/** Default HyperIoT colors. They must match the defaults in src/assets/styles/theme/_brand.scss. */
export const DEFAULT_THEME_COLORS: Readonly<ThemeColors> = {
  primary: '#0956b6',
};

/** CSS variable of the theme written for the primary color (see _brand.scss). */
const PRIMARY_VARIABLE = '--hyt-brand-primary';

/** localStorage key of the colors of the last session in this browser. */
const STORAGE_KEY = 'hytThemeColors';

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Whether the value is a CSS hex color (#rgb or #rrggbb), the only format the theme accepts. */
export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR.test(value);
}

/**
 * Applies the colors chosen by the user to the theme at runtime.
 *
 * It writes only the --hyt-brand-primary variable on the root element: the theme derives every
 * other color from it (see src/assets/styles/theme/_brand.scss). Without custom colors the
 * variable is removed, so the default of the stylesheet applies.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  /** Colors chosen by the user; null when the default colors are used. */
  private readonly customColors = signal<ThemeColors | null>(null);

  /** Colors in use. */
  readonly colors = computed(() => this.customColors() ?? DEFAULT_THEME_COLORS);

  /** Whether the user has chosen custom colors. */
  readonly hasCustomColors = computed(() => this.customColors() !== null);

  /**
   * Applies the colors of the last session in this browser. Called before the first render,
   * so the page does not show the default colors while the branding is being loaded.
   */
  restoreSavedColors(): void {
    const saved = this.readSavedColors();
    if (saved) {
      this.setColors(saved);
    }
  }

  /**
   * Applies the given colors, or the default ones with null, and saves them in this browser.
   * Colors that are not hex colors are ignored, so nothing else reaches the stylesheet.
   */
  setColors(colors: ThemeColors | null): void {
    const valid = colors && isHexColor(colors.primary) ? { primary: colors.primary.toLowerCase() } : null;
    this.customColors.set(valid);
    const style = this.document.documentElement.style;
    if (valid) {
      style.setProperty(PRIMARY_VARIABLE, valid.primary);
    } else {
      style.removeProperty(PRIMARY_VARIABLE);
    }
    this.saveColors(valid);
  }

  /** Goes back to the default colors, for example at logout. */
  reset(): void {
    this.setColors(null);
  }

  private readSavedColors(): ThemeColors | null {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (typeof saved !== 'object' || saved === null) {
        return null;
      }
      const { primary } = saved as Record<string, unknown>;
      return isHexColor(primary) ? { primary } : null;
    } catch {
      return null;
    }
  }

  private saveColors(colors: ThemeColors | null): void {
    try {
      if (colors) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage not available (private mode, blocked site data): the colors are only applied.
    }
  }
}
