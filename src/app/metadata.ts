import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/config/site';
import { HOME_PATH, LANGS, getDictionary, type Lang } from '@/content/i18n';

const absolute = (lang: Lang) => SITE_URL + HOME_PATH[lang];

/** Title, description, canonical URL and hreflang alternates for a language's home page. */
/** Social preview, rendered by scripts/generate-og.mjs (npm run og). */
const previewImage = (lang: Lang, alt: string) => ({
  url: `${SITE_URL}/og/${lang}.png`,
  width: 1200,
  height: 630,
  alt,
});

export function metadataFor(lang: Lang): Metadata {
  const { meta } = getDictionary(lang);
  const image = previewImage(lang, meta.title);
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
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [image],
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light',
};
