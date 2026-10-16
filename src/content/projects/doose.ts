import { asset } from '@/config/site';
import { repoPreview, type Project } from './types';

export const doose: Project = {
  slug: 'doose',
  name: 'Doose',
  repo: 'DuanGomez/Doose',
  language: 'TypeScript',
  year: '2026',
  chips: ['Angular', 'Spring Boot', 'PostgreSQL', 'JWT'],
  site: 'https://duangomez.github.io/Doose/',
  image: { src: asset('/assets/doose.png'), fallback: repoPreview('DuanGomez/Doose') },
  text: {
    es: {
      kind: 'Aplicación full-stack',
      description:
        'Plataforma para un estudio de tatuajes, hecha en equipo con Duan Gómez: Angular en el front-end y Spring Boot con PostgreSQL en el back-end.',
      imageAlt: 'Captura — Doose',
      case: {
        problem:
          'Construir en equipo una plataforma completa para un estudio de tatuajes: portafolio, catálogo de servicios, reservas de citas y un panel de administración, con front-end y back-end propios.',
        role: 'Trabajo en equipo con Duan Gómez, en el front-end y en el back-end.',
        built: [
          'API REST con Spring Boot, JPA y PostgreSQL, con tres roles: cliente, tatuador y administrador',
          'Login con JWT y Spring Security; las rutas de administración están protegidas en la API y en Angular',
          'Reservas que respetan la duración de cada servicio, las citas ya confirmadas y un máximo de 3 servicios por tatuador al día',
          'Portafolio con favoritos, carrito que se conserva al recargar, agenda de citas y panel de administración',
        ],
        decisions:
          'Back-end por capas (controladores, servicios, repositorios y DTOs) con manejo de errores centralizado y secretos en variables de entorno. Angular 17 con componentes standalone, signals, guards e interceptores.',
        result:
          'Funciona completo en local con su base de datos, y tiene una demo pública en GitHub Pages donde la API se simula en el navegador con la misma lógica del back-end.',
      },
    },
    en: {
      kind: 'Full-stack app',
      description:
        'Platform for a tattoo studio, built with Duan Gómez: Angular on the front end, Spring Boot and PostgreSQL on the back end.',
      imageAlt: 'Screenshot — Doose',
      case: {
        problem:
          'Build, as a team, a complete platform for a tattoo studio: portfolio, service catalog, appointment booking and an admin panel, with our own front end and back end.',
        role: 'Team project with Duan Gómez, on both the front end and the back end.',
        built: [
          'REST API with Spring Boot, JPA and PostgreSQL, with three roles: customer, tattoo artist and admin',
          'JWT login with Spring Security; admin routes are protected both in the API and in Angular',
          'Booking that respects each service’s duration, confirmed appointments and a limit of 3 services per artist a day',
          'Portfolio with favorites, a cart that survives reloads, an appointment calendar and an admin panel',
        ],
        decisions:
          'Layered back end (controllers, services, repositories and DTOs) with centralized error handling and secrets in environment variables. Angular 17 with standalone components, signals, guards and interceptors.',
        result:
          'Runs end to end locally with its database, and has a public demo on GitHub Pages where the API is simulated in the browser with the same logic as the back end.',
      },
    },
  },
};
