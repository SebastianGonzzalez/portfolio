import type { NextConfig } from 'next';

// GitHub Pages serves the site at sebastiangonzzalez.github.io/portfolio/
const basePath = '/portfolio';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // basePath is not applied to public/ paths used in url() or <img>: content prefixes them with this.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
