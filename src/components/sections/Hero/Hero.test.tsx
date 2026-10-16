import { act, fireEvent, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { es } from '@/content/i18n/es';
import { AppProviders } from '@/providers';
import { useIntroSignal } from '@/providers/IntroProvider';
import { useMotion } from '@/providers/MotionProvider';
import { useScrollStackChannels } from '@/providers/ScrollStackProvider';
import { advance, mockRect, offline, prefersReducedMotion, useAnimationTimers } from '@/test/utils';
import { Hero } from './Hero';

/** Handles to drive the hero the way the preloader, the stacked scroll and the Lab switch would. */
const controls = {} as { reveal(): void; cover(p: number, previous?: number): void; toggleMotion(): void };
function Controls() {
  const intro = useIntroSignal();
  const { heroCover } = useScrollStackChannels();
  const { toggle } = useMotion();
  useEffect(() => {
    Object.assign(controls, {
      reveal: () => intro.emit(),
      cover: (progress: number, previous = 0) => heroCover.emit({ progress, previous }),
      toggleMotion: toggle,
    });
  });
  return null;
}

const mount = () => {
  const view = render(
    <AppProviders>
      <Controls />
      <Hero t={es.hero} />
    </AppProviders>,
  );
  const stage = view.container.querySelector<HTMLElement>('.stage')!;
  mockRect(stage, { left: 0, top: 0, width: 400, height: 400 });
  const group = view.container.querySelector<HTMLElement>('.group')!;
  const layer = (z: number) => group.querySelector<HTMLElement>(`[data-z="${z}"]`)!;
  return { ...view, stage, group, layer };
};

describe('Hero', () => {
  beforeEach(() => {
    offline();
    prefersReducedMotion(false);
    useAnimationTimers();
  });

  it('introduces the profile, the stack layers and the skills', () => {
    mount();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(es.hero.title + es.hero.titleEmphasis);
    for (const layer of es.hero.layers) expect(screen.getByText(layer.title)).toBeTruthy();
    expect(screen.getByText('TypeScript', { selector: '.skill' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Email ↗' }).getAttribute('href')).toMatch(/^mailto:/);
  });

  it('tilts the stack toward the cursor and settles when it leaves', () => {
    const { stage, group, layer } = mount();
    fireEvent.pointerMove(stage, { clientX: 100, clientY: 50 });
    expect(group.style.transform).toContain('rotateY(-29.00deg)');
    expect(layer(4).style.transform).toBe('translateZ(80.0px)'); // spread 1 while hovering
    fireEvent.pointerLeave(stage);
    expect(group.style.transform).toContain('rotateY(-26.00deg)');
    expect(layer(4).style.transform).toBe('translateZ(0.0px)');
  });

  it('spreads the layers apart as the next section covers the hero', () => {
    const { layer } = mount();
    act(() => controls.cover(0.5));
    expect(layer(4).style.transform).toBe('translateZ(104.0px)'); // 4 × 0.5 × 2.6 × 20
    act(() => controls.cover(0, 0)); // nothing to undo
    expect(layer(4).style.transform).toBe('translateZ(104.0px)');
  });

  it('plays the entrance when the preloader signals', () => {
    const { group, layer } = mount();
    const intro = [...document.querySelectorAll<HTMLElement>('[data-intro]')];
    expect(intro).toHaveLength(4);
    expect(intro.every((el) => el.style.opacity === '0')).toBe(true);
    expect(group.style.opacity).toBe('0');
    expect(layer(4).style.transform).toBe('translateZ(320.0px)'); // arrives exploded
    act(() => controls.reveal());
    expect(intro.every((el) => el.style.opacity === '1')).toBe(true);
    expect(group.style.opacity).toBe('1');
    advance(100);
    expect(layer(4).style.transform).toBe('translateZ(0.0px)');
    advance(2200);
    expect(layer(4).style.transition).toBe('transform 700ms cubic-bezier(.22,1,.36,1)');
  });

  it('stops following the cursor when motion is switched off', () => {
    const { stage, group } = mount();
    fireEvent.pointerMove(stage, { clientX: 100, clientY: 50 });
    act(() => controls.toggleMotion());
    expect(group.style.transform).toContain('rotateY(-26.00deg)');
    fireEvent.pointerMove(stage, { clientX: 300, clientY: 300 });
    expect(group.style.transform).toContain('rotateY(-26.00deg)');
  });

  it('renders still with reduced motion', () => {
    prefersReducedMotion(true);
    const { group } = mount();
    expect(group.style.opacity).toBe('');
    expect(
      [...document.querySelectorAll<HTMLElement>('[data-intro]')].every((el) => el.style.opacity === ''),
    ).toBe(true);
  });

  it('uses a gentler tilt on phones', () => {
    window.innerWidth = 390;
    const { group } = mount();
    expect(group.style.transform).toContain('rotateY(-16.00deg)');
    window.innerWidth = 1024;
  });
});
