'use client';
import { useSyncExternalStore } from 'react';
import { preferredLanguage, subscribeToLanguagePreference } from '@/lib/language-preference';
import { readSearchParam, subscribeToSearchParams } from '@/lib/url-state';

/** A query-string parameter, kept in sync with the URL. Null on the server and before hydration. */
export function useSearchParam(name: string) {
  return useSyncExternalStore(
    subscribeToSearchParams,
    () => readSearchParam(name),
    () => null,
  );
}

/** The language the visitor seems to prefer among `supported`. Null on the server and before hydration. */
export function usePreferredLanguage<L extends string>(supported: readonly L[]) {
  return useSyncExternalStore(
    subscribeToLanguagePreference,
    () => preferredLanguage(supported),
    () => null,
  );
}
