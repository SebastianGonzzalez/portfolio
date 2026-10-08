# Portfolio v3 — Sebastián González

Implementación en Next.js del diseño `Portfolio v3.dc.html` (Claude Design).

## Uso

```bash
npm install
npm run dev      # http://localhost:3000
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

Si el sitio vive en `usuario.github.io/<repo>/`, añade `basePath: '/<repo>'` en `next.config.mjs`
y publica la carpeta `out/`.
