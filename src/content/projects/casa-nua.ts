import { asset } from '@/config/site';
import { repoPreview, type Project } from './types';

export const casaNua: Project = {
  slug: 'casa-nua',
  name: 'Casa Nua',
  repo: 'SebastianGonzzalez/Casa_Nua',
  language: 'JavaScript',
  year: '2026',
  chips: ['JavaScript', 'HTML', 'CSS'],
  site: 'https://sebastiangonzzalez.github.io/Casa_Nua/index.html',
  image: { src: asset('/assets/casa-nua.png'), fallback: repoPreview('SebastianGonzzalez/Casa_Nua') },
  text: {
    es: {
      kind: 'E-commerce',
      description:
        'Librería en línea para la entrega de Desarrollo Web: catálogo de libros, login y registro con transiciones.',
      imageAlt: 'Captura — Casa Nua',
      case: {
        problem:
          'Construir una tienda en línea completa, con ventas, inventario y roles, solo en el navegador: sin back-end, sin frameworks y sin dependencias.',
        role: 'Desarrollo completo del front-end: arquitectura, lógica de negocio e interfaz. Proyecto individual para Desarrollo Web.',
        built: [
          'Login y registro con roles (admin / cliente) y cuentas que el admin activa',
          'Panel de administración de usuarios, productos, inventario y ventas',
          'Carrito con validación de stock; al confirmar se descuenta el inventario',
          'Historial de compras que conserva el precio histórico de cada línea',
        ],
        decisions:
          'JavaScript puro con ES Modules, dividido en 16 módulos (auth, storage, validators…), y localStorage como base de datos simulada. Cero dependencias.',
        result:
          '10 pantallas funcionales y responsive, publicadas en GitHub Pages con usuarios demo listos para probar.',
      },
    },
    en: {
      kind: 'E-commerce',
      description:
        'Online bookstore for my Web Development course: book catalog, login and sign-up with transitions.',
      imageAlt: 'Screenshot — Casa Nua',
      case: {
        problem:
          'Build a complete online store, with sales, inventory and roles, entirely in the browser: no back end, no frameworks, no dependencies.',
        role: 'Full front-end development: architecture, business logic and interface. Solo project for Web Development.',
        built: [
          'Login and sign-up with roles (admin / customer) and admin-approved accounts',
          'Admin panel for users, products, inventory and sales',
          'Cart with stock validation; confirming a purchase updates inventory',
          'Purchase history that keeps the historical price of each line',
        ],
        decisions:
          'Vanilla JavaScript with ES Modules, split into 16 modules (auth, storage, validators…), with localStorage as a simulated database. Zero dependencies.',
        result: '10 working, responsive screens, live on GitHub Pages with demo users ready to try.',
      },
    },
  },
};
