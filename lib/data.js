export const GH_USER = 'SebastianGonzzalez';
export const EMAIL = 'gonzalezsebas519@gmail.com';
const OG = 'https://opengraph.githubassets.com/1/';

export const PROJECTS = [
  { n: '01', name: 'Casa Nua', repo: 'https://github.com/SebastianGonzzalez/Casa_Nua', url: 'github.com/SebastianGonzzalez/Casa_Nua', lang: 'JavaScript', chips: ['JavaScript', 'HTML', 'CSS'], site: 'https://sebastiangonzzalez.github.io/Casa_Nua/index.html', img: 'assets/casa-nua.png', fallback: OG + 'SebastianGonzzalez/Casa_Nua' },
  { n: '02', name: 'Doose', repo: 'https://github.com/DuanGomez/Doose', url: 'github.com/DuanGomez/Doose', lang: 'SCSS', chips: ['SCSS', 'HTML', 'Equipo'], credit: 'Duman Photography', creditHref: 'https://unsplash.com/photos/sp10n9ixbQU', img: 'https://images.unsplash.com/photo-1584915591129-2fa8cae28577?fm=jpg&q=70&w=1282&h=770&fit=crop&auto=format', site: 'https://github.com/DuanGomez/Doose', fallback: OG + 'DuanGomez/Doose' },
  { n: '03', name: 'Galería visual', repo: 'https://github.com/SebastianGonzzalez/galeria-visual', url: 'github.com/SebastianGonzzalez/galeria-visual', lang: 'TypeScript', chips: ['Next.js', 'TypeScript', 'Tailwind', 'Demo'], img: 'assets/galeria-visual.png', site: 'https://sebastiangonzzalez.github.io/galeria-visual/', fallback: OG + 'SebastianGonzzalez/galeria-visual' },
];

export const HREFS = ['#enfoque', '#trabajo', '#github', '#lab', '#contacto'];
export const NAMES = { Casa_Nua: 'Casa Nua', 'galeria-visual': 'Galería visual', Doose: 'Doose' };
export const COLLAB = [{ full: 'DuanGomez/Doose', name: 'Doose', lang: 'SCSS', year: '2026', key: 'Doose' }];
export const ARCHIVE = [
  { full: 'SebastianGonzzalez/galeria-visual', name: 'Galería visual', lang: 'TypeScript', year: '2026', key: 'galeria-visual' },
  { full: 'SebastianGonzzalez/Casa_Nua', name: 'Casa Nua', lang: 'JavaScript', year: '2026', key: 'Casa_Nua' },
  ...COLLAB,
];
export function prettyRepo(n) { const s = n.replace(/[-_]+/g, ' ').trim(); return s.charAt(0).toUpperCase() + s.slice(1); }

export const TILES = ['HTML', 'CSS', 'JS', 'TS', 'React', 'Next', 'Git', 'Figma', '+'];
export const LEVELS = ['#CAC8C0', '#A6A39B', '#7A776F', '#4A4741', '#1C1A17'];
export const LANG_C = ['#1C1A17', '#5C5952', '#8E8B83', '#B9B6AE', '#D0CEC6'];

// Última lectura guardada; se reemplaza con datos en vivo de GitHub al cargar.
export const SNAP = {
  stamp: 0, live: false, repos: 2, archive: ARCHIVE,
  days: { '2026-05-02': [1, 1], '2026-05-04': [2, 2], '2026-09-24': [4, 4], '2026-09-25': [3, 3], '2026-09-26': [4, 4], '2026-10-05': [4, 4] },
  langs: [{ n: 'JavaScript', p: 37 }, { n: 'TypeScript', p: 25 }, { n: 'CSS', p: 25 }, { n: 'HTML', p: 13 }],
  commits: [
    { h: 'c0b694e', m: 'Remove duplicate features from README', repo: 'galeria-visual', d: '2026-10-06T04:08:27Z' },
    { h: '077d823', m: 'Revise README for clarity and additional details', repo: 'galeria-visual', d: '2026-10-06T04:07:23Z' },
    { h: 'fff7a3d', m: 'cambios finales', repo: 'Casa_Nua', d: '2026-10-06T03:50:23Z' },
    { h: '7fa3162', m: 'Update README.md', repo: 'galeria-visual', d: '2026-09-26T07:11:58Z' },
    { h: 'f17727b', m: 'Update README.md', repo: 'galeria-visual', d: '2026-09-26T07:07:05Z' },
    { h: '7961df8', m: 'Preparar galeria para GitHub Pages', repo: 'galeria-visual', d: '2026-09-26T06:41:48Z' },
  ],
};

export function isoDay(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

export const I18N = {
  es: {
    dockK: 'Encuéntrame en', dockHint: 'Pasa el cursor · clic para abrir', dockCopy: 'clic para copiar', s0: 'Inicio', s1: 'Enfoque', s2: 'Trabajo', s3: 'GitHub', s4: 'Laboratorio', s5: 'Archivo', s6: 'Contacto',
    loading: 'Portfolio · cargando', langAria: 'Cambiar idioma', talk: 'Hablemos', localTime: 'hora local',
    nav: ['Enfoque', 'Trabajo', 'GitHub', 'Laboratorio'],
    kicker: 'Ingeniería de Software · 4.º semestre',
    h1a: 'Construyo interfaces que se sienten ', h1b: 'bien.',
    hb1: 'Estudiante de Ingeniería de Software. Trabajo con ', and: ' y ', hb2: ' para convertir ideas en productos donde cada detalle tiene una razón.',
    isoK: 'Cómo construyo', isoHint: 'pasa el cursor',
    layers: [
      { t: 'Tú', d: 'Quien usa la interfaz: lo que ve, toca y siente.' },
      { t: 'Interacción', d: 'Motion, estados y feedback con intención.' },
      { t: 'Interfaz', d: 'Componentes accesibles, responsive y consistentes.' },
      { t: 'Fundamentos', d: 'Lógica, datos, rendimiento y todo lo que no se ve.' },
    ],
    enK: 'El enfoque', enT: 'Una capa entre el código y la sensación.',
    enD: 'Me interesa el punto exacto donde una línea de código se convierte en experiencia: el rebote de un botón, el ritmo de una transición, la jerarquía de una página.',
    dfK: 'La diferencia', dfT: 'Muchos programan pantallas. Yo diseño cómo se sienten.',
    dfD: 'Cada transición, estado y microinteracción existe por una razón: que usar algo sea más claro, más rápido y más agradable.',
    prK: 'Principios',
    pr: [
      { t: 'Criterio', d: 'Cada decisión tiene una razón, incluso las que nadie ve.', a: 'decisión → razón → código' },
      { t: 'Tacto', d: 'Una interfaz se juzga con las manos antes que con los ojos.', a: 'feedback < 100 ms' },
      { t: 'Detalle', d: 'Cuatro píxeles de diferencia también son diseño.', a: 'grid de 4 px' },
      { t: 'Constancia', d: 'Cada semestre, una versión mejor que la anterior.', a: '1 release / semestre' },
    ],
    wkK: 'Lo más reciente', wkT: 'Proyectos', wkAll: 'Ver todos', arK: 'Archivo', arT: 'Todos los proyectos.', arCount: 'proyectos', other2: 'Repositorio', repo: 'Ver repositorio',
    proj: [
      { kind: 'E-commerce', desc: 'Librería en línea para la entrega de Desarrollo Web: catálogo de libros, login y registro con transiciones.', ph: 'Captura — Casa Nua' },
      { kind: 'Sitio web', desc: 'Página para un estudio de tatuajes, construida en equipo con Duan Gómez.', ph: 'Captura — Doose' },
      { kind: 'Experimento', desc: 'Demo de una galería virtual: mi primera prueba seria con TypeScript.', ph: 'Captura — Galería visual' },
    ],
    cases: [
      { problem: 'Una tienda necesitaba vender en línea y controlar su inventario sin depender de hojas de cálculo ni de un equipo técnico.',
        role: 'Desarrollo completo del front-end: arquitectura, lógica de negocio e interfaz. Proyecto individual para Desarrollo Web.',
        built: ['Login y registro con roles (admin / cliente) y cuentas que el admin activa', 'Panel de administración de usuarios, productos, inventario y ventas', 'Carrito con validación de stock; al confirmar se descuenta el inventario', 'Historial de compras que conserva el precio histórico de cada línea'],
        decisions: 'JavaScript puro con ES Modules, dividido en 16 módulos (auth, storage, validators…), y localStorage como base de datos simulada. Cero dependencias.',
        result: '10 pantallas funcionales y responsive, publicadas en GitHub Pages con usuarios demo listos para probar.' },
      { problem: 'Un estudio de tatuajes necesitaba presentar sus estilos y su trabajo, y atraer clientes desde la web.',
        role: 'Trabajo en equipo con Duan Gómez: maquetación del front-end y sistema de estilos en SCSS.',
        built: ['Sitio con secciones de estilos, galería de trabajos y artistas', 'Sistema SCSS con variables, mixins y parciales reutilizables', 'Front-end conectado a un back-end con base de datos', 'Flujo de trabajo en equipo con Git sobre un repositorio compartido'],
        decisions: 'SCSS modular para mantener la consistencia visual entre páginas, y separación clara entre frontend y backend dentro del repositorio.',
        result: 'Proyecto colaborativo completo. Corre en local porque depende de la base de datos, por eso no tiene demo pública.' },
      { problem: 'Artistas y fotógrafos necesitan mostrar su obra de forma inmersiva, no en una cuadrícula genérica de imágenes.',
        role: 'Proyecto personal: diseño de la interacción, desarrollo y despliegue.',
        built: ['Rueda 3D de obras que se recorre con el scroll', 'Pantalla de carga e introducción animadas', 'Página propia para cada obra con ruta dinámica /obra/[id]', 'Contenido centralizado en un solo archivo de datos, fácil de editar'],
        decisions: 'Next.js + TypeScript estricto + Tailwind. Exportación estática y despliegue automático con GitHub Actions.',
        result: 'Publicada en GitHub Pages y reutilizable como base para portafolios visuales. Mi primer proyecto serio en TypeScript.' },
    ],
    cProb: 'El problema', cRole: 'Mi rol', cBuilt: 'Qué construí', cDec: 'Decisiones técnicas', cRes: 'Resultado', cHint: 'Ver caso', cTip: 'Clic para ver el caso completo',
    ghK: 'Actividad en GitHub', ghT: 'Constancia, medida en commits.',
    stTotal: 'Contribuciones', stStreak: 'Racha más larga', stDays: 'días', stActive: 'Días activos', stRepos: 'Repos públicos',
    ghNote: 'Datos reales de github.com/SebastianGonzzalez · se actualizan al cargar', ghLive: 'en vivo', ghSnap: 'última lectura', less: 'Menos', more2: 'Más', langs: 'Lenguajes',
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], tipMany: 'contribuciones', tipOne: 'contribución', tipNone: 'Sin contribuciones',
    labK: 'Laboratorio', labT: 'Pequeños experimentos que funcionan.',
    e1: 'Arrastrar', e1d: 'Pointer events + transform, sin dependencias. El interruptor apaga el movimiento de toda la página.',
    e2: 'Peso variable', e2d: 'Una fuente variable que responde a la distancia del cursor.',
    e3: 'Magnético', e3d: 'Te sigue dentro de su zona y vuelve con un resorte.',
    pSend: 'Enviar mensaje', pMotion: 'Movimiento', pNote: 'Cada pieza es un componente real.', touch: 'Tócame', clicks: 'clics',
    ctK: 'Contacto', ctT1: '¿Construimos algo que se sienta ', ctT2: 'bien?',
    ctD: 'Busco prácticas, proyectos y gente con quien aprender. Escríbeme y te respondo pronto.',
    copied: 'Copiado ✓', footer: '© 2026 Sebastián González · Hecho a mano con Next.js', top: 'Volver arriba ↑',
  },
  en: {
    dockK: 'Find me on', dockHint: 'Hover · click to open', dockCopy: 'click to copy', s0: 'Home', s1: 'Approach', s2: 'Work', s3: 'GitHub', s4: 'Lab', s5: 'Archive', s6: 'Contact',
    loading: 'Portfolio · loading', langAria: 'Switch language', talk: "Let's talk", localTime: 'local time',
    nav: ['Approach', 'Work', 'GitHub', 'Lab'],
    kicker: 'Software Engineering · 4th semester',
    h1a: 'I build interfaces that feel ', h1b: 'right.',
    hb1: 'Software Engineering student. I work with ', and: ' and ', hb2: ' to turn ideas into products where every detail has a reason.',
    isoK: 'How I build', isoHint: 'hover to explode',
    layers: [
      { t: 'You', d: 'Whoever uses the interface: what they see, touch and feel.' },
      { t: 'Interaction', d: 'Motion, states and feedback with intent.' },
      { t: 'Interface', d: 'Accessible, responsive, consistent components.' },
      { t: 'Foundations', d: 'Logic, data, performance and everything unseen.' },
    ],
    enK: 'The approach', enT: 'A layer between code and feeling.',
    enD: "I care about the exact point where a line of code becomes an experience: a button's bounce, a transition's rhythm, a page's hierarchy.",
    dfK: 'The difference', dfT: 'Many people code screens. I design how they feel.',
    dfD: 'Every transition, state and micro-interaction exists for a reason: to make using something clearer, faster and more pleasant.',
    prK: 'Principles',
    pr: [
      { t: 'Judgment', d: 'Every decision has a reason, even the ones nobody sees.', a: 'decision → reason → code' },
      { t: 'Touch', d: 'An interface is judged by the hands before the eyes.', a: 'feedback < 100 ms' },
      { t: 'Detail', d: 'Four pixels of difference are design too.', a: '4 px grid' },
      { t: 'Consistency', d: 'Every semester, a better version than the last.', a: '1 release / semester' },
    ],
    wkK: 'Latest work', wkT: 'Projects', wkAll: 'See all', arK: 'Archive', arT: 'Every project.', arCount: 'projects', other2: 'Repository', repo: 'View repository',
    proj: [
      { kind: 'E-commerce', desc: 'Online bookstore for my Web Development course: book catalog, login and sign-up with transitions.', ph: 'Screenshot — Casa Nua' },
      { kind: 'Website', desc: 'Site for a tattoo studio, built together with Duan Gómez.', ph: 'Screenshot — Doose' },
      { kind: 'Experiment', desc: 'Virtual gallery demo — my first serious TypeScript project.', ph: 'Screenshot — Visual gallery' },
    ],
    cases: [
      { problem: 'A store needed to sell online and track its inventory without relying on spreadsheets or a technical team.',
        role: 'Full front-end development: architecture, business logic and interface. Solo project for Web Development.',
        built: ['Login and sign-up with roles (admin / customer) and admin-approved accounts', 'Admin panel for users, products, inventory and sales', 'Cart with stock validation; confirming a purchase updates inventory', 'Purchase history that keeps the historical price of each line'],
        decisions: 'Vanilla JavaScript with ES Modules, split into 16 modules (auth, storage, validators…), with localStorage as a simulated database. Zero dependencies.',
        result: '10 working, responsive screens, live on GitHub Pages with demo users ready to try.' },
      { problem: 'A tattoo studio needed to present its styles and work, and attract clients from the web.',
        role: 'Team project with Duan Gómez: front-end layout and the SCSS styling system.',
        built: ['Site with sections for styles, portfolio and artists', 'SCSS system with variables, mixins and reusable partials', 'Front-end connected to a back-end with a database', 'Team workflow with Git on a shared repository'],
        decisions: 'Modular SCSS to keep visuals consistent across pages, and a clear frontend / backend split in the repo.',
        result: 'Complete team project. It runs locally because it depends on the database, so there is no public demo.' },
      { problem: 'Artists and photographers need to show their work in an immersive way, not in a generic image grid.',
        role: 'Personal project: interaction design, development and deployment.',
        built: ['3D wheel of works you browse by scrolling', 'Animated loading screen and intro', 'Dedicated page per work with dynamic route /obra/[id]', 'Content centralised in one easy-to-edit data file'],
        decisions: 'Next.js + strict TypeScript + Tailwind. Static export and automatic deployment with GitHub Actions.',
        result: 'Live on GitHub Pages and reusable as a base for visual portfolios. My first serious TypeScript project.' },
    ],
    cProb: 'The problem', cRole: 'My role', cBuilt: 'What I built', cDec: 'Technical decisions', cRes: 'Outcome', cHint: 'View case', cTip: 'Click to see the full case',
    ghK: 'GitHub activity', ghT: 'Consistency, measured in commits.',
    stTotal: 'Contributions', stStreak: 'Longest streak', stDays: 'days', stActive: 'Active days', stRepos: 'Public repos',
    ghNote: 'Real data from github.com/SebastianGonzzalez · refreshed on load', ghLive: 'live', ghSnap: 'last read', less: 'Less', more2: 'More', langs: 'Languages',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], tipMany: 'contributions', tipOne: 'contribution', tipNone: 'No contributions',
    labK: 'Lab', labT: 'Small experiments that actually work.',
    e1: 'Drag', e1d: 'Pointer events + transform, no dependencies. The switch turns off motion for the whole page.',
    e2: 'Variable weight', e2d: 'A variable font that responds to cursor distance.',
    e3: 'Magnetic', e3d: 'Follows you inside its zone and springs back.',
    pSend: 'Send message', pMotion: 'Motion', pNote: 'Every piece is a real component.', touch: 'Touch me', clicks: 'clicks',
    ctK: 'Contact', ctT1: 'Shall we build something that feels ', ctT2: 'right?',
    ctD: "I'm looking for internships, projects and people to learn with. Write to me and I'll get back soon.",
    copied: 'Copied ✓', footer: '© 2026 Sebastián González · Handmade with Next.js', top: 'Back to top ↑',
  },
};

export function buildYear(year, lang, days) {
  const T = I18N[lang];
  const jan1 = new Date(year, 0, 1), off = jan1.getDay();
  const today = new Date();
  const cells = [];
  let total = 0, streak = 0, best = 0, active = 0;
  for (let w = 0; w < 53; w++) for (let d = 0; d < 7; d++) {
    const date = new Date(year, 0, 1 + w * 7 + d - off);
    if (date.getFullYear() !== year) { cells.push({ bg: 'transparent', bd: '0', tip: '' }); continue; }
    if (date > today) { cells.push({ bg: 'transparent', bd: '1px dashed #B4B1A9', tip: '' }); continue; }
    const e = days[isoDay(date)], n = e ? e[0] : 0;
    total += n;
    if (n) { active++; streak++; best = Math.max(best, streak); } else streak = 0;
    const lv = n ? Math.min(4, Math.max(1, e[1] || 1)) : 0;
    const ds = date.toLocaleDateString(lang === 'es' ? 'es' : 'en', { day: 'numeric', month: 'short' });
    cells.push({ bg: LEVELS[lv], bd: '0', tip: n ? `${n} ${n === 1 ? T.tipOne : T.tipMany} · ${ds}` : `${T.tipNone} · ${ds}` });
  }
  const months = T.months.map((l, m) => {
    const doy = Math.round((new Date(year, m, 1) - jan1) / 864e5);
    return { l, col: String(Math.floor((doy + off) / 7) + 1) };
  });
  return { cells, months, total, streak: best, active };
}
