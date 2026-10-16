import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { es } from '@/content/i18n/es';
import {
  advance,
  mockRect,
  offline,
  prefersReducedMotion,
  renderWithProviders,
  useAnimationTimers,
} from '@/test/utils';
import { Lab } from './Lab';

const t = es.lab;
const mount = () => renderWithProviders(<Lab t={t} label={es.sections.lab} />);

describe('Lab', () => {
  beforeEach(() => {
    offline();
    prefersReducedMotion(false);
  });

  it('toggles page motion from the switch', () => {
    mount();
    const sw = screen.getByRole('switch', { name: new RegExp(t.motion) });
    expect(sw.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(sw, { detail: 1 });
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  it('drags pieces without toggling the switch when the drag ends', () => {
    mount();
    const sw = screen.getByRole('switch');
    fireEvent.pointerDown(sw, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(window, { clientX: 50, clientY: 20 });
    expect(sw.style.transform).toMatch(/^translate\(50px,20px\) rotate\(.+deg\) scale\(1\.03\)$/);
    fireEvent.pointerUp(window);
    expect(sw.style.transform).toBe('translate(50px,20px)');
    fireEvent.click(sw, { detail: 1 }); // the click that ends a drag
    expect(sw.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(sw, { detail: 0 }); // keyboard activation always toggles
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  it('continues a drag from where the piece was left, and brings it to the front', () => {
    mount();
    const send = screen.getByText(`${t.send} →`);
    const drag = (dx: number, dy: number) => {
      fireEvent.pointerDown(send, { clientX: 0, clientY: 0 });
      fireEvent.pointerMove(window, { clientX: dx, clientY: dy });
      fireEvent.pointerUp(window);
    };
    drag(10, 10);
    drag(5, -10);
    expect(send.style.transform).toBe('translate(15px,0px)');
    expect(Number(send.style.zIndex)).toBe(12);
    fireEvent.pointerUp(window); // a stray pointerup is ignored
    expect(send.style.transform).toBe('translate(15px,0px)');
  });

  it('makes letters heavier near the cursor', () => {
    useAnimationTimers();
    const { container } = mount();
    const word = container.querySelector<HTMLElement>('.word')!;
    const [h] = word.querySelectorAll<HTMLElement>('[data-l]');
    fireEvent.pointerEnter(word);
    fireEvent.pointerMove(word, { clientX: 0, clientY: 0 });
    advance(20);
    expect(h.style.fontWeight).toBe('900'); // jsdom puts every letter at 0,0: full weight
    fireEvent.pointerLeave(word);
    expect(h.style.fontWeight).toBe('');
  });

  it('pulls the magnetic button toward the cursor and lets it spring back', () => {
    const { container } = mount();
    const zone = container.querySelector<HTMLElement>('.zone')!;
    mockRect(zone, { left: 0, top: 0, width: 200, height: 100 });
    Object.defineProperty(zone, 'offsetWidth', { value: 200 }); // unscaled
    const target = zone.querySelector<HTMLElement>('[data-mag]')!;
    fireEvent.pointerMove(zone, { clientX: 140, clientY: 70 });
    expect(target.style.transform).toBe('translate(12.8px, 6.4px)');
    fireEvent.pointerLeave(zone);
    expect(target.style.transform).toBe('translate(0,0)');
  });

  it('counts presses on the magnetic button', () => {
    mount();
    const button = screen.getByRole('button', { name: t.touch });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(screen.getByText(`2 ${t.clicks}`)).toBeTruthy();
  });

  it('keeps pieces still while dragging and the magnet off with reduced motion', () => {
    prefersReducedMotion(true);
    const { container } = mount();
    const send = screen.getByText(`${t.send} →`);
    fireEvent.pointerDown(send, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(window, { clientX: 30, clientY: 0, movementX: 20 });
    expect(send.style.transform).toBe('translate(30px,0px) rotate(0deg) scale(1.03)');
    const zone = container.querySelector<HTMLElement>('.zone')!;
    fireEvent.pointerMove(zone, { clientX: 140, clientY: 70 });
    expect(zone.querySelector<HTMLElement>('[data-mag]')!.style.transform).toBe('');
  });

  it('removes its window listeners on unmount', () => {
    const removed = vi.spyOn(window, 'removeEventListener');
    mount().unmount();
    expect(removed.mock.calls.map((c) => c[0])).toEqual(expect.arrayContaining(['pointermove', 'pointerup']));
  });
});

describe('Lab from the keyboard', () => {
  beforeEach(() => {
    offline();
    prefersReducedMotion(false);
  });

  it('moves a focused piece with the arrow keys, faster with Shift', () => {
    mount();
    const send = screen.getByRole('button', { name: `${t.send} →` });
    fireEvent.keyDown(send, { key: 'ArrowRight' });
    fireEvent.keyDown(send, { key: 'ArrowDown', shiftKey: true });
    expect(send.style.transform).toBe('translate(10px,40px)');
    fireEvent.keyDown(send, { key: 'ArrowLeft' });
    fireEvent.keyDown(send, { key: 'ArrowUp' });
    expect(send.style.transform).toBe('translate(0px,30px)');
  });

  it('ignores other keys, so Space/Enter still toggle the switch', () => {
    mount();
    const sw = screen.getByRole('switch');
    fireEvent.keyDown(sw, { key: 'Enter' });
    expect(sw.style.transform).toBe('');
    fireEvent.click(sw, { detail: 0 });
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  it('describes how to move the pieces', () => {
    mount();
    for (const piece of [screen.getByRole('switch'), screen.getByRole('button', { name: /HEAD/ })]) {
      const hint = document.getElementById(piece.getAttribute('aria-describedby')!);
      expect(hint?.textContent).toBe(t.keyboardHint);
    }
    expect(screen.getByRole('button', { name: /HEAD/ }).getAttribute('aria-roledescription')).toBe(
      t.movablePiece,
    );
  });
});
