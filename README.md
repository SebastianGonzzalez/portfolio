# Portfolio v3 — Sebastián González

Implementación en Next.js del diseño `Portfolio v3.dc.html` (Claude Design).

## Uso

```bash
npm install
npm run dev      # http://localhost:3000/portfolio
npm run build    # genera el sitio estático en out/
```

## Estructura

- `components/Portfolio.jsx` — la página completa (secciones, animaciones, datos de GitHub en vivo).
- `components/TechText.jsx` — el nombre interactivo del footer (canvas).
- `lib/data.js` — proyectos, textos ES/EN y la última lectura de GitHub usada como respaldo.
- `public/icons/` — íconos del dock de contacto.
- `public/assets/` — capturas de los proyectos (`casa-nua.png`, `galeria-visual.png`). Si falta alguna, se muestra la tarjeta de vista previa de GitHub del repositorio.
- `source/` — archivos originales del diseño, solo como referencia. No forman parte del sitio publicado.
  `support.js` tiene dos ajustes manuales para React Doctor; se pierden si se vuelve a exportar el diseño.

## Publicar en GitHub Pages

El sitio se publica en https://sebastiangonzzalez.github.io/portfolio/.
Cada push a `main` lo compila y lo publica con `.github/workflows/deploy.yml`.

- `basePath: '/portfolio'` en `next.config.mjs` debe coincidir con el nombre del repo. Si lo cambias, cambia también esa línea.
- Las rutas a `public/` en el código usan `BASE` (de `lib/data.js`) como prefijo, porque `basePath` no se aplica solo a `url()` ni a `<img>`.
- Por el `basePath`, `npm start` (que sirve `out/` en la raíz) no carga los estilos; para probar en local usa `npm run dev`.
