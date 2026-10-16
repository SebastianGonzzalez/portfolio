import { asset } from '@/config/site';
import { repoPreview, type Project } from './types';

/** This site, as a case study of how it is built. */
export const portfolio: Project = {
  slug: 'portafolio',
  name: 'Portfolio',
  repo: 'SebastianGonzzalez/portfolio',
  language: 'TypeScript',
  year: '2026',
  chips: ['Next.js', 'React', 'TypeScript', 'Playwright'],
  // The page itself is the demo: the screenshot leads to its code.
  site: 'https://github.com/SebastianGonzzalez/portfolio',
  image: { src: asset('/assets/portfolio.png'), fallback: repoPreview('SebastianGonzzalez/portfolio') },
  text: {
    es: {
      kind: 'Este sitio',
      description:
        'El portafolio que estás viendo: Next.js, React y TypeScript estricto, con pruebas automáticas y despliegue continuo.',
      imageAlt: 'Captura — Portfolio',
      case: {
        problem:
          'Llevar un portafolio hecho a mano a una base profesional: que pueda crecer sin romperse y que cada cambio se verifique solo antes de publicarse.',
        role: 'Proyecto personal: diseño, arquitectura, desarrollo, pruebas y despliegue.',
        built: [
          'Arquitectura por capas (configuración → contenido → lógica → componentes) que el linter hace cumplir',
          'Contenido en archivos de datos tipados: añadir un proyecto o un idioma no toca ningún componente',
          'Tests unitarios con más del 95\u00A0% de cobertura y E2E en Chrome, Firefox, Safari y móvil, con accesibilidad y regresión visual',
          'CI en GitHub Actions que publica en GitHub Pages solo si lint, tipos, tests y build pasan',
        ],
        decisions:
          'Next.js con exportación estática, TypeScript estricto y CSS Modules con design tokens. Lo migré desde JavaScript sin cambiar un píxel: lo comprobé comparando capturas antes y después.',
        result:
          'Sitio en español e inglés, usable con teclado, con vista previa al compartir y sitemap. Cada cambio entra por pull request con la CI en verde.',
      },
    },
    en: {
      kind: 'This site',
      description:
        'The portfolio you’re looking at: Next.js, React and strict TypeScript, with automated tests and continuous deployment.',
      imageAlt: 'Screenshot — Portfolio',
      case: {
        problem:
          'Turn a hand-built portfolio into a professional codebase: one that can grow without breaking, where every change checks itself before going live.',
        role: 'Personal project: design, architecture, development, testing and deployment.',
        built: [
          'Layered architecture (config → content → logic → components) enforced by the linter',
          'Content in typed data files: adding a project or a language touches no component',
          'Unit tests above 95\u00A0% coverage and end-to-end tests in Chrome, Firefox, Safari and mobile, with accessibility and visual regression checks',
          'GitHub Actions CI that deploys to GitHub Pages only when lint, types, tests and build pass',
        ],
        decisions:
          'Next.js static export, strict TypeScript and CSS Modules with design tokens. I migrated it from JavaScript without changing a pixel, and proved it by comparing screenshots before and after.',
        result:
          'Live in Spanish and English, keyboard-friendly, with link previews and a sitemap. Every change goes through a pull request with green CI.',
      },
    },
  },
};
