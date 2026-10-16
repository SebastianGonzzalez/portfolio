import { describe, expect, it, vi } from 'vitest';
import { cx } from './cx';
import { afterNextPaint } from './motion';
import { createSignal } from './signal';

describe('cx', () => {
  it('joins truthy class names', () => {
    expect(cx('a', false, null, undefined, 'b')).toBe('a b');
  });
});

describe('createSignal', () => {
  it('delivers values to subscribers until they unsubscribe', () => {
    const signal = createSignal<number>();
    const listener = vi.fn();
    const unsubscribe = signal.subscribe(listener);
    signal.emit(1);
    unsubscribe();
    signal.emit(2);
    expect(listener.mock.calls).toEqual([[1]]);
  });

  it('replays the last value to late subscribers who ask for it', () => {
    const signal = createSignal<string>();
    const late = vi.fn(),
      plain = vi.fn();
    signal.subscribe(plain, { replay: true }); // nothing emitted yet
    signal.emit('ready');
    signal.subscribe(late, { replay: true });
    expect(late).toHaveBeenCalledWith('ready');
    expect(plain).toHaveBeenCalledTimes(1);
  });
});

describe('afterNextPaint', () => {
  it('runs after two frames and can be cancelled', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    const ran = vi.fn(),
      cancelled = vi.fn();
    afterNextPaint(ran);
    afterNextPaint(cancelled)();
    vi.advanceTimersByTime(16);
    expect(ran).not.toHaveBeenCalled();
    vi.advanceTimersByTime(16);
    expect(ran).toHaveBeenCalledTimes(1);
    expect(cancelled).not.toHaveBeenCalled();
  });
});
