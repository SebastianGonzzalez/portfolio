import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PROFILE } from '@/config/site';
import { es } from '@/content/i18n/es';
import {
  advance,
  offline,
  prefersReducedMotion,
  renderWithProviders,
  useAnimationTimers,
} from '@/test/utils';
import { Contact } from './Contact';
import { dockLinks } from './dockLinks';

const t = es.contact;
const mount = () => renderWithProviders(<Contact t={t} label={es.sections.contact} />);
const dock = (name: string) => screen.getByRole('link', { name });
const caption = () => document.querySelector('.caption')!;

describe('dockLinks', () => {
  it('opens profiles in a new tab and copies the email', () => {
    const links = dockLinks(t, false);
    expect(links.map((l) => l.label)).toEqual(['GitHub', 'Email', 'WhatsApp', 'Instagram']);
    expect(links[1]).toMatchObject({ href: `mailto:${PROFILE.email}`, copies: true, external: false });
    expect(links[1].detail).toBe(`${PROFILE.email} · ${t.dockCopy}`);
    expect(dockLinks(t, true)[1].detail).toBe(`${PROFILE.email} · ${t.copied}`);
  });
});

describe('Contact', () => {
  beforeEach(() => {
    offline();
    prefersReducedMotion(false);
  });

  it('copies the email from the dock and confirms it for a moment', async () => {
    useAnimationTimers();
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    mount();
    await act(async () => {
      fireEvent.click(dock('Email'));
    });
    expect(writeText).toHaveBeenCalledWith(PROFILE.email);
    expect(caption().textContent).toBe(t.copied);
    advance(1800);
    expect(caption().textContent).not.toBe(t.copied);
  });

  it('still confirms the copy when the clipboard is blocked', async () => {
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: { writeText: () => Promise.reject(new Error('denied')) },
    });
    mount();
    await act(async () => {
      fireEvent.click(dock('Email'));
    });
    expect(caption().textContent).toBe(t.copied);
  });

  it('names the hovered or focused link under the dock', () => {
    mount();
    fireEvent.mouseEnter(dock('GitHub'));
    expect(caption().textContent).toBe('@' + PROFILE.github.user);
    expect(dock('GitHub').querySelector('.tooltipVisible')).toBeTruthy();
    fireEvent.blur(dock('GitHub'));
    fireEvent.focus(dock('WhatsApp'));
    expect(caption().textContent).toBe(PROFILE.whatsapp.display);
    fireEvent.mouseLeave(dock('WhatsApp').parentElement!);
    expect(caption().textContent).toBe(t.dockHint + t.dockTap);
  });

  it('grows dock icons near the cursor and settles back with a spring', () => {
    useAnimationTimers();
    mount();
    const box = dock('GitHub').parentElement!;
    const first = dock('GitHub');
    fireEvent.mouseMove(box, { clientX: 0 });
    advance(200);
    expect(parseFloat(first.style.width)).toBeGreaterThan(52);
    fireEvent.mouseLeave(box);
    advance(2000);
    expect(Math.abs(parseFloat(first.style.width) - 52)).toBeLessThanOrEqual(0.15);
  });

  it('shows the visitor’s local time in the footer, refreshed every 15 s', () => {
    useAnimationTimers();
    vi.setSystemTime(new Date(2026, 9, 15, 10, 30));
    mount();
    const footer = screen.getByText(new RegExp(t.localTime));
    expect(footer.textContent).toMatch(/10:30/);
    vi.setSystemTime(new Date(2026, 9, 15, 10, 31));
    advance(15000);
    expect(footer.textContent).toMatch(/10:31/);
  });
});
