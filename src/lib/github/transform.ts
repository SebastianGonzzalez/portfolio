// Pure transformations from GitHub API payloads to what the page shows.
import type {
  ApiCommit,
  ApiContributions,
  ApiRepo,
  ArchiveEntry,
  Commit,
  ContributionDay,
  LanguageShare,
} from './types';

/** "galeria-visual" → "Galeria visual" */
export function prettyRepoName(name: string): string {
  const spaced = name.replace(/[-_]+/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function toContributionDays(payload: ApiContributions): Record<string, ContributionDay> {
  const days: Record<string, ContributionDay> = {};
  for (const d of payload.contributions) if (d.count) days[d.date] = { count: d.count, level: d.level };
  return days;
}

export const ownRepos = (repos: ApiRepo[]) => repos.filter((r) => !r.fork);

/**
 * Own repositories (minus the profile README repo) followed by known collaborations that aren't listed yet.
 * `known` gives curated display names for repositories the site already describes.
 */
export function toArchive(repos: ApiRepo[], user: string, known: ArchiveEntry[]): ArchiveEntry[] {
  const nameOf = (repo: string) => known.find((k) => k.repo === repo)?.name;
  const archive = ownRepos(repos)
    .filter((r) => r.name !== user)
    .map((r) => ({
      repo: r.full_name,
      name: nameOf(r.full_name) ?? prettyRepoName(r.name),
      language: r.language ?? '—',
      year: String(new Date(r.created_at).getFullYear()),
    }));
  const collaborations = known.filter((k) => !k.repo.startsWith(user + '/'));
  for (const c of collaborations) if (!archive.some((a) => a.repo === c.repo)) archive.push(c);
  return archive;
}

/** Top 5 languages by bytes across repositories, as whole percentages that add up to 100. */
export function languageShares(perRepo: (Record<string, number> | null)[]): LanguageShare[] {
  const bytes: Record<string, number> = {};
  for (const langs of perRepo) {
    if (!langs) continue;
    for (const [name, n] of Object.entries(langs)) bytes[name] = (bytes[name] ?? 0) + n;
  }
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  if (!total) return [];
  const top = Object.entries(bytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, n]) => ({ name, percent: Math.round((n / total) * 100) }));
  // Rounding drift goes to the largest share.
  top[0].percent += 100 - top.reduce((sum, l) => sum + l.percent, 0);
  return top.filter((l) => l.percent > 0);
}

export function toCommits(repo: string, payload: ApiCommit[]): Commit[] {
  return payload.map((c) => ({
    hash: c.sha.slice(0, 7),
    message: c.commit.message.split('\n')[0],
    repo,
    date: c.commit.author.date,
  }));
}

export const latestCommits = (commits: Commit[], count = 6) =>
  [...commits].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, count);
