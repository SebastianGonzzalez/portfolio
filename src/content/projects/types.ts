import type { Lang } from '../i18n/types';

export interface CaseStudy {
  problem: string;
  role: string;
  built: string[];
  decisions: string;
  result: string;
}

interface ProjectText {
  /** Short category shown above the name, e.g. "E-commerce". */
  kind: string;
  description: string;
  /** Alt text, and the placeholder shown when the screenshot can't load. */
  imageAlt: string;
  case: CaseStudy;
}

export interface Project {
  /** URL id, as in ?caso=casa-nua. Keep it stable: shared links depend on it. */
  slug: string;
  name: string;
  /** "owner/name" on GitHub. Collaborations live under someone else's account. */
  repo: string;
  /** Main language, as GitHub reports it. */
  language: string;
  year: string;
  chips: string[];
  /** Live demo, or the repository when there is none. */
  site: string;
  image: {
    src: string;
    /** Shown if `src` fails: GitHub's generated preview of the repository. */
    fallback: string;
    credit?: { name: string; url: string };
  };
  text: Record<Lang, ProjectText>;
}

/** GitHub's Open Graph preview of a repository. */
export const repoPreview = (repo: string) => `https://opengraph.githubassets.com/1/${repo}`;
