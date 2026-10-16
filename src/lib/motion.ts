/** The site's standard ease-out curve. Same value as --ease-out in globals.css. */
export const EASE_OUT = 'cubic-bezier(.22,1,.36,1)';

/** Runs `fn` two frames from now (after the next paint). Returns a cancel function. */
export function afterNextPaint(fn: () => void) {
  let id = requestAnimationFrame(() => {
    id = requestAnimationFrame(fn);
  });
  return () => cancelAnimationFrame(id);
}
