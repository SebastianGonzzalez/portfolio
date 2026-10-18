import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  captureIntersectionObservers,
  mockRect,
  prefersReducedMotion,
  renderWithProviders,
  touchScreen,
} from '@/test/utils';
import { Corners } from './Corners';
import { Divider } from './Divider';
import { Reveal } from './Reveal';
import { Shot } from './Shot';

describe('Shot', () => {
  it('falls back to the second source, then to the placeholder', () => {
    render(
      <div className="frame">
        <Shot src="/a.png" fallback="/b.png" alt="Screenshot" placeholder="No image" width={10} height={10} />
      </div>,
    );
    const img = screen.getByAltText('Screenshot');
    fireEvent.error(img);
    expect(img.getAttribute('src')).toBe('/b.png');
    expect(img.hasAttribute('data-fallback')).toBe(true);
    fireEvent.error(img);
    expect(screen.queryByAltText('Screenshot')).toBeNull();
    expect(screen.getByText('No image').hasAttribute('data-placeholder')).toBe(true);
  });

  it('goes straight to the placeholder without a fallback', () => {
    render(<Shot src="/a.png" alt="Avatar" placeholder="Foto" width={64} height={64} priority />);
    fireEvent.error(screen.getByAltText('Avatar'));
    expect(screen.getByText('Foto')).toBeTruthy();
  });
});

describe('Corners', () => {
  it('draws the requested corner marks', () => {
    const { container } = render(<Corners at={['tl', 'br']} />);
    expect([...container.children].map((c) => c.className)).toEqual(['corner tl', 'corner br']);
  });
});

describe('entrance animations', () => {
  beforeEach(() => prefersReducedMotion(false));

  it('fade content up the first time it scrolls into view', () => {
    const io = captureIntersectionObservers();
    const original = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ top: 5000 }) as DOMRect;
    renderWithProviders(<Reveal data-testid="block">Hello</Reveal>);
    Element.prototype.getBoundingClientRect = original;
    const block = screen.getByTestId('block');
    expect(block.style.opacity).toBe('0');
    expect(block.style.filter).toBe('blur(8px)');
    io.enter(block);
    expect(block.style.opacity).toBe('1');
    expect(io.observed(block)).toBe(false);
  });

  it('skip the blur on touch screens', () => {
    touchScreen();
    captureIntersectionObservers();
    const original = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ top: 5000 }) as DOMRect;
    renderWithProviders(<Reveal data-testid="block">Hello</Reveal>);
    Element.prototype.getBoundingClientRect = original;
    const block = screen.getByTestId('block');
    expect(block.style.opacity).toBe('0');
    expect(block.style.filter).toBe('');
  });

  it('leave content that starts on screen alone', () => {
    const io = captureIntersectionObservers();
    renderWithProviders(<Reveal data-testid="block">Hello</Reveal>);
    expect(screen.getByTestId('block').style.opacity).toBe('');
    expect(io.observers).toHaveLength(0);
  });

  it('draw the section divider and unfold its tabs', () => {
    const io = captureIntersectionObservers();
    const original = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ top: 5000 }) as DOMRect;
    const { container } = renderWithProviders(<Divider section="work" label="Trabajo" />);
    Element.prototype.getBoundingClientRect = original;
    const divider = container.querySelector<HTMLElement>('[data-divider]')!;
    const line = divider.querySelector<HTMLElement>('[data-line]')!;
    expect(divider.textContent).toBe('03/ 07Trabajo');
    expect(line.style.transform).toBe('scaleX(0)');
    io.enter(divider);
    expect(line.style.transform).toBe('scaleX(1)');
    expect(
      [...divider.querySelectorAll<HTMLElement>('[data-tab]')].every((t) => t.style.opacity === '1'),
    ).toBe(true);
  });

  it('are skipped with reduced motion', () => {
    prefersReducedMotion(true);
    const io = captureIntersectionObservers();
    const { container } = renderWithProviders(<Reveal>Hello</Reveal>);
    mockRect(container.firstElementChild!, { top: 5000 });
    expect(io.observers).toHaveLength(0);
  });
});
