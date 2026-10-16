// Small UI state kept in the query string, so it can be shared as a link (?caso=doose).

const CHANGE = 'portfolio:url-change';

export function readSearchParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

/** Set (or remove, with null) a query parameter without reloading or adding a history entry. */
export function writeSearchParam(name: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value) url.searchParams.set(name, value);
  else url.searchParams.delete(name);
  window.history.replaceState(null, '', url);
  window.dispatchEvent(new Event(CHANGE));
}

/** Call `listener` whenever the query string changes (our writes, back/forward). */
export function subscribeToSearchParams(listener: () => void) {
  window.addEventListener(CHANGE, listener);
  window.addEventListener('popstate', listener);
  return () => {
    window.removeEventListener(CHANGE, listener);
    window.removeEventListener('popstate', listener);
  };
}
