import { repoPreview, type Project } from './types';

export const doose: Project = {
  slug: 'doose',
  name: 'Doose',
  repo: 'DuanGomez/Doose',
  language: 'SCSS',
  year: '2026',
  chips: ['SCSS', 'HTML', 'Equipo'],
  site: 'https://github.com/DuanGomez/Doose',
  image: {
    src: 'https://images.unsplash.com/photo-1584915591129-2fa8cae28577?fm=jpg&q=70&w=1282&h=770&fit=crop&auto=format',
    fallback: repoPreview('DuanGomez/Doose'),
    credit: { name: 'Duman Photography', url: 'https://unsplash.com/photos/sp10n9ixbQU' },
  },
  text: {
    es: {
      kind: 'Sitio web',
      description: 'Página para un estudio de tatuajes, construida en equipo con Duan Gómez.',
      imageAlt: 'Captura — Doose',
      case: {
        problem:
          'Construir en equipo la web de un estudio de tatuajes, con estilos, trabajos y artistas, y con front-end y back-end en un mismo repositorio.',
        role: 'Trabajo en equipo con Duan Gómez: maquetación del front-end y sistema de estilos en SCSS.',
        built: [
          'Sitio con secciones de estilos, galería de trabajos y artistas',
          'Sistema SCSS con variables, mixins y parciales reutilizables',
          'Front-end conectado a un back-end con base de datos',
          'Flujo de trabajo en equipo con Git sobre un repositorio compartido',
        ],
        decisions:
          'SCSS modular para mantener la consistencia visual entre páginas, y separación clara entre frontend y backend dentro del repositorio.',
        result:
          'Proyecto colaborativo completo. Corre en local porque depende de la base de datos, por eso no tiene demo pública.',
      },
    },
    en: {
      kind: 'Website',
      description: 'Site for a tattoo studio, built together with Duan Gómez.',
      imageAlt: 'Screenshot — Doose',
      case: {
        problem:
          'Build, as a team, the website of a tattoo studio, with its styles, work and artists, and with front end and back end in one repository.',
        role: 'Team project with Duan Gómez: front-end layout and the SCSS styling system.',
        built: [
          'Site with sections for styles, portfolio and artists',
          'SCSS system with variables, mixins and reusable partials',
          'Front-end connected to a back-end with a database',
          'Team workflow with Git on a shared repository',
        ],
        decisions:
          'Modular SCSS to keep visuals consistent across pages, and a clear frontend / backend split in the repo.',
        result:
          'Complete team project. It runs locally because it depends on the database, so there is no public demo.',
      },
    },
  },
};
