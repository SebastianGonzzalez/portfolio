import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { HOME_PATH, LANGS } from '@/content/i18n';

// Prerendered into the static export as /portfolio/sitemap.xml.
export const dynamic = 'force-static';

/**
 * One entry per language, each listing the others as alternates. There is no robots.txt: crawlers only
 * read it at the domain root, which belongs to the sebastiangonzzalez.github.io repository, not this one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LANGS.map((l) => [l, SITE_URL + HOME_PATH[l]]));
  return LANGS.map((lang) => ({
    url: SITE_URL + HOME_PATH[lang],
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: lang === 'es' ? 1 : 0.9,
    alternates: { languages },
  }));
}
