import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TechText, type TechTextProps } from './TechText';

type FakeContext = { calls: string[] };

// The fake 2D context (src/test/setup.ts) makes every char 10px wide with 8px ascent / 2px descent.
// In a 600×200 box, "Hola" (40px) is centred at x = 280…320 with its baseline at y = 103.
const OVER_H = { clientX: 285, clientY: 100 };

const frames = (n = 1) => {
  for (let i = 0; i < n; i++) act(() => vi.advanceTimersByTime(16));
};

function setup(props: TechTextProps = {}) {
  const view = render(<TechText text="Hola" sweep={false} {...props} />);
  const box = view.getByRole('img');
  const ctx = box.querySelector('canvas')!.getContext('2d') as unknown as FakeContext;
  frames();
  return { ...view, box, ctx };
}

describe('TechText', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout'],
    });
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200);
  });
  afterEach(() => vi.useRealTimers());

  it('exposes the text as an accessible image', () => {
    const { box } = setup({ text: 'Sebastián González' });
    expect(box.getAttribute('aria-label')).toBe('Sebastián González');
  });

  it('draws the word on a canvas sized to its box', () => {
    const { box, ctx } = setup();
    const canvas = box.querySelector('canvas')!;
    expect([canvas.width, canvas.height]).toEqual([600, 200]);
    expect(ctx.calls).toContain('drawImage');
  });

  it('shows a grab cursor over a letter, and grabbing while dragging it', () => {
    const { box, ctx } = setup();
    fireEvent.pointerMove(box, OVER_H);
    frames(3);
    expect(box.style.cursor).toBe('grab');
    expect(ctx.calls).toContain('fillText'); // the measurement label above the selection frame

    fireEvent.pointerDown(box, { ...OVER_H, button: 0, pointerType: 'mouse' });
    fireEvent.pointerMove(box, { clientX: 340, clientY: 150 });
    frames(10);
    expect(box.style.cursor).toBe('grabbing');
    fireEvent.pointerLeave(box); // leaving mid-drag keeps the drag alive
    frames();
    expect(box.style.cursor).toBe('grabbing');

    fireEvent.pointerUp(box, { clientX: 340, clientY: 150 });
    frames(120); // the letter springs back home
    expect(box.style.cursor).not.toBe('grabbing');
  });

  it('ignores secondary buttons and presses away from the text', () => {
    const { box } = setup();
    fireEvent.pointerDown(box, { ...OVER_H, button: 2, pointerType: 'mouse' });
    frames(2);
    expect(box.style.cursor).not.toBe('grabbing');
    fireEvent.pointerDown(box, { clientX: 10, clientY: 10, button: 0, pointerType: 'mouse' });
    frames(2);
    expect(box.style.cursor).toBe('');
  });

  it('leaves the cursor alone when dragging is off', () => {
    const { box } = setup({ draggable: false });
    fireEvent.pointerMove(box, OVER_H);
    frames(3);
    expect(box.style.cursor).toBe('');
  });

  it('reveals outlines under a lens in area mode', () => {
    const { box, ctx } = setup({ reveal: 'area', softness: 0, lineStyle: 'solid' });
    fireEvent.pointerEnter(box, OVER_H);
    frames(20);
    expect(ctx.calls).toContain('fillRect');
    fireEvent.pointerLeave(box);
    frames(60);
  });

  it('sweeps on its own while idle and stops drawing once unmounted', () => {
    const { unmount, ctx } = setup({ sweep: true, labels: false, specks: 0, selection: false });
    frames(30);
    const before = ctx.calls.length;
    frames(5);
    expect(ctx.calls.length).toBeGreaterThan(before);
    unmount();
    const after = ctx.calls.length;
    frames(5);
    expect(ctx.calls).toHaveLength(after);
  });

  it('renders the accessible box even when 2D canvas is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const { getByRole } = render(<TechText text="Hola" />);
    expect(getByRole('img').getAttribute('aria-label')).toBe('Hola');
  });
});
