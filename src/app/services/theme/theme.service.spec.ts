import { TestBed } from '@angular/core/testing';
import { DEFAULT_THEME_COLORS, ThemeService, isHexColor } from './theme.service';

const STORAGE_KEY = 'hytThemeColors';

describe('isHexColor', () => {
  it.each(['#abc', '#ABC', '#0956b6', '#0956B6'])('accepts %s', (value) => {
    expect(isHexColor(value)).toBe(true);
  });

  it.each(['red', '#12345', '#1234567', '0956b6', '#0956b6;color:red', '', null, 42])('rejects %s', (value) => {
    expect(isHexColor(value)).toBe(false);
  });
});

describe('ThemeService', () => {
  let service: ThemeService;
  let rootStyle: CSSStyleDeclaration;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('style');
    rootStyle = document.documentElement.style;
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('starts with the default colors', () => {
    expect(service.colors()).toEqual(DEFAULT_THEME_COLORS);
    expect(service.hasCustomColors()).toBe(false);
    expect(rootStyle.getPropertyValue('--hyt-brand-primary')).toBe('');
  });

  it('writes the custom colors on the root element and saves them', () => {
    service.setColors({ primary: '#C62828', secondary: '#00897b' });

    expect(rootStyle.getPropertyValue('--hyt-brand-primary')).toBe('#c62828');
    expect(rootStyle.getPropertyValue('--hyt-brand-secondary')).toBe('#00897b');
    expect(service.colors()).toEqual({ primary: '#c62828', secondary: '#00897b' });
    expect(service.hasCustomColors()).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'))
      .toEqual({ primary: '#c62828', secondary: '#00897b' });
  });

  it('uses the default colors when a color is not valid', () => {
    service.setColors({ primary: '#c62828', secondary: '#00897b' });

    service.setColors({ primary: 'red', secondary: '#00897b' });

    expect(service.hasCustomColors()).toBe(false);
    expect(rootStyle.getPropertyValue('--hyt-brand-primary')).toBe('');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('removes the variables and the saved colors on reset', () => {
    service.setColors({ primary: '#c62828', secondary: '#00897b' });

    service.reset();

    expect(rootStyle.getPropertyValue('--hyt-brand-primary')).toBe('');
    expect(rootStyle.getPropertyValue('--hyt-brand-secondary')).toBe('');
    expect(service.colors()).toEqual(DEFAULT_THEME_COLORS);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('restores the colors saved by the last session', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ primary: '#c62828', secondary: '#00897b' }));

    service.restoreSavedColors();

    expect(rootStyle.getPropertyValue('--hyt-brand-primary')).toBe('#c62828');
    expect(service.hasCustomColors()).toBe(true);
  });

  it.each([
    ['not JSON', 'not json'],
    ['a JSON null', 'null'],
    ['invalid colors', JSON.stringify({ primary: 'red', secondary: '#00897b' })],
  ])('ignores saved colors that are %s', (_description, saved) => {
    localStorage.setItem(STORAGE_KEY, saved);

    service.restoreSavedColors();

    expect(service.hasCustomColors()).toBe(false);
    expect(rootStyle.getPropertyValue('--hyt-brand-primary')).toBe('');
  });
});
