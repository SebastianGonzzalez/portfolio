'use client';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

interface MotionContextValue {
  /** The visitor's switch in the Lab (on by default). */
  enabled: boolean;
  toggle(): void;
  /** Live check for imperative code: switch on and no `prefers-reduced-motion`. */
  isActive(): boolean;
}

const MotionContext = createContext<MotionContextValue | null>(null);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function MotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const reducedRef = useRef<boolean | null>(null);

  const isActive = useCallback(() => {
    reducedRef.current ??= prefersReducedMotion();
    return enabledRef.current && !reducedRef.current;
  }, []);

  const toggle = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    setEnabled(enabledRef.current);
  }, []);

  const value = useMemo(() => ({ enabled, toggle, isActive }), [enabled, toggle, isActive]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error('useMotion must be used inside <MotionProvider>');
  return ctx;
}
