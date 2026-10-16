import type { GitHubActivity } from './types';

/** Last saved read of the GitHub profile. Shown until (or unless) the live data loads. */
export const GITHUB_SNAPSHOT: GitHubActivity = {
  live: false,
  loadedAt: 0,
  repoCount: 2,
  archive: [
    {
      repo: 'SebastianGonzzalez/galeria-visual',
      name: 'Galería visual',
      language: 'TypeScript',
      year: '2026',
    },
    { repo: 'SebastianGonzzalez/Casa_Nua', name: 'Casa Nua', language: 'JavaScript', year: '2026' },
    { repo: 'DuanGomez/Doose', name: 'Doose', language: 'SCSS', year: '2026' },
  ],
  days: {
    '2026-05-02': { count: 1, level: 1 },
    '2026-05-04': { count: 2, level: 2 },
    '2026-09-24': { count: 4, level: 4 },
    '2026-09-25': { count: 3, level: 3 },
    '2026-09-26': { count: 4, level: 4 },
    '2026-10-05': { count: 4, level: 4 },
  },
  languages: [
    { name: 'JavaScript', percent: 37 },
    { name: 'TypeScript', percent: 25 },
    { name: 'CSS', percent: 25 },
    { name: 'HTML', percent: 13 },
  ],
  commits: [
    {
      hash: 'c0b694e',
      message: 'Remove duplicate features from README',
      repo: 'galeria-visual',
      date: '2026-10-06T04:08:27Z',
    },
    {
      hash: '077d823',
      message: 'Revise README for clarity and additional details',
      repo: 'galeria-visual',
      date: '2026-10-06T04:07:23Z',
    },
    { hash: 'fff7a3d', message: 'cambios finales', repo: 'Casa_Nua', date: '2026-10-06T03:50:23Z' },
    { hash: '7fa3162', message: 'Update README.md', repo: 'galeria-visual', date: '2026-09-26T07:11:58Z' },
    { hash: 'f17727b', message: 'Update README.md', repo: 'galeria-visual', date: '2026-09-26T07:07:05Z' },
    {
      hash: '7961df8',
      message: 'Preparar galeria para GitHub Pages',
      repo: 'galeria-visual',
      date: '2026-09-26T06:41:48Z',
    },
  ],
};
