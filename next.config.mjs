// GitHub Pages sirve el sitio en sebastiangonzzalez.github.io/portfolio/
const basePath = '/portfolio';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  // basePath no se aplica a las rutas de public/ usadas en url() o <img>: el código las prefija con esto.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
