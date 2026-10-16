// Which language the visitor wants: an explicit choice if they made one, otherwise their browser's.

const KEY = 'preferred-lang';
const CHANGE = 'portfolio:language-preference';

function stored(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** First supported language in the visitor's preferences, or null if none matches. */
export function preferredLanguage<L extends string>(supported: readonly L[]): L | null {
  const supportedSet = new Set<string>(supported);
  const isSupported = (tag: string | null): tag is L => tag !== null && supportedSet.has(tag);
  const choice = stored();
  if (isSupported(choice)) return choice;
  const primaries = (navigator.languages ?? [navigator.language]).map(
    (tag) => tag.toLowerCase().split('-')[0],
  );
  return primaries.find(isSupported) ?? null;
}

/** Remember an explicit choice (switching language, or dismissing the suggestion). */
export function rememberLanguage(lang: string) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // Storage blocked: the suggestion may show again on the next visit.
  }
  window.dispatchEvent(new Event(CHANGE));
}

export function subscribeToLanguagePreference(listener: () => void) {
  window.addEventListener(CHANGE, listener);
  window.addEventListener('languagechange', listener);
  return () => {
    window.removeEventListener(CHANGE, listener);
    window.removeEventListener('languagechange', listener);
  };
}
