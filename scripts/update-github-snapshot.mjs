// Refreshes src/lib/github/snapshot.ts with a live read of the GitHub profile. The snapshot is what the
// page shows before (or without) the live data, and what the static HTML is built with.
// Run before a deploy you want to carry fresh numbers: npm run snapshot
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';
import { format, resolveConfig } from 'prettier';

const root = fileURLToPath(new URL('..', import.meta.url));
const jiti = createJiti(import.meta.url, { alias: { '@': `${root}src` } });

// Same modules the site uses, so the snapshot is shaped and filtered exactly like live data.
const { fetchGitHubActivity } = await jiti.import('../src/lib/github/fetch.ts');
const { GITHUB_SNAPSHOT } = await jiti.import('../src/lib/github/snapshot.ts');
const { PROJECTS } = await jiti.import('../src/content/projects/index.ts');
const { PROFILE } = await jiti.import('../src/config/site.ts');

const live = await fetchGitHubActivity({
  user: PROFILE.github.user,
  year: new Date().getFullYear(),
  known: PROJECTS.map((p) => ({ repo: p.repo, name: p.name, language: p.language, year: p.year })),
});

const missing = ['days', 'repoCount', 'archive', 'languages', 'commits'].filter((key) => !(key in live));
if (missing.length) {
  console.error(`GitHub didn't return: ${missing.join(', ')}. The snapshot is unchanged (rate limit?).`);
  process.exit(1);
}

const snapshot = { ...GITHUB_SNAPSHOT, ...live, live: false, loadedAt: 0 };
const source = `import type { GitHubActivity } from './types';

/** Last saved read of the GitHub profile (npm run snapshot). Shown until (or unless) the live data loads. */
export const GITHUB_SNAPSHOT: GitHubActivity = ${JSON.stringify(snapshot)};
`;
const file = `${root}src/lib/github/snapshot.ts`;
writeFileSync(file, await format(source, { ...(await resolveConfig(file)), filepath: file }));

const total = Object.values(snapshot.days).reduce((sum, d) => sum + d.count, 0);
console.log(
  `Snapshot updated: ${total} contributions, ${snapshot.repoCount} repos, ${snapshot.commits.length} commits.`,
);
