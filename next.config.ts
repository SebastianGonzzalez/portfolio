import type { NextConfig } from 'next';
import { version } from './package.json';

// GitHub Pages serves the site at sebastiangonzzalez.github.io/portfolio/
const basePath = '/portfolio';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // Needed for a custom 404 with one root layout per language (see src/app/global-not-found.tsx).
  experimental: { globalNotFound: true },
  // basePath is not applied to public/ paths used in url() or <img>: content prefixes them with this.
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_APP_VERSION: version },
};

export default nextConfig;
