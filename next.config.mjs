/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Para GitHub Pages en un subdirectorio: basePath: '/nombre-del-repo'
};

export default nextConfig;
