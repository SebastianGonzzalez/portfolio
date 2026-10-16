'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';

const noSubscription = () => () => {};

/** False during server rendering and hydration, true afterwards. For output that depends on the visitor's clock or timezone. */
export const useIsClient = () =>
  useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** The visitor's local time ("10:30"), refreshed every 15 s. Empty until hydrated. */
export function useLocalTime() {
  const isClient = useIsClient();
  const [time, setTime] = useState(formatTime);
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 15000);
    return () => clearInterval(id);
  }, []);
  return isClient ? time : '';
}
