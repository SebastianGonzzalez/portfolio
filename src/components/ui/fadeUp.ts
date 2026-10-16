import type { EnterAnimation } from '@/hooks/useEnterAnimation';
import { EASE_OUT } from '@/lib/motion';

/** Fade up from 28px below with a blur. Used by <Reveal> and by cards that reveal themselves. */
export const FADE_UP: EnterAnimation = {
  startsVisible: (top, vh) => top <= vh,
  hide(el) {
    el.style.opacity = '0';
    el.style.filter = 'blur(8px)';
    el.style.transform = 'translateY(28px)';
  },
  show(el) {
    el.style.transition = `opacity 900ms ${EASE_OUT}, filter 900ms ${EASE_OUT}, transform 900ms ${EASE_OUT}, background 260ms ease-out`;
    el.style.opacity = '1';
    el.style.filter = 'none';
    el.style.transform = 'none';
  },
  observer: { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
};
