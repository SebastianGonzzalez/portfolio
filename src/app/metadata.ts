import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/config/site';
import { HOME_PATH, LANGS, getDictionary, type Lang } from '@/content/i18n';

const absolute = (lang: Lang) => SITE_URL + HOME_PATH[lang];

/** Title, description, canonical URL and hreflang alternates for a language's home page. */
export function metadataFor(lang: Lang): Metadata {
  const { meta } = getDictionary(lang);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: absolute(lang),
      languages: Object.fromEntries(LANGS.map((l) => [l, absolute(l)])),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: absolute(lang),
      locale: lang,
      type: 'website',
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light',
};
