import { EB_Garamond, Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { preconnect } from 'react-dom';
import type { Lang } from '@/content/i18n';
import '@/styles/globals.css';

// Self-hosted by next/font. Components reference the families through these CSS variables.
const serif = EB_Garamond({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif' });
const sans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const mono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

const THIRD_PARTY_ORIGINS = [
  'https://api.github.com',
  'https://avatars.githubusercontent.com',
  'https://github-contributions-api.jogruber.de',
];

/**
 * Shared <html> shell. Each language is its own root layout (route groups), so `lang` is right in the
 * static HTML; switching language is a full page load.
 */
export function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  // Origins hit on first load: GitHub API and avatar, contributions calendar.
  for (const origin of THIRD_PARTY_ORIGINS) preconnect(origin, { crossOrigin: 'anonymous' });
  return (
    <html lang={lang} className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
