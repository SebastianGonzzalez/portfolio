# Portfolio v3 — Sebastián González

[![CI / Deploy](https://github.com/SebastianGonzzalez/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/SebastianGonzzalez/portfolio/actions/workflows/deploy.yml)

Portafolio personal de una página, en español e inglés: https://sebastiangonzzalez.github.io/portfolio/

**Stack:** Next.js 16 (App Router, export estático) · React 19 · TypeScript estricto · CSS Modules · Vitest + Testing Library · Playwright + axe.

## Empezar

```bash
npm install
npm run dev     # http://localhost:3000/portfolio/
npm run check   # todo lo que corre la CI: lint, tipos, formato, tests, build y E2E
```

| Script                    | Qué hace                                                           |
| ------------------------- | ------------------------------------------------------------------ |
| `npm run build`           | Genera el sitio estático en `out/`                                 |
| `npm start`               | Sirve `out/` bajo `/portfolio`, igual que GitHub Pages             |
| `npm run lint`            | ESLint (Next, TypeScript, SonarJS y reglas de capas)               |
| `npm run typecheck`       | `tsc --noEmit`                                                     |
| `npm test`                | Tests unitarios en modo watch                                      |
| `npm run test:coverage`   | Tests unitarios con cobertura (mínimo 85 % de líneas)              |
| `npm run test:e2e`        | Playwright contra el build: funcional, accesibilidad y visual      |
| `npm run test:e2e:update` | Regenera las capturas de referencia tras un cambio visual aprobado |
| `npm run og`              | Regenera las imágenes de vista previa al compartir (`public/og/`)  |

## Arquitectura

```
src/
  config/      constantes del sitio (perfil, URLs, basePath)
  content/     datos puros: textos ES/EN, proyectos, secciones, skills
  lib/         lógica pura sin React: calendario, API de GitHub, utilidades
  providers/   contextos compartidos: movimiento, scroll apilado, intro, datos de GitHub
  hooks/       un comportamiento por hook: drag, imán, marquee, dock, scroll apilado…
  components/
    ui/        piezas reutilizables (Shot, Reveal, Divider, Corners…)
    layout/    Header, Preloader, indicador de sección, contenedor del scroll
    sections/  una carpeta por sección: Hero, Approach, Work, GitHubActivity, Lab, Archive, Contact
    effects/   TechText (motor canvas del footer)
    HomePage.tsx
  app/         rutas: (es)/ → /portfolio/   (en)/en/ → /portfolio/en/
  styles/      tokens, reset y estilos de texto compartidos
tests/e2e/     Playwright
```

**Las dependencias van en una sola dirección:**

```
config → content → lib → providers → hooks → components → app
```

Una capa solo importa de las anteriores. ESLint (`import/no-restricted-paths`) lo hace cumplir: si `lib/` importa un componente, o una sección importa otra, el lint falla. Lo compartido entre secciones va en `components/ui`.

**Decisiones:**

- **Server Components por defecto.** `Approach` es Server Component completo, y `Work`, `Lab` y `Contact` también, salvo sus piezas interactivas (cuadrícula de proyectos, experimentos, dock), que son Client Components.
- **Un root layout por idioma** (route groups `(es)` y `(en)`): `<html lang>`, título, canonical y `hreflang` son correctos en el HTML estático. Cambiar de idioma recarga la página.
- **Animaciones fuera del ciclo de React.** Los efectos por frame (scroll apilado, inclinación 3D, dock) escriben estilos directamente vía refs; el valor que se comparte entre componentes cada frame viaja por una señal (`lib/signal.ts`), no por estado, para no re-renderizar 60 veces por segundo.
- **Movimiento reducido.** Todo respeta `prefers-reduced-motion` y el interruptor "Movimiento" del Laboratorio.
- **Casos compartibles.** El proyecto destacado vive en la URL (`?caso=doose`): un enlace así abre la página directamente en ese caso.
- **Sugerencia de idioma, sin redirigir.** Si el idioma del navegador no es el de la página, aparece un aviso discreto, escrito en ese idioma. Seguirlo o cerrarlo se recuerda. No hay redirección automática: en un sitio estático solo puede ocurrir después de cargar, y produce un parpadeo.
- **Todo funciona con teclado**, incluidas las piezas del Laboratorio: con foco, se mueven con las flechas (Mayús para pasos largos).
- **GitHub nunca rompe la página.** Se muestra una lectura guardada (`lib/github/snapshot.ts`) y se reemplaza con datos en vivo si la API responde.
- **CSS Modules + cascade layers.** `reset` < `ui` < estilos del componente: el módulo de cada componente siempre gana, sin `!important`.

## Cambios frecuentes

**Añadir un proyecto:** crea `src/content/projects/mi-proyecto.ts` (copia uno existente, con sus textos `es` y `en`) y añádelo a la lista en `src/content/projects/index.ts`. Su `slug` es el valor de `?caso=` en los enlaces compartidos: no lo cambies una vez publicado. Si falta algún campo o traducción, no compila.

**Añadir una sección:** crea `src/components/sections/MiSeccion/`, regístrala en `src/content/sections.ts`, añade su etiqueta en `sections` de cada diccionario y renderízala en `HomePage.tsx`. El menú, los contadores "0X / 0N" y el scroll apilado se actualizan solos.

**Añadir un idioma:** crea `src/content/i18n/xx.ts` con el tipo `Dictionary` (el compilador lista lo que falta), añádelo a `LANGS` y crea su ruta en `src/app/(xx)/xx/`.

**Cambiar colores o tipografía:** variables en `src/styles/globals.css`.

## Pruebas

- **Unitarias** (`*.test.ts(x)` junto a cada módulo): lógica, hooks y componentes.
- **E2E** (`tests/e2e/`), contra el build estático, sin red y con fecha fija para que sean deterministas:
  - `site.spec.ts`: idiomas, navegación, 404, modo sin conexión, preloader.
  - `a11y.spec.ts`: axe con WCAG 2.2 AA en ambos idiomas.
  - `visual.spec.ts`: compara la página completa píxel a píxel con capturas de referencia (escritorio y móvil). Las capturas dependen del sistema operativo, así que la CI no las compara.

## Despliegue

Cada push a `main` pasa por la CI (`.github/workflows/deploy.yml`) y solo se publica en GitHub Pages si todo pasa.

- `basePath: '/portfolio'` en `next.config.ts` debe coincidir con el nombre del repositorio.
- Los archivos de `public/` se referencian con `asset()` (`src/config/site.ts`), porque `basePath` no se aplica solo a `url()` ni a `<img>`.

Al compartir el enlace se muestra `public/og/{es,en}.png`; si cambias el titular, ejecuta `npm run og`. El build genera `sitemap.xml` con ambos idiomas; puedes enviarlo en Google Search Console.

`source/` contiene el diseño original (Claude Design), solo como referencia; no forma parte del sitio.
