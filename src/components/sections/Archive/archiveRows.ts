import type { Lang } from '@/content/i18n';
import { PROJECTS } from '@/content/projects';
import type { ArchiveEntry } from '@/lib/github/types';
import type { ArchiveRowData } from './ArchiveRow';

/** Archive entries enriched with what the site knows about each project (kind, preview image). */
export function toRows(entries: ArchiveEntry[], lang: Lang, fallbackKind: string): ArchiveRowData[] {
  return entries.map((entry, i) => {
    const project = PROJECTS.find((p) => p.repo === entry.repo);
    // Stacked backgrounds: the GitHub preview shows through if the local screenshot is missing.
    const preview = project
      ? `url(${project.image.src}) center/cover no-repeat, url(${project.image.fallback}) center/cover no-repeat, #2A2724`
      : '';
    return {
      ...entry,
      number: String(i + 1).padStart(2, '0'),
      kind: project ? project.text[lang].kind : fallbackKind,
      preview,
    };
  });
}
