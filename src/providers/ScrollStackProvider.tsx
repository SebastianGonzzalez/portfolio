'use client';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { createSignal, type Signal } from '@/lib/signal';

/** How far the second section has slid over the hero: 0 → 1, with the previous value. */
export interface HeroCover {
  progress: number;
  previous: number;
}

interface ScrollStackChannels {
  setActive(index: number): void;
  heroCover: Signal<HeroCover>;
  /** Ask the stacked scroll to bring a section (by id) into view. Requests made before it is ready are kept. */
  scrollRequest: Signal<string>;
}

const ActiveSectionContext = createContext<number>(0);
const ChannelsContext = createContext<ScrollStackChannels | null>(null);

/**
 * Shares the stacked-scroll state: which section is in view (React state, for the header and indicator)
 * the hero's cover progress (a signal, read every frame by the hero's 3D stack) and scroll requests.
 */
export function ScrollStackProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const channels = useMemo(
    () => ({ setActive, heroCover: createSignal<HeroCover>(), scrollRequest: createSignal<string>() }),
    [],
  );
  return (
    <ChannelsContext.Provider value={channels}>
      <ActiveSectionContext.Provider value={active}>{children}</ActiveSectionContext.Provider>
    </ChannelsContext.Provider>
  );
}

export const useActiveSection = () => useContext(ActiveSectionContext);

export function useScrollStackChannels() {
  const ctx = useContext(ChannelsContext);
  if (!ctx) throw new Error('useScrollStackChannels must be used inside <ScrollStackProvider>');
  return ctx;
}
