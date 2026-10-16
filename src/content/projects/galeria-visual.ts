import { asset } from '@/config/site';
import { repoPreview, type Project } from './types';

export const galeriaVisual: Project = {
  slug: 'galeria-visual',
  name: 'Galería visual',
  repo: 'SebastianGonzzalez/galeria-visual',
  language: 'TypeScript',
  year: '2026',
  chips: ['Next.js', 'TypeScript', 'Tailwind', 'Demo'],
  site: 'https://sebastiangonzzalez.github.io/galeria-visual/',
  image: {
    src: asset('/assets/galeria-visual.png'),
    fallback: repoPreview('SebastianGonzzalez/galeria-visual'),
  },
  text: {
    es: {
      kind: 'Experimento',
      description: 'Demo de una galería virtual: mi primera prueba seria con TypeScript.',
      imageAlt: 'Captura — Galería visual',
      case: {
        problem:
          'Explorar una forma inmersiva de mostrar obra visual, en lugar de la cuadrícula de imágenes de siempre, y aprender TypeScript estricto en el proceso.',
        role: 'Proyecto personal: diseño de la interacción, desarrollo y despliegue.',
        built: [
          'Rueda 3D de obras que se recorre con el scroll',
          'Pantalla de carga e introducción animadas',
          'Página propia para cada obra con ruta dinámica /obra/[id]',
          'Contenido centralizado en un solo archivo de datos, fácil de editar',
        ],
        decisions:
          'Next.js + TypeScript estricto + Tailwind. Exportación estática y despliegue automático con GitHub Actions.',
        result:
          'Publicada en GitHub Pages y reutilizable como base para portafolios visuales. Mi primer proyecto serio en TypeScript.',
      },
    },
    en: {
      kind: 'Experiment',
      description: 'Virtual gallery demo — my first serious TypeScript project.',
      imageAlt: 'Screenshot — Visual gallery',
      case: {
        problem:
          'Explore an immersive way to show visual work instead of the usual image grid, and learn strict TypeScript along the way.',
        role: 'Personal project: interaction design, development and deployment.',
        built: [
          '3D wheel of works you browse by scrolling',
          'Animated loading screen and intro',
          'Dedicated page per work with dynamic route /obra/[id]',
          'Content centralised in one easy-to-edit data file',
        ],
        decisions:
          'Next.js + strict TypeScript + Tailwind. Static export and automatic deployment with GitHub Actions.',
        result:
          'Live on GitHub Pages and reusable as a base for visual portfolios. My first serious TypeScript project.',
      },
    },
  },
};
