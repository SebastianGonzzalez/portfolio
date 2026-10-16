import type { GitHubActivity } from './types';

/** Last saved read of the GitHub profile (npm run snapshot). Shown until (or unless) the live data loads. */
export const GITHUB_SNAPSHOT: GitHubActivity = {
  live: false,
  loadedAt: 0,
  repoCount: 3,
  archive: [
    { repo: 'SebastianGonzzalez/portfolio', name: 'Portfolio', language: 'TypeScript', year: '2026' },
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
    '2026-10-07': { count: 2, level: 2 },
    '2026-10-08': { count: 1, level: 1 },
    '2026-10-15': { count: 18, level: 4 },
  },
  languages: [
    { name: 'TypeScript', percent: 63 },
    { name: 'CSS', percent: 18 },
    { name: 'JavaScript', percent: 14 },
    { name: 'HTML', percent: 5 },
  ],
  commits: [
    {
      hash: '5819c63',
      message: 'Merge pull request #3 from SebastianGonzzalez/docs/readme',
      repo: 'portfolio',
      date: '2026-10-16T02:09:42Z',
    },
    {
      hash: '0b15e7f',
      message: 'Sacar del repositorio los archivos del diseño original',
      repo: 'portfolio',
      date: '2026-10-16T02:03:49Z',
    },
    {
      hash: '943c5d5',
      message: 'Quitar la mención a la herramienta de diseño del README',
      repo: 'portfolio',
      date: '2026-10-16T02:01:14Z',
    },
    {
      hash: '1624dbe',
      message: 'Merge pull request #2 from SebastianGonzzalez/chore/licencia',
      repo: 'portfolio',
      date: '2026-10-16T01:44:58Z',
    },
    {
      hash: '7d8d946',
      message: 'Añadir licencia: código MIT y contenido personal reservado',
      repo: 'portfolio',
      date: '2026-10-16T01:38:59Z',
    },
    {
      hash: 'd84ed0e',
      message: 'Merge pull request #1 from SebastianGonzzalez/refactor/architecture',
      repo: 'portfolio',
      date: '2026-10-16T01:10:01Z',
    },
  ],
};
