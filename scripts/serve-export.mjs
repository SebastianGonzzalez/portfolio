// Serves the static export (out/) under the same basePath GitHub Pages uses, so `npm start`
// and the E2E tests see exactly what gets deployed. Usage: node scripts/serve-export.mjs [port]
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const BASE = '/portfolio';
const ROOT = resolve('out');
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 3000);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveFile(pathname) {
  const rel = normalize(decodeURIComponent(pathname.slice(BASE.length))).replace(/^([/\\])+/, '');
  const file = join(ROOT, rel);
  if (!file.startsWith(ROOT)) return null;
  for (const candidate of [file, join(file, 'index.html'), file + '.html']) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  if (pathname === '/') {
    res.writeHead(302, { location: BASE + '/' }).end();
    return;
  }
  const file = pathname.startsWith(BASE) ? resolveFile(pathname) : null;
  const status = file ? 200 : 404;
  const body = file ?? join(ROOT, '404.html');
  res.writeHead(status, { 'content-type': TYPES[extname(body)] ?? 'application/octet-stream' });
  createReadStream(body).pipe(res);
}).listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}${BASE}/`));
