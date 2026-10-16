// Site-wide constants. Lowest layer: everything may import it, it imports nothing.

/** Public URL of the deployed site, including basePath. */
export const SITE_URL = 'https://sebastiangonzzalez.github.io/portfolio';

/** basePath from next.config.ts. Next applies it to routes and _next assets, not to public/ files. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** URL of a file in public/. */
export const asset = (path: `/${string}`) => BASE_PATH + path;

export const PROFILE = {
  name: 'Sebastián González',
  initials: 'SG',
  /** "v0.4" from package.json's version (major.minor), passed in by next.config.ts. */
  version: 'v' + (process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0').split('.').slice(0, 2).join('.'),
  /** First term of the degree (term 1 = Jan–Jun, term 2 = Jul–Dec). The semester shown is counted from here. */
  studiesStart: { year: 2025, term: 1 },
  email: 'gonzalezsebas519@gmail.com',
  avatar: 'https://avatars.githubusercontent.com/u/281209723?v=4',
  github: { user: 'SebastianGonzzalez', url: 'https://github.com/SebastianGonzzalez' },
  whatsapp: { display: '+57 305 309 0124', url: 'https://wa.me/573053090124' },
  instagram: { display: '@ss.ebas_', url: 'https://www.instagram.com/ss.ebas_/' },
} as const;
