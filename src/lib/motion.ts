/** The site's standard ease-out curve. Same value as --ease-out in globals.css. */
export const EASE_OUT = 'cubic-bezier(.22,1,.36,1)';

/** Runs `fn` two frames from now (after the next paint). Returns a cancel function. */
export function afterNextPaint(fn: () => void) {
  let id = requestAnimationFrame(() => {
    id = requestAnimationFrame(fn);
  });
  return () => cancelAnimationFrame(id);
}

/**
 * Touch-first screen (phones, tablets). Their GPUs flicker when re-rasterising tall 3D-transformed or
 * blurred layers mid-scroll, so heavy effects fall back to plain opacity and translate there.
 */
export const isTouchScreen = () =>
  window.matchMedia?.('(hover: none) and (pointer: coarse)').matches ?? false;
