import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { es } from '@/content/i18n/es';
import { en } from '@/content/i18n/en';
import { LanguageHint } from './LanguageHint';

const browserLanguages = (languages: string[]) =>
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages);
const onSpanishPage = () => render(<LanguageHint lang="es" copy={{ en: en.languageHint }} />);

describe('LanguageHint', () => {
  it('suggests English, in English, to an English-speaking visitor of the Spanish page', () => {
    browserLanguages(['en-US', 'en']);
    onSpanishPage();
    const hint = screen.getByRole('complementary', { name: en.languageHint.message });
    expect(hint.getAttribute('lang')).toBe('en');
    const link = screen.getByRole('link', { name: `${en.languageHint.action} →` });
    expect(link.getAttribute('href')).toMatch(/^\/en\/?$/);
  });

  it('stays hidden when the page is already in the visitor’s language', () => {
    browserLanguages(['es-CO']);
    onSpanishPage();
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('stays hidden for languages the site does not have', () => {
    browserLanguages(['fr-FR']);
    onSpanishPage();
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('remembers a dismissal', () => {
    browserLanguages(['en-US']);
    onSpanishPage();
    fireEvent.click(screen.getByRole('button', { name: en.languageHint.dismiss }));
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(localStorage.getItem('preferred-lang')).toBe('es');
  });

  it('remembers following the suggestion', () => {
    browserLanguages(['en-US']);
    onSpanishPage();
    fireEvent.click(screen.getByRole('link'));
    expect(localStorage.getItem('preferred-lang')).toBe('en');
  });

  it('suggests Spanish on the English page', () => {
    browserLanguages(['es-MX']);
    render(<LanguageHint lang="en" copy={{ es: es.languageHint }} />);
    expect(screen.getByRole('link', { name: `${es.languageHint.action} →` }).getAttribute('href')).toBe('/');
  });
});
