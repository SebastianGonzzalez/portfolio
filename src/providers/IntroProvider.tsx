'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createSignal, type Signal } from '@/lib/signal';

const IntroContext = createContext<Signal<void> | null>(null);

/** The preloader emits once when the page should play its entrance; the hero listens. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const reveal = useMemo(() => createSignal<void>(), []);
  return <IntroContext.Provider value={reveal}>{children}</IntroContext.Provider>;
}

export function useIntroSignal() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error('useIntroSignal must be used inside <IntroProvider>');
  return ctx;
}
