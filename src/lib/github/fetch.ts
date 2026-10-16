import {
  languageShares,
  latestCommits,
  ownRepos,
  toArchive,
  toCommits,
  toContributionDays,
} from './transform';
import type { ApiCommit, ApiContributions, ApiRepo, ArchiveEntry, GitHubActivity } from './types';

type Fetch = typeof fetch;

/** JSON body, or null on any failure (network, non-2xx, bad JSON). The page must never break on GitHub. */
async function getJson<T>(fetchImpl: Fetch, url: string): Promise<T | null> {
  try {
    const res = await fetchImpl(url);
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

interface Options {
  user: string;
  year: number;
  /** Archive entries the site already describes (curated names, collaborations). */
  known: ArchiveEntry[];
  fetchImpl?: Fetch;
}

/** Whatever could be read from GitHub. Missing keys mean "keep the snapshot value". */
export async function fetchGitHubActivity({
  user,
  year,
  known,
  fetchImpl = fetch,
}: Options): Promise<Partial<GitHubActivity>> {
  const [calendar, repos] = await Promise.all([
    getJson<ApiContributions>(fetchImpl, `https://github-contributions-api.jogruber.de/v4/${user}?y=${year}`),
    getJson<ApiRepo[]>(fetchImpl, `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`),
  ]);

  const activity: Partial<GitHubActivity> = {};
  if (calendar && Array.isArray(calendar.contributions)) activity.days = toContributionDays(calendar);
  if (!Array.isArray(repos)) return activity;

  const own = ownRepos(repos);
  activity.repoCount = own.length;
  const archive = toArchive(repos, user, known);
  if (archive.length) activity.archive = archive;

  const [languages, commits] = await Promise.all([
    Promise.all(own.map((r) => getJson<Record<string, number>>(fetchImpl, r.languages_url))),
    Promise.all(
      own.map(async (r) => {
        const list = await getJson<ApiCommit[]>(
          fetchImpl,
          `https://api.github.com/repos/${r.full_name}/commits?per_page=10`,
        );
        return Array.isArray(list) ? toCommits(r.name, list) : [];
      }),
    ),
  ]);
  const shares = languageShares(languages);
  if (shares.length) activity.languages = shares;
  const latest = latestCommits(commits.flat());
  if (latest.length) activity.commits = latest;
  return activity;
}
