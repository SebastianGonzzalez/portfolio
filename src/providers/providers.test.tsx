import { act, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GITHUB_SNAPSHOT } from '@/lib/github/snapshot';
import { offline, prefersReducedMotion } from '@/test/utils';
import { GitHubProvider, useGitHubActivity } from './GitHubProvider';
import { useIntroSignal } from './IntroProvider';
import { MotionProvider, useMotion } from './MotionProvider';
import { useScrollStackChannels } from './ScrollStackProvider';

describe('MotionProvider', () => {
  it('is active by default and follows the switch', () => {
    const { result } = renderHook(() => useMotion(), { wrapper: MotionProvider });
    expect(result.current.enabled).toBe(true);
    expect(result.current.isActive()).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.enabled).toBe(false);
    expect(result.current.isActive()).toBe(false);
  });

  it('stays inactive when the visitor prefers reduced motion, whatever the switch says', () => {
    prefersReducedMotion(true);
    const { result } = renderHook(() => useMotion(), { wrapper: MotionProvider });
    expect(result.current.enabled).toBe(true);
    expect(result.current.isActive()).toBe(false);
  });
});

describe('hooks outside their provider', () => {
  it.each([
    ['useMotion', useMotion],
    ['useIntroSignal', useIntroSignal],
    ['useScrollStackChannels', useScrollStackChannels],
  ])('%s throws a helpful error', (name, hook) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => hook())).toThrow(name);
  });
});

function Probe() {
  const activity = useGitHubActivity();
  return (
    <output>{`${activity.live ? 'live' : 'snapshot'} · ${activity.repoCount} repos · ${activity.commits[0].message}`}</output>
  );
}

describe('GitHubProvider', () => {
  it('starts from the snapshot and swaps in live data', async () => {
    const reply = (url: string) => {
      if (url.includes('/users/')) {
        const one = { name: 'one', full_name: 'SebastianGonzzalez/one', fork: false, language: 'Go' };
        return [{ ...one, created_at: '2026-01-01', languages_url: 'l' }];
      }
      if (url.includes('/commits')) {
        return [
          { sha: 'abcdef12', commit: { message: 'Live commit', author: { date: '2026-01-01T00:00:00Z' } } },
        ];
      }
      return null;
    };
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({ ok: true, json: async () => reply(url) })),
    );
    render(
      <GitHubProvider>
        <Probe />
      </GitHubProvider>,
    );
    expect(screen.getByRole('status').textContent).toBe(
      `snapshot · ${GITHUB_SNAPSHOT.repoCount} repos · ${GITHUB_SNAPSHOT.commits[0].message}`,
    );
    expect(await screen.findByText('live · 1 repos · Live commit')).toBeTruthy();
  });

  it('keeps the snapshot when GitHub is unreachable', async () => {
    offline();
    render(
      <GitHubProvider>
        <Probe />
      </GitHubProvider>,
    );
    await act(async () => {});
    expect(screen.getByRole('status').textContent).toMatch(/^snapshot/);
  });

  it('ignores replies that arrive after unmount', async () => {
    let reply: (value: unknown) => void = () => {};
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise((resolve) => (reply = resolve))),
    );
    const errors = vi.spyOn(console, 'error');
    const { unmount } = render(
      <GitHubProvider>
        <Probe />
      </GitHubProvider>,
    );
    unmount();
    await act(async () => reply({ ok: true, json: async () => ({ contributions: [] }) }));
    expect(errors).not.toHaveBeenCalled();
  });
});
