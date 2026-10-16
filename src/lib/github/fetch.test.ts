import { describe, expect, it, vi } from 'vitest';
import { fetchGitHubActivity } from './fetch';

type Routes = Record<string, unknown>;

/** fetch stub answering by URL substring; unknown URLs get a 404. */
const api = (routes: Routes) =>
  vi.fn(async (url: string) => {
    const key = Object.keys(routes).find((k) => url.includes(k));
    if (!key) return { ok: false, json: async () => null };
    const body = routes[key];
    if (body instanceof Error) throw body;
    return { ok: true, json: async () => body };
  }) as unknown as typeof fetch;

const repo = (name: string) => ({
  name,
  full_name: `me/${name}`,
  fork: false,
  language: 'TypeScript',
  created_at: '2026-01-01T00:00:00Z',
  languages_url: `https://api.github.com/repos/me/${name}/languages`,
});

const options = { user: 'me', year: 2026, known: [] };

describe('fetchGitHubActivity', () => {
  it('combines the calendar, repositories, languages and commits', async () => {
    const fetchImpl = api({
      'contributions-api': { contributions: [{ date: '2026-01-02', count: 2, level: 1 }] },
      '/users/me/repos': [repo('one'), repo('two')],
      '/one/languages': { TypeScript: 3 },
      '/two/languages': { CSS: 1 },
      '/one/commits': [
        { sha: '1111111aaa', commit: { message: 'First', author: { date: '2026-01-01T00:00:00Z' } } },
      ],
      '/two/commits': [
        { sha: '2222222bbb', commit: { message: 'Second', author: { date: '2026-01-03T00:00:00Z' } } },
      ],
    });
    const activity = await fetchGitHubActivity({ ...options, fetchImpl });
    expect(activity.days).toEqual({ '2026-01-02': { count: 2, level: 1 } });
    expect(activity.repoCount).toBe(2);
    expect(activity.archive?.map((a) => a.repo)).toEqual(['me/one', 'me/two']);
    expect(activity.languages).toEqual([
      { name: 'TypeScript', percent: 75 },
      { name: 'CSS', percent: 25 },
    ]);
    expect(activity.commits?.map((c) => c.message)).toEqual(['Second', 'First']);
  });

  it('returns only what it could read', async () => {
    const fetchImpl = api({
      'contributions-api': new Error('network down'),
      '/users/me/repos': [repo('one')],
    });
    const activity = await fetchGitHubActivity({ ...options, fetchImpl });
    expect(activity.days).toBeUndefined();
    expect(activity.repoCount).toBe(1);
    expect(activity.languages).toBeUndefined();
    expect(activity.commits).toBeUndefined();
  });

  it('returns nothing when GitHub is unreachable', async () => {
    const activity = await fetchGitHubActivity({ ...options, fetchImpl: api({}) });
    expect(activity).toEqual({});
  });

  it('ignores a malformed repository list', async () => {
    const activity = await fetchGitHubActivity({
      ...options,
      fetchImpl: api({ '/users/me/repos': { message: 'rate limited' } }),
    });
    expect(activity).toEqual({});
  });
});
