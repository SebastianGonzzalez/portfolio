import { afterEach, describe, expect, it, vi } from 'vitest';
import { preferredLanguage, rememberLanguage, subscribeToLanguagePreference } from './language-preference';
import { readSearchParam, subscribeToSearchParams, writeSearchParam } from './url-state';

const LANGS = ['es', 'en'] as const;
const browserLanguages = (languages: string[]) =>
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages);

describe('url state', () => {
  it('writes and removes a parameter without adding history entries', () => {
    const length = window.history.length;
    writeSearchParam('caso', 'doose');
    expect(window.location.search).toBe('?caso=doose');
    expect(readSearchParam('caso')).toBe('doose');
    writeSearchParam('caso', null);
    expect(window.location.search).toBe('');
    expect(window.history).toHaveLength(length);
  });

  it('notifies subscribers on writes and on back/forward', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToSearchParams(listener);
    writeSearchParam('caso', 'doose');
    window.dispatchEvent(new PopStateEvent('popstate'));
    unsubscribe();
    writeSearchParam('caso', null);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

describe('language preference', () => {
  afterEach(() => localStorage.clear());

  it('follows the browser when no choice was made', () => {
    browserLanguages(['de-DE', 'en-GB', 'es']);
    expect(preferredLanguage(LANGS)).toBe('en');
    browserLanguages(['fr', 'de']);
    expect(preferredLanguage(LANGS)).toBeNull();
  });

  it('prefers an explicit choice over the browser, and tells subscribers', () => {
    browserLanguages(['en-US']);
    const listener = vi.fn();
    const unsubscribe = subscribeToLanguagePreference(listener);
    rememberLanguage('es');
    unsubscribe();
    expect(preferredLanguage(LANGS)).toBe('es');
    expect(listener).toHaveBeenCalledOnce();
  });

  it('ignores stored values it does not support', () => {
    browserLanguages(['es-CO']);
    localStorage.setItem('preferred-lang', 'xx');
    expect(preferredLanguage(LANGS)).toBe('es');
  });

  it('keeps working when storage is blocked', () => {
    browserLanguages(['en']);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => rememberLanguage('es')).not.toThrow();
    expect(preferredLanguage(LANGS)).toBe('en');
  });
});
