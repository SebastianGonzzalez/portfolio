'use client';
import { useRef, type ComponentProps } from 'react';
import { useEnterAnimation } from '@/hooks/useEnterAnimation';
import { FADE_UP } from './fadeUp';

/** A div that fades up into place the first time it scrolls into view. */
export function Reveal(props: ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null);
  useEnterAnimation(ref, FADE_UP);
  return <div ref={ref} data-reveal="" {...props} />;
}
