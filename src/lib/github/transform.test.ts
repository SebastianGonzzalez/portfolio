import { describe, expect, it } from 'vitest';
import {
  languageShares,
  latestCommits,
  prettyRepoName,
  toArchive,
  toCommits,
  toContributionDays,
} from './transform';
import type { ApiRepo } from './types';

const repo = (name: string, extra: Partial<ApiRepo> = {}): ApiRepo => ({
  name,
  full_name: `me/${name}`,
  fork: false,
  language: 'TypeScript',
  created_at: '2025-03-01T00:00:00Z',
  languages_url: `langs:${name}`,
  ...extra,
});

describe('prettyRepoName', () => {
  it('turns a repository slug into a title', () => {
    expect(prettyRepoName('galeria-visual')).toBe('Galeria visual');
    expect(prettyRepoName('Casa__Nua')).toBe('Casa Nua');
    expect(prettyRepoName('-edge-')).toBe('Edge');
  });
});

describe('toContributionDays', () => {
  it('keeps only days with contributions', () => {
    const days = toContributionDays({
      contributions: [
        { date: '2026-01-01', count: 3, level: 2 },
        { date: '2026-01-02', count: 0, level: 0 },
      ],
    });
    expect(days).toEqual({ '2026-01-01': { count: 3, level: 2 } });
  });
});

describe('toArchive', () => {
  const known = [
    { repo: 'me/site', name: 'My Site', language: 'CSS', year: '2024' },
    { repo: 'friend/team-app', name: 'Team App', language: 'SCSS', year: '2026' },
  ];

  it('lists own repos with curated or prettified names, skipping forks and the profile repo', () => {
    const archive = toArchive(
      [repo('site'), repo('me'), repo('a-fork', { fork: true }), repo('new_tool', { language: null })],
      'me',
      known,
    );
    expect(archive.map((a) => a.name)).toEqual(['My Site', 'New tool', 'Team App']);
    expect(archive[1]).toEqual({ repo: 'me/new_tool', name: 'New tool', language: '—', year: '2025' });
  });

  it('does not duplicate a collaboration that is already listed', () => {
    const archive = toArchive([repo('team-app', { full_name: 'friend/team-app' })], 'me', known);
    expect(archive.filter((a) => a.repo === 'friend/team-app')).toHaveLength(1);
  });
});

describe('languageShares', () => {
  it('sums bytes across repos and rounds to whole percentages that add up to 100', () => {
    const shares = languageShares([{ TypeScript: 600, CSS: 300 }, { HTML: 100 }, null, { HTML: 100 }]);
    expect(shares).toEqual([
      { name: 'TypeScript', percent: 55 },
      { name: 'CSS', percent: 27 },
      { name: 'HTML', percent: 18 },
    ]);
  });

  it('keeps the top five and drops shares that round to zero', () => {
    const shares = languageShares([{ A: 9000, B: 400, C: 300, D: 200, E: 99, F: 1 }]);
    expect(shares.map((s) => s.name)).toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(shares.reduce((sum, s) => sum + s.percent, 0)).toBe(100);
    expect(languageShares([{ A: 1_000_000, B: 1 }]).map((s) => s.name)).toEqual(['A']);
  });

  it('returns nothing when there is no data', () => {
    expect(languageShares([null, {}])).toEqual([]);
  });
});

describe('commits', () => {
  it('shortens hashes and keeps only the first line of the message', () => {
    const [commit] = toCommits('site', [
      {
        sha: 'abcdef123456',
        commit: { message: 'Fix nav\n\nDetails', author: { date: '2026-01-01T00:00:00Z' } },
      },
    ]);
    expect(commit).toEqual({
      hash: 'abcdef1',
      message: 'Fix nav',
      repo: 'site',
      date: '2026-01-01T00:00:00Z',
    });
  });

  it('sorts newest first and keeps the latest six', () => {
    const commits = Array.from({ length: 8 }, (_, i) => ({
      hash: String(i),
      message: '',
      repo: 'r',
      date: `2026-01-0${i + 1}T00:00:00Z`,
    }));
    expect(latestCommits(commits).map((c) => c.hash)).toEqual(['7', '6', '5', '4', '3', '2']);
  });
});
