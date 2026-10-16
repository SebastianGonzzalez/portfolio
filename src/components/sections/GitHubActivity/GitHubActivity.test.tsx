import { fireEvent, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { es } from '@/content/i18n/es';
import { buildYear, fromIsoDay } from '@/lib/calendar';
import { GITHUB_SNAPSHOT } from '@/lib/github/snapshot';
import { AppProviders } from '@/providers';
import { offline, prefersReducedMotion, renderWithProviders } from '@/test/utils';
import { GitHubActivity } from './GitHubActivity';

const t = es.github;
const BUILT_ON = '2026-10-15';
const section = <GitHubActivity lang="es" t={t} label={es.sections.github} builtOn={BUILT_ON} />;
const mount = () => renderWithProviders(section);

const repo = (name: string, fork = false) => ({
  name,
  full_name: `SebastianGonzzalez/${name}`,
  fork,
  language: 'TypeScript',
  created_at: '2026-02-01T00:00:00Z',
  languages_url: `langs:${name}`,
});

/** GitHub as the page sees it: one own repo, the profile repo, a fork and a repo with no description. */
function githubReply(url: string) {
  if (url.includes('contributions')) return { contributions: [{ date: '2026-01-02', count: 3, level: 2 }] };
  if (url.includes('/users/')) {
    return [repo('galeria-visual'), repo('SebastianGonzzalez'), repo('old-fork', true), repo('new_thing')];
  }
  if (url === 'langs:galeria-visual') return { TypeScript: 600, CSS: 300 };
  if (url.startsWith('langs:')) return { HTML: 100 };
  const name = url.split('/')[5];
  return [
    {
      sha: name.padEnd(12, '0'),
      commit: { message: `Commit on ${name}`, author: { date: '2026-10-03T00:00:00Z' } },
    },
  ];
}

const liveGitHub = () =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => ({ ok: true, json: async () => githubReply(url) })),
  );

describe('GitHubActivity', () => {
  beforeEach(() => prefersReducedMotion(true));

  it('shows the bundled snapshot while offline', () => {
    offline();
    mount();
    expect(screen.getByText(new RegExp(t.snapshot))).toBeTruthy();
    expect(screen.getByText(GITHUB_SNAPSHOT.commits[0].message)).toBeTruthy();
    expect(screen.getByText(t.repos).nextSibling!.textContent).toBe(String(GITHUB_SNAPSHOT.repoCount));
  });

  it('puts the totals in the static HTML, counted up to the build day', () => {
    const html = renderToString(<AppProviders>{section}</AppProviders>);
    const expected = buildYear({
      year: 2026,
      days: GITHUB_SNAPSHOT.days,
      today: fromIsoDay(BUILT_ON),
      locale: 'es',
      labels: t,
    });
    expect(expected.total).toBeGreaterThan(0);
    expect(html).not.toContain('—');
    const values = [...html.matchAll(/class="statValue">([\d.,]+)/g)].map((m) => m[1]);
    expect(values).toEqual(
      [
        expected.total.toLocaleString('es'),
        expected.longestStreak,
        expected.activeDays,
        GITHUB_SNAPSHOT.repoCount,
      ].map(String),
    );
    expect(html).toContain(`${expected.total} Contribuciones · 2026`);
  });

  it('replaces the snapshot with live repos, languages and commits', async () => {
    liveGitHub();
    mount();
    expect(await screen.findByText(new RegExp(t.live))).toBeTruthy();
    expect(screen.getByText('Commit on galeria-visual')).toBeTruthy();
    const languages = within(screen.getByText(t.languages).parentElement!);
    expect(['55%', '27%', '18%'].map((p) => languages.getByText(p).parentElement!.textContent)).toEqual([
      'TypeScript55%',
      'CSS27%',
      'HTML18%',
    ]);
    expect(screen.getByText(t.repos).nextSibling!.textContent).toBe('3'); // the fork doesn't count
  });

  it('shows the day under the cursor on the contribution calendar', () => {
    offline();
    mount();
    const grid = screen.getByRole('img', { name: new RegExp(t.total) });
    const cell = [...grid.children].find((c) => (c as HTMLElement).dataset.tip) as HTMLElement;
    const tip = grid.nextElementSibling as HTMLElement;
    fireEvent.pointerOver(cell);
    expect(tip.textContent).toBe(cell.dataset.tip);
    expect(tip.style.opacity).toBe('1');
    fireEvent.pointerOver(grid); // the gaps between cells
    expect(tip.style.opacity).toBe('0');
    fireEvent.pointerOver(cell);
    fireEvent.pointerLeave(grid);
    expect(tip.style.opacity).toBe('0');
  });

  it('lets the keyboard reach the scrollable calendar and opens it on the current weeks', () => {
    offline();
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(800);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
    mount();
    const region = screen.getByRole('region', { name: t.kicker });
    expect(region.tabIndex).toBe(0);
    expect(region.scrollLeft).toBeGreaterThan(0);
  });
});
