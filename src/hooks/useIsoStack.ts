'use client';
import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react';
import { useMotion } from '@/providers/MotionProvider';
import { useScrollStackChannels, type HeroCover } from '@/providers/ScrollStackProvider';

export interface IsoStack {
  /** Write the current tilt, scale and spread to the DOM. */
  apply(): void;
  /** Distance between layers (0 = flat stack). */
  setSpread(spread: number): void;
  onPointerMove(e: PointerEvent<HTMLElement>): void;
  onPointerLeave(): void;
}

/** Plain controller for the hero's 3D stack: tilt toward the cursor, layers spread on hover and on scroll. */
function createIsoController(
  stageRef: RefObject<HTMLElement | null>,
  groupRef: RefObject<HTMLElement | null>,
  motionActive: () => boolean,
) {
  let rx = 0,
    ry = 0,
    spread = 0,
    scale = 1,
    narrow = false,
    hovering = false,
    heroProgress = 0;

  // Phones get a gentler tilt so the stack can be drawn larger and its text stays readable.
  const measure = () => {
    const stage = stageRef.current;
    if (!stage) return;
    narrow = window.innerWidth <= 640;
    scale = Math.min(1, (stage.offsetWidth - 8) / (narrow ? 536 : 600), (stage.offsetHeight - 40) / 580);
  };

  const apply = () => {
    const group = groupRef.current;
    if (!group) return;
    const [ax, ay, az] = narrow ? [10, -16, -4] : [14, -26, -7];
    group.style.transform = `translate(-50%,-50%) scale(${(scale || 1).toFixed(3)}) rotateX(${(ax - ry).toFixed(2)}deg) rotateY(${(ay + rx).toFixed(2)}deg) rotateZ(${az}deg)`;
    group.querySelectorAll<HTMLElement>('[data-z]').forEach((el) => {
      el.style.transform = `translateZ(${(Number(el.dataset.z) * spread * 20).toFixed(1)}px)`;
    });
  };

  const onPointerLeave = () => {
    hovering = false;
    rx = 0;
    ry = 0;
    spread = motionActive() ? heroProgress * 2.6 : 0;
    apply();
  };

  return {
    measure,
    apply,
    setSpread(value: number) {
      spread = value;
    },
    onPointerMove(e: PointerEvent<HTMLElement>) {
      const stage = stageRef.current;
      if (!motionActive() || !stage) return;
      const r = stage.getBoundingClientRect();
      rx = ((e.clientX - r.left) / r.width - 0.5) * 12;
      ry = ((e.clientY - r.top) / r.height - 0.5) * 8;
      hovering = true;
      spread = Math.max(1, heroProgress * 2.6);
      apply();
    },
    onPointerLeave,
    /** The stack spreads apart as the next section covers the hero (unless the cursor is driving it). */
    followCover({ progress, previous }: HeroCover) {
      heroProgress = progress;
      if (!hovering && motionActive() && (progress > 0 || previous > 0)) {
        spread = progress * 2.6;
        apply();
      }
    },
  };
}

export function useIsoStack(
  stageRef: RefObject<HTMLElement | null>,
  groupRef: RefObject<HTMLElement | null>,
): IsoStack {
  const { enabled, isActive } = useMotion();
  const { heroCover } = useScrollStackChannels();
  const [iso] = useState(() => createIsoController(stageRef, groupRef, isActive));

  useEffect(() => {
    const onResize = () => {
      iso.measure();
      iso.apply();
    };
    onResize();
    window.addEventListener('resize', onResize);
    const unsubscribe = heroCover.subscribe(iso.followCover);
    return () => {
      window.removeEventListener('resize', onResize);
      unsubscribe();
    };
  }, [iso, heroCover]);

  // Turning motion off from the Lab switch drops any tilt in progress.
  const wasEnabled = useRef(enabled);
  useEffect(() => {
    if (wasEnabled.current === enabled) return;
    wasEnabled.current = enabled;
    if (!isActive()) iso.onPointerLeave();
  }, [enabled, isActive, iso]);

  return iso;
}
