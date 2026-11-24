import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Logger, LoggerService, UIBrandingService } from 'core';
import { Observable, map, tap } from 'rxjs';
import { HyperiotLogoMobilePath, HyperiotLogoPath } from '../../constants';
import { ThemeColors, ThemeService, isHexColor } from '../theme/theme.service';

/** Logo shown in the top bar, in the full and in the compact (mobile) version. */
export interface BrandingLogo {
  standard: SafeResourceUrl | string;
  mobile: SafeResourceUrl | string;
}

/** Changes saved from the theme customization of the profile page. */
export interface BrandingChanges {
  colors: ThemeColors;
  /** New logo; when missing, the current logo is kept. */
  logo?: File;
}

/** Branding entity returned by the ui-branding API (only the fields used here). */
interface UiBranding {
  colorScheme?: string | null;
  logoBase64?: string | null;
}

const BRANDING_URL = '/hyperiot/ui-branding';

const DEFAULT_LOGO: BrandingLogo = {
  standard: HyperiotLogoPath,
  mobile: HyperiotLogoMobilePath,
};

/**
 * Reads a color scheme in the format of the ui-branding API, as a JSON string or as an
 * object: `{"primaryColor": "#0956b6", "secondaryColor": "#17a4fa"}`.
 * Returns null when the value is not valid.
 */
export function parseColorScheme(value: unknown): ThemeColors | null {
  let scheme: unknown = value;
  if (typeof value === 'string') {
    try {
      scheme = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (typeof scheme !== 'object' || scheme === null) {
    return null;
  }
  const { primaryColor, secondaryColor } = scheme as Record<string, unknown>;
  if (!isHexColor(primaryColor) || !isHexColor(secondaryColor)) {
    return null;
  }
  return { primary: primaryColor.toLowerCase(), secondary: secondaryColor.toLowerCase() };
}

/** Writes the colors in the format of the ui-branding API. */
export function formatColorScheme(colors: ThemeColors): string {
  return JSON.stringify({ primaryColor: colors.primary, secondaryColor: colors.secondary });
}

/**
 * Branding of the user interface (logo and colors), saved by the ui-branding API.
 * The colors are applied to the theme by ThemeService.
 */
@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  private readonly http = inject(HttpClient);
  private readonly uiBrandingService = inject(UIBrandingService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly themeService = inject(ThemeService);
  private readonly logger = new Logger(inject(LoggerService));

  /** Logo uploaded by the user; null when the HyperIoT logo is used. */
  private readonly customLogo = signal<SafeResourceUrl | null>(null);
  private readonly branded = signal(false);

  /** Logo to show. */
  readonly logo = computed<BrandingLogo>(() => {
    const logo = this.customLogo();
    return logo ? { standard: logo, mobile: logo } : DEFAULT_LOGO;
  });

  /** Whether a custom branding is saved; the first one must include a logo. */
  readonly isBranded = this.branded.asReadonly();

  constructor() {
    this.logger.registerClass('BrandingService');
  }

  /** Loads the branding after the login. Without a saved branding, the defaults are used. */
  load(): void {
    this.uiBrandingService.getUIBranding().subscribe({
      next: (branding: UiBranding) => this.apply(branding),
      error: () => this.clear(),
    });
  }

  /** Saves colors and, when given, a new logo; the branding is applied when the API answers. */
  save({ colors, logo }: BrandingChanges): Observable<void> {
    const formData = new FormData();
    formData.append('colorScheme', formatColorScheme(colors));
    if (logo) {
      formData.append('name', '');
      formData.append('logo', logo, logo.name);
      formData.append('favicon', logo, logo.name);
    }
    const request = logo
      ? this.http.put<UiBranding>(BRANDING_URL, formData)
      : this.http.patch<UiBranding>(BRANDING_URL, formData);
    return request.pipe(
      tap((branding) => this.apply(branding)),
      map(() => undefined),
    );
  }

  /** Deletes the saved branding and goes back to the HyperIoT logo and colors. */
  restoreDefaults(): Observable<void> {
    return this.http.delete(BRANDING_URL).pipe(
      tap(() => this.clear()),
      map(() => undefined),
    );
  }

  /** Forgets the branding in this browser, without calling the API (for example at logout). */
  clear(): void {
    this.customLogo.set(null);
    this.branded.set(false);
    this.themeService.reset();
  }

  private apply(branding: UiBranding): void {
    if (branding.logoBase64) {
      this.customLogo.set(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + branding.logoBase64));
    }
    this.branded.set(true);
    const colors = parseColorScheme(branding.colorScheme);
    if (!colors) {
      this.logger.warn('Invalid color scheme, the default colors are used', branding.colorScheme);
    }
    this.themeService.setColors(colors);
  }
}
