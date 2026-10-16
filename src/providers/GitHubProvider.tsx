'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { PROFILE } from '@/config/site';
import { PROJECTS } from '@/content/projects';
import { fetchGitHubActivity } from '@/lib/github/fetch';
import { GITHUB_SNAPSHOT } from '@/lib/github/snapshot';
import type { GitHubActivity } from '@/lib/github/types';

const GitHubContext = createContext<GitHubActivity>(GITHUB_SNAPSHOT);

const KNOWN_REPOS = PROJECTS.map((p) => ({ repo: p.repo, name: p.name, language: p.language, year: p.year }));

/** Starts from the bundled snapshot and swaps in live GitHub data once (and if) it arrives. */
export function GitHubProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState(GITHUB_SNAPSHOT);

  useEffect(() => {
    let cancelled = false;
    fetchGitHubActivity({
      user: PROFILE.github.user,
      year: new Date().getFullYear(),
      known: KNOWN_REPOS,
    }).then((live) => {
      if (cancelled || !Object.keys(live).length) return;
      setActivity((prev) => ({ ...prev, ...live, live: true, loadedAt: Date.now() }));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <GitHubContext.Provider value={activity}>{children}</GitHubContext.Provider>;
}

export const useGitHubActivity = () => useContext(GitHubContext);
