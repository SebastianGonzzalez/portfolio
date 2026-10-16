import { PROJECTS } from '@/content/projects';

/** Featured project first (with its case study), then the rest in their original order. */
export const orderWithFeatured = (featured: number) => [
  featured,
  ...PROJECTS.map((_, i) => i).filter((i) => i !== featured),
];
