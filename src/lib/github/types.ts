export interface ArchiveEntry {
  /** "owner/name" */
  repo: string;
  name: string;
  language: string;
  year: string;
}

export interface ContributionDay {
  count: number;
  /** GitHub's 0–4 intensity level. */
  level: number;
}

export interface LanguageShare {
  name: string;
  percent: number;
}

export interface Commit {
  hash: string;
  message: string;
  /** Repository name, without the owner. */
  repo: string;
  /** ISO date. */
  date: string;
}

export interface GitHubActivity {
  /** True once live data replaced the bundled snapshot. */
  live: boolean;
  /** When the live data arrived (ms). 0 for the snapshot. */
  loadedAt: number;
  repoCount: number;
  archive: ArchiveEntry[];
  /** Keyed by "YYYY-MM-DD"; days without contributions are absent. */
  days: Record<string, ContributionDay>;
  languages: LanguageShare[];
  commits: Commit[];
}

/** The subset of GitHub's REST repository object this site reads. */
export interface ApiRepo {
  name: string;
  full_name: string;
  fork: boolean;
  language: string | null;
  created_at: string;
  languages_url: string;
}

export interface ApiCommit {
  sha: string;
  commit: { message: string; author: { date: string } };
}

export interface ApiContributions {
  contributions: { date: string; count: number; level: number }[];
}
