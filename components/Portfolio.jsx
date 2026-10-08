'use client';
import React, { useEffect, useRef, useState } from 'react';
import TechText from './TechText';
import {
  PROJECTS, HREFS, NAMES, COLLAB, ARCHIVE, prettyRepo, TILES, LANG_C, SNAP, I18N, GH_USER, EMAIL, buildYear,
} from '@/lib/data';

// Inline CSS text → React style object (cached). Keeps the design's inline styles verbatim.
const cache = new Map();
function css(text) {
  let o = cache.get(text);
  if (o) return o;
  o = {};
  let depth = 0, start = 0;
  const decls = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ';' && depth === 0) { decls.push(text.slice(start, i)); start = i + 1; }
  }
  decls.push(text.slice(start));
  for (const d of decls) {
    const k = d.indexOf(':');
    if (k < 0) continue;
    const prop = d.slice(0, k).trim();
    if (!prop) continue;
    const key = prop.startsWith('-webkit-')
      ? 'Webkit' + prop.slice(8).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase())
      : prop.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
    o[key] = d.slice(k + 1).trim();
  }
  if (cache.size < 2000) cache.set(text, o);
  return o;
}

const GLASS = 'background:rgba(255,255,255,.8);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(28,26,23,.08);box-shadow:0 1px 2px rgba(28,26,23,.06),0 8px 24px rgba(28,26,23,.06)';
const KICK = "font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5C5952";
const LABEL = "font-family:var(--font-mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#5C5952";
const CASE_K = "font-family:var(--font-mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#5C5952";
const CASE_V = 'font-size:14.5px;line-height:1.55;color:#3E3B36;text-wrap:pretty';
const SECTION = 'position:relative;background:#FFFFFF;box-shadow:0 -28px 56px -28px rgba(28,26,23,.22);padding:clamp(88px,11vw,140px) clamp(20px,4vw,56px) clamp(72px,10vw,128px)';
const H2 = "margin:0;font-family:var(--font-serif);font-weight:500;font-size:clamp(44px,5.4vw,76px);line-height:.98;letter-spacing:-.025em;text-wrap:balance";
const STAT_N = "font-family:var(--font-serif);font-size:48px;line-height:1;letter-spacing:-.02em";
const CHIP = "display:inline-flex;align-items:center;gap:6px;padding:0 8px;margin:0 2px;border:1px dashed #9C998F;border-radius:6px;background:#F2F2F0;font-family:var(--font-mono);font-size:13px;color:#1C1A17;line-height:24px";
const EASE = 'cubic-bezier(.22,1,.36,1)';

const CORNER_POS = {
  tl: 'left:-1px;top:-1px;border-left:1.5px solid #1C1A17;border-top:1.5px solid #1C1A17',
  tr: 'right:-1px;top:-1px;border-right:1.5px solid #1C1A17;border-top:1.5px solid #1C1A17',
  bl: 'left:-1px;bottom:-1px;border-left:1.5px solid #1C1A17;border-bottom:1.5px solid #1C1A17',
  br: 'right:-1px;bottom:-1px;border-right:1.5px solid #1C1A17;border-bottom:1.5px solid #1C1A17',
};
function Corners({ at = 'tl tr bl br', size = 8 }) {
  return at.split(' ').map((k) => <span key={k} style={css(`position:absolute;width:${size}px;height:${size}px;${CORNER_POS[k]}`)} />);
}

function Divider({ num, label }) {
  return (
    <div data-divider="" aria-hidden="true" style={css('position:absolute;left:0;right:0;top:0;z-index:4;pointer-events:none')}>
      <span data-line="" style={css('position:absolute;left:0;right:0;top:0;border-top:1px dashed #8E8B83;transform-origin:left center')} />
      <span data-tab="" style={css("position:absolute;left:clamp(20px,4vw,56px);top:0;display:flex;gap:10px;padding:8px 12px;border:1px dashed #8E8B83;border-top:0;background:#FFFFFF;font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#5C5952")}>
        <span style={{ color: '#1C1A17' }}>{num}</span><span>/ 07</span><span>{label}</span>
      </span>
      <span data-tab="" style={css('position:absolute;right:clamp(20px,4vw,56px);top:-4px;width:8px;height:8px;border-right:1.5px solid #1C1A17;border-top:1.5px solid #1C1A17;transform:translateY(4px)')} />
    </div>
  );
}

const Dim = () => <div data-dim="" aria-hidden="true" style={css('position:absolute;inset:0;z-index:6;background:#1C1A17;opacity:0;pointer-events:none')} />;

// Image with a fallback (replaces the design tool's <image-slot>). Give it key={src} so a new src starts fresh.
function Shot({ src, fallback, alt, fit = 'cover', placeholder }) {
  const [cur, setCur] = useState(src);
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  const fail = () => { if (fallback && cur !== fallback) setCur(fallback); else setFailed(true); };
  // An error during SSR hydration fires before React attaches onError.
  useEffect(() => { const im = ref.current; if (im && im.complete && im.naturalWidth === 0) fail(); });
  if (failed) {
    return <div className="img-fill" style={css("display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(135deg,#2A2724 0 1px,transparent 1px 8px);font-family:var(--font-mono);font-size:11px;color:#A29F97")}>{placeholder}</div>;
  }
  return (
      <img ref={ref} className="img-fill" src={cur} alt={alt || ''} loading="lazy" decoding="async" onError={fail} data-fallback={cur !== src ? '' : undefined} style={{ objectFit: fit }} />
  );
}

// Unsplash attribution. Lives outside the screenshot link (no nested <a>); hidden by CSS once the image falls back.
function Credit({ name, href }) {
  if (!name) return null;
  const utm = 'utm_source=portfolio&utm_medium=referral';
  return <span className="credit">Photo by <a href={href + '?' + utm} target="_blank" rel="noopener">{name}</a> on <a href={'https://unsplash.com/?' + utm} target="_blank" rel="noopener">Unsplash</a></span>;
}

function Layer({ z, top, left = 0, width, height, pad, title, desc, size = 26, dsize = '12.5px', corners = 'tl br' }) {
  return (
    <div data-z={z} style={css(`position:absolute;left:${left}px;top:${top}px;width:${width}px;height:${height}px;transform-style:preserve-3d;transition:transform 700ms ${EASE}`)}>
      <div style={css('position:absolute;inset:0;border:1px dashed #B9B6AE;transform:translateZ(-28px)')} />
      <div className="h-face" style={css(`position:absolute;inset:0;border:1px dashed #8E8B83;background:rgba(244,244,242,.72);padding:${pad};display:flex;flex-direction:column;justify-content:flex-end;gap:4px;transition:background 240ms ease-out`)}>
        <Corners at={corners} />
        <span style={css(`font-family:var(--font-serif);font-size:${size}px;line-height:1`)}>{title}</span>
        <span style={css(`font-size:${dsize};color:#5C5952`)}>{desc}</span>
      </div>
    </div>
  );
}

export default class Portfolio extends React.Component {
  state = { feat: 0, sec: 0, lang: 'es', wide: true, time: '', copied: false, motionOn: true, clicks: 0, dockHover: -1, gh: SNAP, mounted: false };
  root = React.createRef(); pre = React.createRef(); preNum = React.createRef(); preBar = React.createRef();
  isoStage = React.createRef(); isoGroup = React.createRef(); ghWrap = React.createRef(); ghTip = React.createRef();
  weightBox = React.createRef(); secLabelEl = React.createRef(); progRing = React.createRef(); dockRef = React.createRef(); projGrid = React.createRef();
  z = 10; ghCache = {};

  get email() { return this.props.email ?? EMAIL; }

  componentDidMount() {
    const w = window;
    this.dead = false; // StrictMode remounts after componentWillUnmount set it
    this._lang = this.state.lang;
    this.prefersReduced = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.motion = (this.props.motion ?? true) && !this.prefersReduced;
    this.onResize = () => { const wide = w.innerWidth >= 960; if (wide !== this.state.wide) this.setState({ wide }); this.isoScale(); this.applyIso(); };
    this._mv = (e) => this.onDragMove(e); this._up = () => this.onDragUp();
    w.addEventListener('resize', this.onResize); w.addEventListener('pointermove', this._mv); w.addEventListener('pointerup', this._up);
    this.setState({ mounted: true });
    this.tick(); this.clock = setInterval(this.tick, 15000);
    this.rx = 0; this.ry = 0; this.spread = 0;
    this.onResize();
    this.initReveal(); this.runIntro(); this.initStack(); this.loadGitHub();
  }

  componentWillUnmount() {
    const w = window;
    this.dead = true;
    // Listeners and timers first: nothing that could throw runs before them.
    w.removeEventListener('resize', this.onResize); w.removeEventListener('pointermove', this._mv); w.removeEventListener('pointerup', this._up);
    w.removeEventListener('scroll', this.onScrollS);
    clearInterval(this.clock); clearTimeout(this.cpT);
    cancelAnimationFrame(this.wRaf); cancelAnimationFrame(this.dRaf); cancelAnimationFrame(this.sRaf);
    if (this.io) this.io.disconnect();
    if (this.ro) this.ro.disconnect(); if (this.dio) this.dio.disconnect();
    if (this.root.current) this.root.current.removeEventListener('click', this.onAnchor);
  }

  componentDidUpdate() {
    if (this._lang !== this.state.lang) { this._lang = this.state.lang; document.documentElement.lang = this.state.lang; }
    if (this._sec !== this.state.sec) {
      const first = this._sec === undefined; this._sec = this.state.sec;
      const el = this.secLabelEl.current;
      if (!first && el && el.animate && this.motion) el.animate([{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 420, easing: EASE });
    }
  }

  async loadGitHub() {
    const j = (u) => fetch(u).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const y = new Date().getFullYear();
    const [cal, repos] = await Promise.all([j(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=${y}`), j(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`)]);
    const next = {};
    if (cal && Array.isArray(cal.contributions)) { const days = {}; cal.contributions.forEach((d) => { if (d.count) days[d.date] = [d.count, d.level]; }); next.days = days; }
    if (Array.isArray(repos)) {
      const own = repos.filter((r) => !r.fork);
      next.repos = own.length;
      const arch = own.filter((r) => r.name !== GH_USER).map((r) => ({ full: r.full_name, key: r.name, name: NAMES[r.name] || prettyRepo(r.name), lang: r.language || '—', year: String(new Date(r.created_at).getFullYear()) }));
      COLLAB.forEach((c) => { if (!arch.some((a) => a.full === c.full)) arch.push(c); });
      if (arch.length) next.archive = arch;
      const [langs, commits] = await Promise.all([
        Promise.all(own.map((r) => j(r.languages_url))),
        Promise.all(own.map((r) => j(`https://api.github.com/repos/${r.full_name}/commits?per_page=10`).then((c) => (Array.isArray(c) ? c.map((x) => ({ h: x.sha.slice(0, 7), m: x.commit.message.split('\n')[0], repo: r.name, d: x.commit.author.date })) : [])))),
      ]);
      const bytes = {};
      langs.forEach((l) => l && Object.entries(l).forEach(([k, v]) => { bytes[k] = (bytes[k] || 0) + v; }));
      const sum = Object.values(bytes).reduce((a, b) => a + b, 0);
      if (sum) {
        const arr = Object.entries(bytes).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, v]) => ({ n, p: Math.round((v / sum) * 100) }));
        arr[0].p += 100 - arr.reduce((a, b) => a + b.p, 0);
        next.langs = arr.filter((l) => l.p > 0);
      }
      const flat = commits.flat().sort((a, b) => (a.d < b.d ? 1 : -1)).slice(0, 6);
      if (flat.length) next.commits = flat;
    }
    if (!this.dead && Object.keys(next).length) this.setState((p) => ({ gh: { ...p.gh, ...next, live: true, stamp: Date.now() } }));
  }

  initStack() {
    this.stackOn = this.props.stackSections ?? true;
    this.layoutStack();
    window.addEventListener('scroll', this.onScrollS, { passive: true });
    this.root.current.addEventListener('click', this.onAnchor);
    if ('ResizeObserver' in window) { this.ro = new ResizeObserver(() => { this.layoutStack(); this.stackFrame(); }); this.ro.observe(this.root.current); }
    const divs = [...this.root.current.querySelectorAll('[data-divider]')];
    if (this.motion && 'IntersectionObserver' in window) {
      const vh = window.innerHeight;
      this.dio = new IntersectionObserver((ents) => ents.forEach((en) => {
        if (!en.isIntersecting) return;
        const d = en.target, line = d.querySelector('[data-line]'), tabs = d.querySelectorAll('[data-tab]');
        line.style.transition = 'transform 1100ms cubic-bezier(.76,0,.24,1)'; line.style.transform = 'scaleX(1)';
        tabs.forEach((tb, i) => { tb.style.transition = `opacity 500ms ease-out ${550 + i * 200}ms, clip-path 700ms cubic-bezier(.76,0,.24,1) ${550 + i * 200}ms`; tb.style.opacity = '1'; tb.style.clipPath = 'inset(0 0 0 0)'; });
        this.dio.unobserve(d);
      }), { rootMargin: '0px 0px -12% 0px' });
      divs.forEach((d) => {
        if (d.getBoundingClientRect().top < vh * 0.88) return;
        d.querySelector('[data-line]').style.transform = 'scaleX(0)';
        d.querySelectorAll('[data-tab]').forEach((tb) => { tb.style.opacity = '0'; tb.style.clipPath = 'inset(0 0 100% 0)'; });
        this.dio.observe(d);
      });
    }
    this.stackFrame();
  }

  onScrollS = () => { if (this.sRaf) return; this.sRaf = requestAnimationFrame(() => { this.sRaf = 0; this.stackFrame(); }); };

  // Sticky stacking breaks native anchor offsets: scroll to the sum of the previous sections instead.
  onAnchor = (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const i = (this.secs || []).findIndex((s) => s.id === id); if (i < 0) return;
    e.preventDefault();
    const cont = this.secs[0].parentElement;
    let y = cont.getBoundingClientRect().top + window.scrollY;
    for (let k = 0; k < i; k++) y += this.secs[k].offsetHeight;
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: this.motion ? 'smooth' : 'auto' });
  };

  layoutStack() {
    const vh = window.innerHeight;
    this.secs = [...this.root.current.querySelectorAll('[data-stack]')];
    // Read every height before writing any style, so the browser lays out once instead of once per section.
    const tops = this.secs.map((s) => Math.min(0, vh - s.offsetHeight));
    this.secs.forEach((s, i) => {
      s._dim = s.querySelector(':scope > [data-dim]');
      if (!this.stackOn) { s.style.position = 'relative'; s.style.top = ''; return; }
      s.style.position = 'sticky'; s.style.top = tops[i] + 'px'; s.style.zIndex = String(i + 1);
      s.style.transformOrigin = `50% ${Math.round(-tops[i] + vh / 2)}px`;
    });
  }

  stackFrame() {
    const secs = this.secs || [], vh = window.innerHeight;
    const ring = this.progRing.current;
    if (ring) {
      const max = document.documentElement.scrollHeight - vh; const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0; const d = p * 360;
      ring.style.background = p < 0.003 ? 'none' : `conic-gradient(#1C1A17 0deg, #1C1A17 ${Math.max(0, d - 56).toFixed(1)}deg, #E5E5E3 ${Math.max(0, d - 12).toFixed(1)}deg, #1C1A17 ${d.toFixed(1)}deg, transparent ${d.toFixed(1)}deg)`;
    }
    let cur = 0;
    for (let i = 0; i < secs.length; i++) {
      const s = secs[i];
      if (s.getBoundingClientRect().top <= vh * 0.5) cur = i;
      if (i === secs.length - 1 || !this.stackOn) continue;
      const nt = secs[i + 1].getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (vh - nt) / vh));
      const prev = s._p;
      if (p === prev) continue;
      s._p = p;
      if (this.motion) {
        s.style.transform = p > 0 ? `perspective(1800px) rotateX(${(p * 6).toFixed(2)}deg) scale(${(1 - p * 0.07).toFixed(4)})` : '';
        s.style.willChange = p > 0 && p < 1 ? 'transform' : '';
      } else s.style.transform = '';
      if (s._dim) s._dim.style.opacity = (p * 0.3).toFixed(3);
      if (i === 0) { this.heroP = p; if (!this.hoverIso && this.motion && (p > 0 || prev > 0)) { this.spread = p * 2.6; this.applyIso(); } }
    }
    if (cur !== this.state.sec) this.setState({ sec: cur });
  }

  tick = () => { this.setState({ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }); };

  isoScale() { const st = this.isoStage.current; if (!st) return; this.sc = Math.min(1, (st.offsetWidth - 8) / 600, (st.offsetHeight - 40) / 580); }
  applyIso() {
    const g = this.isoGroup.current; if (!g) return;
    g.style.transform = `translate(-50%,-50%) scale(${(this.sc || 1).toFixed(3)}) rotateX(${(14 - this.ry).toFixed(2)}deg) rotateY(${(-26 + this.rx).toFixed(2)}deg) rotateZ(-7deg)`;
    g.querySelectorAll('[data-z]').forEach((el) => { el.style.transform = `translateZ(${(+el.dataset.z * this.spread * 20).toFixed(1)}px)`; });
  }
  isoMove = (e) => {
    if (!this.motion) return;
    const st = this.isoStage.current, r = st.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    this.hoverIso = true; this.rx = nx * 12; this.ry = ny * 8; this.spread = Math.max(1, (this.heroP || 0) * 2.6); this.applyIso();
  };
  isoLeave = () => { this.hoverIso = false; this.rx = 0; this.ry = 0; this.spread = this.motion ? (this.heroP || 0) * 2.6 : 0; this.applyIso(); };

  runIntro() {
    const pre = this.pre.current; if (!pre) return;
    const intro = [...this.root.current.querySelectorAll('[data-intro]')];
    const g = this.isoGroup.current;
    let seen = false; try { seen = !!sessionStorage.getItem('sg3-intro'); } catch (e) {}
    if (!this.motion) { pre.style.display = 'none'; return; }
    intro.forEach((el) => { el.style.opacity = '0'; el.style.filter = 'blur(10px)'; el.style.transform = 'translateY(18px)'; });
    if (g) { g.style.opacity = '0'; this.spread = 4; this.applyIso(); }
    const reveal = () => {
      intro.forEach((el, i) => {
        el.style.transition = `opacity 900ms ${EASE} ${i * 90}ms, filter 900ms ${EASE} ${i * 90}ms, transform 900ms ${EASE} ${i * 90}ms`;
        el.style.opacity = '1'; el.style.filter = 'none'; el.style.transform = 'none';
      });
      if (g) {
        g.style.transition = `opacity 900ms ease-out, transform 700ms ${EASE}`;
        g.style.opacity = '1';
        const zs = [...g.querySelectorAll('[data-z]')];
        zs.forEach((el) => { el.style.transition = `transform 1400ms ${EASE} ${300 + (4 - +el.dataset.z) * 90}ms`; });
        setTimeout(() => { this.spread = 0; this.applyIso(); }, 60);
        setTimeout(() => zs.forEach((el) => { el.style.transition = `transform 700ms ${EASE}`; }), 2200);
      }
    };
    if (seen || !(this.props.preloader ?? true)) { pre.style.display = 'none'; requestAnimationFrame(() => requestAnimationFrame(reveal)); return; }
    try { sessionStorage.setItem('sg3-intro', '1'); } catch (e) {}
    const t0 = performance.now(), D = 1200;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
      if (this.preNum.current) this.preNum.current.textContent = String(Math.round(e * 100)).padStart(3, '0');
      if (this.preBar.current) this.preBar.current.style.transform = `scaleX(${e})`;
      if (k < 1) return requestAnimationFrame(step);
      pre.style.transition = 'opacity 600ms ease-out, filter 600ms ease-out';
      pre.style.opacity = '0'; pre.style.filter = 'blur(8px)';
      setTimeout(reveal, 120);
      setTimeout(() => { pre.style.display = 'none'; }, 620);
    };
    requestAnimationFrame(step);
  }

  initReveal() {
    if (!this.motion || !('IntersectionObserver' in window)) return;
    const vh = window.innerHeight;
    this.io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.style.transition = `opacity 900ms ${EASE}, filter 900ms ${EASE}, transform 900ms ${EASE}, background 260ms ease-out`;
        el.style.opacity = '1'; el.style.filter = 'none'; el.style.transform = 'none';
        this.io.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    this.root.current.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top > vh) { el.style.opacity = '0'; el.style.filter = 'blur(8px)'; el.style.transform = 'translateY(28px)'; this.io.observe(el); }
    });
  }

  ghOver = (e) => {
    const tip = e.target && e.target.dataset ? e.target.dataset.tip : '';
    const t = this.ghTip.current, wrap = this.ghWrap.current; if (!t || !wrap) return;
    if (!tip) { t.style.opacity = '0'; return; }
    const wr = wrap.getBoundingClientRect(), cr = e.target.getBoundingClientRect(), s = wr.width / wrap.offsetWidth || 1;
    t.textContent = tip; t.style.opacity = '1';
    const x = (cr.left - wr.left) / s + 6 - t.offsetWidth / 2, y = (cr.top - wr.top) / s - 34;
    t.style.transform = `translate(${Math.max(0, Math.min(wrap.offsetWidth - t.offsetWidth, x))}px, ${y}px)`;
  };
  ghOut = () => { if (this.ghTip.current) this.ghTip.current.style.opacity = '0'; };

  startDrag = (e) => {
    const el = e.currentTarget, s = el.getBoundingClientRect().width / el.offsetWidth || 1;
    this.moved = false;
    this.d = { el, sx: e.clientX, sy: e.clientY, bx: +el.dataset.tx || 0, by: +el.dataset.ty || 0, s };
    el.style.transition = 'box-shadow 160ms ease-out'; el.style.zIndex = ++this.z; el.style.cursor = 'grabbing';
    el.style.boxShadow = '0 16px 36px rgba(28,26,23,.2)';
    e.preventDefault();
  };
  onDragMove(e) {
    const d = this.d; if (!d) return;
    const dx = (e.clientX - d.sx) / d.s, dy = (e.clientY - d.sy) / d.s;
    if (Math.abs(dx) + Math.abs(dy) > 3) this.moved = true;
    d.tx = d.bx + dx; d.ty = d.by + dy;
    const tilt = this.motion ? Math.max(-7, Math.min(7, (e.movementX || 0) * 0.6)) : 0;
    d.el.style.transform = `translate(${d.tx}px,${d.ty}px) rotate(${tilt}deg) scale(1.03)`;
  }
  onDragUp() {
    const d = this.d; if (!d) return;
    const tx = d.tx ?? d.bx, ty = d.ty ?? d.by;
    d.el.dataset.tx = tx; d.el.dataset.ty = ty;
    d.el.style.transition = `transform 360ms ${EASE}, box-shadow 360ms ${EASE}`;
    d.el.style.transform = `translate(${tx}px,${ty}px)`; d.el.style.cursor = 'grab'; d.el.style.boxShadow = '';
    this.d = null;
  }
  toggleMotion = (e) => {
    if (this.moved && e.detail > 0) return; // a drag ends in a click; keyboard clicks have detail 0
    const on = !this.state.motionOn;
    this.motion = on && !this.prefersReduced && (this.props.motion ?? true);
    if (!this.motion) this.isoLeave();
    this.setState({ motionOn: on });
  };

  enterW = () => {
    const box = this.weightBox.current; if (!box) return;
    this.wS = box.getBoundingClientRect().width / box.offsetWidth || 1;
    this.wRects = [...box.querySelectorAll('[data-l]')].map((el) => { const r = el.getBoundingClientRect(); return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; });
  };
  moveW = (e) => {
    const x = e.clientX, y = e.clientY;
    cancelAnimationFrame(this.wRaf);
    this.wRaf = requestAnimationFrame(() => {
      if (!this.wRects) this.enterW();
      const R = 170 * (this.wS || 1);
      for (const l of this.wRects || []) { const t = Math.max(0, 1 - Math.hypot(x - l.cx, y - l.cy) / R); l.el.style.fontWeight = Math.round(200 + 700 * t * t * (3 - 2 * t)); }
    });
  };
  leaveW = () => { cancelAnimationFrame(this.wRaf); (this.wRects || []).forEach((l) => { l.el.style.fontWeight = ''; }); this.wRects = null; };

  magMove = (e) => {
    if (!this.motion) return;
    const wrap = e.currentTarget, m = wrap.querySelector('[data-mag]'); if (!m) return;
    const r = wrap.getBoundingClientRect(), s = r.width / wrap.offsetWidth || 1;
    const dx = (e.clientX - (r.left + r.width / 2)) / s, dy = (e.clientY - (r.top + r.height / 2)) / s;
    m.style.transition = `transform 220ms ${EASE}`; m.style.transform = `translate(${dx * 0.32}px, ${dy * 0.32}px)`;
  };
  magLeave = (e) => { const m = e.currentTarget.querySelector('[data-mag]'); if (!m) return; m.style.transition = 'transform 700ms cubic-bezier(.34,1.56,.64,1)'; m.style.transform = 'translate(0,0)'; };

  dockMove = (e) => { this.dmx = e.clientX; this.dockKick(); };
  dockLeave = () => { this.dmx = null; this.dockKick(); if (this.state.dockHover !== -1) this.setState({ dockHover: -1 }); };
  dockKick() { if (!this.dRaf) this.dRaf = requestAnimationFrame(this.dockStep); }
  dockStep = () => {
    this.dRaf = 0; const box = this.dockRef.current; if (!box) return;
    const items = [...box.querySelectorAll('[data-dock]')], sc = box.getBoundingClientRect().width / box.offsetWidth || 1;
    if (!this.dw || this.dw.length !== items.length) this.dw = items.map(() => ({ w: 52, v: 0 }));
    let busy = false;
    items.forEach((el, i) => {
      let target = 52;
      if (this.dmx != null && this.motion) { const r = el.getBoundingClientRect(); const dist = Math.abs(this.dmx - (r.left + r.width / 2)) / sc; if (dist < 150) target = 52 + 34 * (Math.cos((dist / 150) * Math.PI) + 1) / 2; }
      const st = this.dw[i]; st.v = st.v * 0.62 + (target - st.w) * 0.28; st.w += st.v;
      if (Math.abs(target - st.w) > 0.15 || Math.abs(st.v) > 0.15) busy = true;
      el.style.width = el.style.height = st.w.toFixed(2) + 'px';
    });
    if (busy) this.dockKick();
  };

  mq(e, on) {
    const row = e.currentTarget, ov = row && row.querySelector('[data-mq]'); if (!ov) return;
    const inner = ov.firstElementChild, track = inner.firstElementChild;
    const r = row.getBoundingClientRect();
    const top = e.clientY == null || e.clientY === 0 ? true : e.clientY - r.top < r.height / 2;
    const off = top ? 'translateY(-101%)' : 'translateY(101%)', inv = top ? 'translateY(101%)' : 'translateY(-101%)';
    const dur = this.motion ? 600 : 0;
    const go = (el, from, to) => {
      let cur = from || getComputedStyle(el).transform; if (!cur || cur === 'none') cur = 'translateY(0)';
      el.getAnimations().forEach((a) => a.cancel());
      el.animate([{ transform: cur }, { transform: to }], { duration: dur, easing: EASE, fill: 'forwards' });
    };
    if (on) {
      go(ov, off, 'translateY(0)'); go(inner, inv, 'translateY(0)');
      if (this.motion && !track._mq && track.animate) { const w = track.scrollWidth / 2; track._mq = track.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: Math.max(9000, (w / 80) * 1000), iterations: Infinity }); }
      if (track._mq) track._mq.play();
    } else { go(ov, null, off); go(inner, null, inv); }
  }
  mqEnter = (e) => this.mq(e, true);
  mqLeave = (e) => this.mq(e, false);

  pickProject(i) {
    if (i === this.state.feat) return;
    const g = this.projGrid.current, anim = this.motion && g && g.animate;
    const commit = () => { this.setState({ feat: i }); requestAnimationFrame(() => requestAnimationFrame(() => {
      if (this._pf) { this._pf.cancel(); this._pf = null; }
      if (!g) return;
      if (anim) g.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: EASE });
      const r = g.getBoundingClientRect();
      if (r.top < 70) window.scrollBy({ top: r.top - 110, behavior: anim ? 'smooth' : 'auto' });
    })); };
    if (!anim) return commit();
    this._pf = g.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 150, easing: 'ease-in', fill: 'forwards' });
    this._pf.onfinish = commit;
  }

  copyEmail = async () => {
    try { await navigator.clipboard.writeText(this.email); } catch (e) {}
    this.setState({ copied: true }); clearTimeout(this.cpT); this.cpT = setTimeout(() => this.setState({ copied: false }), 1800);
  };

  render() {
    const s = this.state, t = I18N[s.lang], email = this.email;
    const Y = new Date().getFullYear(), key = Y + s.lang + s.gh.stamp;
    // Calendar, stats and dates depend on "today" and the visitor's timezone: client only.
    let gh = null;
    if (s.mounted) {
      if (!this.ghCache[key]) this.ghCache = { [key]: buildYear(Y, s.lang, s.gh.days) };
      gh = this.ghCache[key];
    }

    const navItems = t.nav.map((label, i) => ({ label, href: HREFS[i], dot: s.sec === i + 1 ? 1 : 0, mr: s.sec === i + 1 ? '8px' : '0px' }));
    const archiveSrc = s.gh.archive || ARCHIVE;
    const archive = archiveSrc.map((p, i) => {
      const pi = PROJECTS.findIndex((q) => q.repo.endsWith('/' + p.full));
      const kind = pi >= 0 ? t.proj[pi].kind : t.other2, img = (pi >= 0 && PROJECTS[pi].img) || '';
      // Stacked backgrounds: the GitHub preview shows through if the local screenshot is missing.
      const bg = img ? `url(${img}) center/cover no-repeat, url(${PROJECTS[pi].fallback}) center/cover no-repeat, #2A2724` : '';
      return { ...p, n: String(i + 1).padStart(2, '0'), kind, url: 'https://github.com/' + p.full, meta: p.lang + ' · ' + p.year, bg };
    });
    const projects = [s.feat, ...PROJECTS.map((_, i) => i).filter((i) => i !== s.feat)].map((i, k) => {
      const p = PROJECTS[i], feat = k === 0;
      return { ...p, ...t.proj[i], ...t.cases[i], i, feat,
        flex: feat ? '1 1 100%' : '1 1 440px', imgFlex: feat ? '1.5 1 440px' : '1 1 100%',
        nameSize: feat ? 'clamp(64px,8vw,124px)' : 'clamp(32px,3vw,44px)', titleMt: feat ? 'auto' : '0px', titleGap: feat ? '18px' : '14px', descSize: feat ? '17px' : '15.5px' };
    });
    const dockItems = [
      { label: 'GitHub', value: '@SebastianGonzzalez', href: 'https://github.com/SebastianGonzzalez', target: '_blank', icon: 'icons/github.svg' },
      { label: 'Email', value: email + ' · ' + (s.copied ? t.copied : t.dockCopy), href: 'mailto:' + email, target: '_self', icon: 'icons/mail.svg', copy: true },
      { label: 'WhatsApp', value: '+57 305 309 0124', href: 'https://wa.me/573053090124', target: '_blank', icon: 'icons/message-circle.svg' },
      { label: 'Instagram', value: '@ss.ebas_', href: 'https://www.instagram.com/ss.ebas_/', target: '_blank', icon: 'icons/instagram.svg' },
    ];
    const dockCaption = s.dockHover >= 0 ? dockItems[s.dockHover].value : (s.copied ? t.copied : t.dockHint);
    const fmtDay = (d) => (s.mounted ? new Date(d).toLocaleDateString(s.lang, { day: 'numeric', month: 'short' }) : '');

    return (
      <div ref={this.root} style={css("background:#FFFFFF;color:#1C1A17;font-family:var(--font-sans);overflow-x:clip")}>

        <div ref={this.pre} aria-hidden="true" style={css('position:fixed;inset:0;z-index:100;background:#FFFFFF;display:flex;align-items:center;justify-content:center')}>
          <div style={css('display:flex;flex-direction:column;align-items:center;gap:18px;width:min(320px,80vw)')}>
            <span style={css("font-family:var(--font-serif);font-size:40px;letter-spacing:-.02em")}>Sebastián González</span>
            <span style={css("display:flex;justify-content:space-between;width:100%;font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#5C5952")}><span>{t.loading}</span><span ref={this.preNum}>000</span></span>
            <span style={css('position:relative;width:100%;height:1px;border-top:1px dashed #A6A39B')}><span ref={this.preBar} style={css('position:absolute;left:0;top:-1px;height:1px;width:100%;background:#1C1A17;transform:scaleX(0);transform-origin:left')} /></span>
          </div>
        </div>

        <header style={css('position:fixed;top:18px;left:0;right:0;z-index:50;display:flex;justify-content:space-between;align-items:center;padding:0 clamp(12px,2vw,24px);pointer-events:none')}>
          <div style={css('flex:1;display:flex')}>
            {s.wide ? (
              <nav aria-label="Principal" style={css(`pointer-events:auto;display:flex;gap:2px;padding:5px;border-radius:999px;${GLASS}`)}>
                {navItems.map((n) => (
                  <a key={n.href} href={n.href} className="h-pill" style={css('height:38px;padding:0 16px;display:flex;align-items:center;border-radius:999px;font-size:15px;color:#3E3B36;transition:background 200ms ease-out')}>
                    <span style={css(`width:5px;height:5px;border-radius:50%;background:#1C1A17;margin-right:${n.mr};opacity:${n.dot};transform:scale(${n.dot});transition:opacity 300ms ease-out,transform 300ms ${EASE},margin 300ms ${EASE}`)} />
                    <span style={css('display:block;height:18px;overflow:hidden;line-height:18px')}><span className="h-roll"><span>{n.label}</span><span aria-hidden="true">{n.label}</span></span></span>
                  </a>
                ))}
              </nav>
            ) : null}
          </div>
          <a href="#top" aria-label="Inicio" style={css(`pointer-events:auto;position:relative;width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;${GLASS};font-family:var(--font-serif);font-style:italic;font-size:22px;letter-spacing:-.02em`)}>
            SG<span ref={this.progRing} aria-hidden="true" style={css('position:absolute;inset:-1px;border-radius:50%;pointer-events:none;-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 1.5px));mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 1.5px))')} />
          </a>
          <div style={css('flex:1;display:flex;justify-content:flex-end')}>
            <div style={css(`pointer-events:auto;display:flex;gap:2px;padding:5px;border-radius:999px;${GLASS}`)}>
              <button onClick={() => this.setState((p) => ({ lang: p.lang === 'es' ? 'en' : 'es' }))} aria-label={t.langAria} className="h-pill" style={css("height:38px;padding:0 14px;border:0;background:transparent;cursor:pointer;border-radius:999px;font-family:var(--font-mono);font-size:12px;color:#1C1A17;display:flex;gap:6px;align-items:center")}>
                <span style={{ opacity: s.lang === 'es' ? 1 : 0.35 }}>ES</span><span style={{ opacity: 0.3 }}>/</span><span style={{ opacity: s.lang === 'en' ? 1 : 0.35 }}>EN</span>
              </button>
              <a href="#contacto" className="h-talk" style={css('height:38px;padding:0 18px;display:flex;align-items:center;border-radius:999px;background:#3A3733;color:#FAFAF9;font-size:15px;font-weight:500;transition:background 200ms ease-out')}>{t.talk}</a>
            </div>
          </div>
        </header>

        <div style={css('max-width:1240px;margin:0 auto;border-left:1px dashed #B4B1A9;border-right:1px dashed #B4B1A9')}>

          {/* 01 · Hero */}
          <section id="top" data-stack="" style={css('position:relative;background:#FFFFFF;padding:clamp(120px,16vh,168px) clamp(20px,4vw,56px) clamp(64px,8vw,104px);display:flex;flex-wrap:wrap;gap:clamp(32px,4vw,56px);align-items:center')}>
            <Dim />
            <div style={css('flex:1 1 440px;max-width:600px;display:flex;flex-direction:column;gap:28px')}>
              <div data-intro="" style={css('display:flex;align-items:center;gap:16px')}>
                <div style={css('position:relative;width:64px;height:64px;border-radius:50%;overflow:hidden;flex-shrink:0;filter:grayscale(1);border:1px solid rgba(28,26,23,.12)')}>
                  <Shot src="https://avatars.githubusercontent.com/u/281209723?v=4" alt="Sebastián González" placeholder="Foto" />
                </div>
                <div style={css('display:flex;flex-direction:column;gap:6px')}>
                  <span style={css('display:flex;align-items:center;gap:8px;font-size:19px;font-weight:600;letter-spacing:-.01em')}>Sebastián González<span aria-label="Verificado" style={css('width:16px;height:16px;border-radius:50%;background:#1C1A17;color:#FAFAF9;display:inline-flex;align-items:center;justify-content:center;font-size:10px')}>✓</span></span>
                  <span style={css("display:flex;flex-wrap:wrap;gap:14px;font-family:var(--font-mono);font-size:12px;color:#5C5952")}>
                    <a className="h-ink" href="https://github.com/SebastianGonzzalez" target="_blank" rel="noopener">GitHub ↗</a>
                    <a className="h-ink" href="https://wa.me/573053090124" target="_blank" rel="noopener">WhatsApp ↗</a>
                    <a className="h-ink" href="https://www.instagram.com/ss.ebas_/" target="_blank" rel="noopener">Instagram ↗</a>
                    <a className="h-ink" href={'mailto:' + email}>Email ↗</a>
                  </span>
                </div>
              </div>
              <div data-intro="" style={css(KICK)}>{t.kicker}</div>
              <h1 data-intro="" style={css("margin:0;font-family:var(--font-serif);font-weight:500;font-size:clamp(50px,6.2vw,92px);line-height:.96;letter-spacing:-.025em;text-wrap:balance")}>{t.h1a}<em style={{ fontWeight: 400 }}>{t.h1b}</em></h1>
              <p data-intro="" style={css('margin:0;font-size:18px;line-height:1.7;color:#4A4741;max-width:540px')}>
                {t.hb1}<span style={css(CHIP)}><span style={{ fontWeight: 500 }}>TS</span>TypeScript</span>, <span style={css(CHIP)}><span style={{ fontWeight: 500 }}>⚛</span>React</span>{t.and}<span style={css(CHIP)}><span style={{ fontWeight: 500 }}>N</span>Next.js</span>{t.hb2}
              </p>
            </div>

            <div ref={this.isoStage} onPointerMove={this.isoMove} onPointerLeave={this.isoLeave} style={css('flex:1.15 1 480px;position:relative;height:clamp(460px,48vw,620px);perspective:1800px;min-width:0')}>
              <div style={css("position:absolute;left:0;top:0;display:flex;gap:10px;align-items:center;font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#5C5952")}>
                <span>{t.isoK}</span><span style={css('width:24px;border-top:1px dashed #8E8B83')} /><span style={css('letter-spacing:.04em;text-transform:none')}>{t.isoHint}</span>
              </div>
              <div ref={this.isoGroup} style={css(`position:absolute;left:50%;top:52%;width:520px;height:516px;transform-style:preserve-3d;transform:translate(-50%,-50%) rotateX(14deg) rotateY(-26deg) rotateZ(-7deg);transition:transform 700ms ${EASE}`)}>
                <Layer z="0" top={404} width={520} height={112} pad="22px 26px" title={t.layers[3].t} desc={t.layers[3].d} size={28} dsize="13px" corners="tl tr bl br" />
                <div data-z="1" style={css(`position:absolute;left:0;top:326px;width:520px;height:64px;transform-style:preserve-3d;display:flex;gap:6px;transition:transform 700ms ${EASE}`)}>
                  {TILES.map((tl) => (
                    <div key={tl} className="h-tile" style={css(`position:relative;flex:1;border:1px dashed #8E8B83;background:rgba(255,255,255,.8);display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;color:#1C1A17;transition:background 200ms ease-out,transform 300ms ${EASE}`)}>
                      <Corners at="tl br" size={6} />{tl}
                    </div>
                  ))}
                </div>
                <Layer z="2" top={216} width={360} height={96} pad="18px 24px" title={t.layers[2].t} desc={t.layers[2].d} />
                <Layer z="3" top={108} width={360} height={96} pad="18px 24px" title={t.layers[1].t} desc={t.layers[1].d} />
                <Layer z="4" top={0} width={360} height={96} pad="18px 24px" title={t.layers[0].t} desc={t.layers[0].d} />
                <div data-z="3" style={css(`position:absolute;left:372px;top:0;width:148px;height:312px;transform-style:preserve-3d;transition:transform 700ms ${EASE}`)}>
                  <div style={css('position:absolute;inset:0;border:1px dashed #B9B6AE;transform:translateZ(-28px)')} />
                  <div style={css('position:absolute;inset:0;border:1px dashed #8E8B83;background:rgba(244,244,242,.72);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px')}>
                    <Corners at="tr bl" />
                    <span style={css("font-family:var(--font-serif);font-style:italic;font-size:64px;line-height:1;letter-spacing:-.04em")}>SG.</span>
                    <span style={css("font-family:var(--font-mono);font-size:11px;color:#5C5952")}>v0.4</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 02 · Enfoque */}
          <section id="enfoque" data-stack="" style={css(`${SECTION};display:flex;flex-wrap:wrap;gap:clamp(24px,3vw,40px);align-items:flex-start`)}>
            <Divider num="02" label={t.s1} />
            <Dim />
            <div style={css('flex:1 1 440px;display:flex;flex-direction:column;gap:clamp(24px,3vw,40px)')}>
              <div data-reveal="" style={css('position:relative;border:1px dashed #A6A39B;padding:clamp(28px,3.4vw,44px);display:flex;flex-direction:column;gap:20px')}>
                <Corners />
                <span style={css(KICK)}>{t.enK}</span>
                <h2 style={css("margin:0;font-family:var(--font-serif);font-weight:500;font-size:clamp(38px,4vw,56px);line-height:1.02;letter-spacing:-.02em;text-wrap:balance")}>{t.enT}</h2>
                <p style={css('margin:0;font-size:17px;line-height:1.6;color:#4A4741;max-width:500px')}>{t.enD}</p>
              </div>
              <div data-reveal="" style={css('background:#1C1A17;color:#FAFAF9;padding:clamp(28px,3.4vw,44px);display:flex;flex-direction:column;gap:20px')}>
                <span style={css(KICK.replace('#5C5952', '#A29F97'))}>{t.dfK}</span>
                <h2 style={css("margin:0;font-family:var(--font-serif);font-weight:500;font-size:clamp(38px,4vw,56px);line-height:1.02;letter-spacing:-.02em;text-wrap:balance")}>{t.dfT}</h2>
                <p style={css('margin:0;font-size:17px;line-height:1.6;color:#B9B6AE;max-width:500px')}>{t.dfD}</p>
              </div>
            </div>
            <div data-reveal="" style={css('flex:1 1 440px;display:flex;flex-direction:column;gap:18px')}>
              <span style={css(KICK)}>{t.prK}</span>
              <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));border-top:1px dashed #A6A39B;border-left:1px dashed #A6A39B')}>
                {t.pr.map((c, i) => (
                  <div key={c.t} className="h-soft" style={css('position:relative;padding:28px 26px 32px;border-right:1px dashed #A6A39B;border-bottom:1px dashed #A6A39B;display:flex;flex-direction:column;gap:14px;min-height:220px;transition:background 240ms ease-out')}>
                    <span style={css("font-family:var(--font-mono);font-size:12px;color:#5C5952")}>0{i + 1}</span>
                    <span style={css("font-family:var(--font-serif);font-size:34px;line-height:1;letter-spacing:-.015em;margin-top:auto")}>{c.t}</span>
                    <span style={css('font-size:15px;line-height:1.5;color:#4A4741')}>{c.d}</span>
                    <span style={css("font-family:var(--font-mono);font-size:11px;color:#6E6B64")}>→ {c.a}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 03 · Trabajo */}
          <section id="trabajo" data-stack="" style={css(SECTION)}>
            <Divider num="03" label={t.s2} />
            <Dim />
            <div data-reveal="" style={css('display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:clamp(36px,4vw,56px)')}>
              <div style={css('display:flex;flex-direction:column;gap:16px')}>
                <span style={css(KICK)}>{t.wkK}</span>
                <h2 style={css("margin:0;font-family:var(--font-serif);font-weight:500;font-size:clamp(48px,6vw,84px);line-height:.95;letter-spacing:-.025em")}>{t.wkT}</h2>
              </div>
              <a href="#archivo" style={css("font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;border-bottom:1px dashed #1C1A17;padding-bottom:4px")}>{t.wkAll} ↓</a>
            </div>
            <div ref={this.projGrid} style={css('display:flex;flex-wrap:wrap;gap:20px')}>
              {projects.map((p) => (
                <div
                  key={p.n}
                  data-reveal=""
                  className="h-proj"
                  style={css(`position:relative;flex:${p.flex};min-width:0;border:1px dashed #A6A39B;padding:14px;display:flex;flex-wrap:wrap;gap:22px;background:transparent;cursor:${p.feat ? 'default' : 'pointer'};transition:background 260ms ease-out,border-color 260ms ease-out`)}
                >
                  <Corners />
                  <div className="h-lift shot" style={css(`position:relative;flex:${p.imgFlex};min-width:0;align-self:flex-start;border:1px solid rgba(28,26,23,.12);background:#1C1A17;border-radius:6px;overflow:hidden;transition:transform 300ms ${EASE},box-shadow 300ms ease-out`)}>
                    <a href={p.site} target="_blank" rel="noopener" aria-label={`${p.name} · demo`} style={css('position:relative;display:block;aspect-ratio:1282/770;background:#1C1A17')}>
                      <Shot key={p.img} src={p.img} fallback={p.fallback} alt={p.ph} fit="contain" placeholder={p.ph} />
                    </a>
                    <Credit name={p.credit} href={p.creditHref} />
                  </div>
                  <div style={css('flex:1 1 260px;min-width:0;display:flex;flex-direction:column;gap:14px;padding:10px 10px 12px')}>
                    <div style={css(`display:flex;justify-content:space-between;gap:12px;${LABEL}`)}><span>{p.n} · {p.kind}</span><span>{p.lang}</span></div>
                    <div style={css(`margin-top:${p.titleMt};display:flex;flex-direction:column;gap:${p.titleGap}`)}>
                      <span style={css(`font-family:var(--font-serif);font-size:${p.nameSize};line-height:.92;letter-spacing:-.03em;text-wrap:balance`)}>{p.name}</span>
                      <span style={css(`font-size:${p.descSize};line-height:1.5;color:#4A4741;max-width:440px;text-wrap:pretty`)}>{p.desc}</span>
                    </div>
                    <div style={css('display:flex;flex-wrap:wrap;gap:6px;margin-top:auto')}>
                      {p.chips.map((ch) => <span key={ch} style={css("font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;padding:5px 8px;border:1px solid #B4B1A9;border-radius:4px;background:#F4F4F2")}>{ch}</span>)}
                    </div>
                    <div style={css('display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px')}>
                      <a href={p.repo} target="_blank" rel="noopener" className="proj-link" style={css('font-size:14px;font-weight:500;display:flex;gap:6px;border-bottom:1px dashed #1C1A17;padding-bottom:3px')}>{t.repo} ↗</a>
                      {!p.feat ? (
                        <button type="button" className="proj-pick" title={t.cTip} aria-label={`${t.cHint}: ${p.name}`} onClick={() => this.pickProject(p.i)} style={css(`${LABEL};letter-spacing:.1em;line-height:inherit;padding:0;border:0;background:transparent;cursor:pointer`)}>{t.cHint} ↑</button>
                      ) : null}
                    </div>
                  </div>
                  {p.feat ? (
                    <div style={css('flex:1 1 100%;min-width:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px 32px;margin:0 10px 6px;padding-top:22px;border-top:1px dashed #A6A39B')}>
                      <div style={css('display:flex;flex-direction:column;gap:8px')}><span style={css(CASE_K)}>{t.cProb}</span><span style={css(CASE_V)}>{p.problem}</span></div>
                      <div style={css('display:flex;flex-direction:column;gap:8px')}><span style={css(CASE_K)}>{t.cRole}</span><span style={css(CASE_V)}>{p.role}</span></div>
                      <div style={css('grid-column:1/-1;display:flex;flex-direction:column;gap:10px')}>
                        <span style={css(CASE_K)}>{t.cBuilt}</span>
                        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px 28px')}>
                          {p.built.map((b) => (
                            <div key={b} style={css(`display:flex;gap:10px;${CASE_V}`)}><span style={css("font-family:var(--font-mono);font-size:12px;color:#8E8B83;padding-top:2px")}>→</span><span>{b}</span></div>
                          ))}
                        </div>
                      </div>
                      <div style={css('display:flex;flex-direction:column;gap:8px')}><span style={css(CASE_K)}>{t.cDec}</span><span style={css(CASE_V)}>{p.decisions}</span></div>
                      <div style={css('display:flex;flex-direction:column;gap:8px')}><span style={css(CASE_K)}>{t.cRes}</span><span style={css(CASE_V)}>{p.result}</span></div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* 04 · GitHub */}
          <section id="github" data-stack="" style={css(`${SECTION};overflow:hidden`)}>
            <Divider num="04" label={t.s3} />
            <Dim />
            <div aria-hidden="true" style={css("position:absolute;right:-2%;top:clamp(40px,6vw,80px);font-family:var(--font-serif);font-style:italic;font-size:clamp(120px,19vw,280px);line-height:.8;letter-spacing:-.04em;color:#D0CEC6;pointer-events:none;white-space:nowrap")}>git log</div>
            <div data-reveal="" style={css('position:relative;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:clamp(36px,4vw,56px)')}>
              <div style={css('display:flex;flex-direction:column;gap:16px')}>
                <span style={css(KICK)}>{t.ghK}</span>
                <h2 style={css(`${H2};max-width:620px`)}>{t.ghT}</h2>
              </div>
              <a href="https://github.com/SebastianGonzzalez" target="_blank" rel="noopener" className="h-soft" style={css("display:flex;align-items:center;gap:10px;height:40px;padding:0 16px;border:1px dashed #8E8B83;border-radius:999px;background:#FFFFFF;font-family:var(--font-mono);font-size:12px;transition:background 200ms ease-out")}>
                <span style={css(`width:7px;height:7px;border-radius:50%;background:${s.gh.live ? 'oklch(0.62 0.15 150)' : '#8E8B83'}`)} />@SebastianGonzzalez · {s.gh.live ? t.ghLive : t.ghSnap} ↗
              </a>
            </div>
            <div data-reveal="" style={css('position:relative;border:1px dashed #A6A39B;background:rgba(255,255,255,.82)')}>
              <Corners />
              <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));border-bottom:1px dashed #A6A39B')}>
                <div style={css('padding:24px 26px;border-right:1px dashed #A6A39B;display:flex;flex-direction:column;gap:8px')}><span style={css(LABEL)}>{t.stTotal}</span><span style={css(STAT_N)}>{gh ? gh.total.toLocaleString() : '—'}</span></div>
                <div style={css('padding:24px 26px;border-right:1px dashed #A6A39B;display:flex;flex-direction:column;gap:8px')}><span style={css(LABEL)}>{t.stStreak}</span><span style={css(STAT_N)}>{gh ? gh.streak : '—'}<span style={css('font-size:20px;color:#5C5952')}> {t.stDays}</span></span></div>
                <div style={css('padding:24px 26px;border-right:1px dashed #A6A39B;display:flex;flex-direction:column;gap:8px')}><span style={css(LABEL)}>{t.stActive}</span><span style={css(STAT_N)}>{gh ? gh.active : '—'}<span style={css('font-size:20px;color:#5C5952')}> {t.stDays}</span></span></div>
                <div style={css('padding:24px 26px;display:flex;flex-direction:column;gap:8px')}><span style={css(LABEL)}>{t.stRepos}</span><span style={css(STAT_N)}>{s.gh.repos}</span></div>
              </div>
              <div style={css('padding:26px clamp(12px,2vw,26px);overflow-x:auto;overflow-y:hidden')}>
                <div ref={this.ghWrap} style={css('position:relative;width:max-content;display:flex;flex-direction:column;gap:8px')}>
                  <div style={css("display:grid;grid-template-columns:repeat(53,11px);gap:3px;font-family:var(--font-mono);font-size:10px;color:#5C5952;height:14px")}>
                    {gh ? gh.months.map((m) => <span key={m.l} style={css(`grid-column:${m.col};grid-row:1;white-space:nowrap`)}>{m.l}</span>) : null}
                  </div>
                  <div role="img" aria-label={gh ? `${gh.total} ${t.stTotal} · ${Y}` : t.stTotal} onPointerOver={this.ghOver} onPointerLeave={this.ghOut} style={css('display:grid;grid-template-rows:repeat(7,11px);grid-auto-flow:column;grid-auto-columns:11px;gap:3px;min-width:739px;min-height:95px')}>
                    {gh ? gh.cells.map((c, i) => (
                      <span key={i} data-tip={c.tip} className="h-cell" style={css(`width:11px;height:11px;border-radius:2px;background:${c.bg};border:${c.bd};box-sizing:border-box;transition:transform 120ms ease-out`)} />
                    )) : null}
                  </div>
                  <div ref={this.ghTip} style={css("position:absolute;left:0;top:0;pointer-events:none;opacity:0;transition:opacity 120ms ease-out;background:#1C1A17;color:#FAFAF9;font-family:var(--font-mono);font-size:11px;padding:6px 10px;border-radius:6px;white-space:nowrap")} />
                </div>
              </div>
              <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;padding:0 26px 22px;font-family:var(--font-mono);font-size:11px;color:#5C5952")}>
                <span>{t.ghNote}</span>
                <span style={css('display:flex;align-items:center;gap:4px')}>
                  {t.less}
                  <span style={css('width:11px;height:11px;border-radius:2px;background:#CAC8C0;margin-left:4px')} />
                  <span style={css('width:11px;height:11px;border-radius:2px;background:#A6A39B')} />
                  <span style={css('width:11px;height:11px;border-radius:2px;background:#7A776F')} />
                  <span style={css('width:11px;height:11px;border-radius:2px;background:#4A4741')} />
                  <span style={css('width:11px;height:11px;border-radius:2px;background:#1C1A17;margin-right:4px')} />
                  {t.more2}
                </span>
              </div>
              <div style={css('display:flex;flex-wrap:wrap;border-top:1px dashed #A6A39B')}>
                <div style={css('flex:1 1 300px;padding:26px;border-right:1px dashed #A6A39B;display:flex;flex-direction:column;gap:18px')}>
                  <span style={css(LABEL)}>{t.langs}</span>
                  <div style={css('display:flex;height:10px;gap:3px')}>
                    {s.gh.langs.map((lg, i) => <span key={lg.n} style={css(`flex:${lg.p};background:${LANG_C[i] || LANG_C[4]};border-radius:2px`)} />)}
                  </div>
                  <div style={css('display:flex;flex-direction:column;gap:10px')}>
                    {s.gh.langs.map((lg, i) => (
                      <div key={lg.n} style={css('display:flex;justify-content:space-between;align-items:center;font-size:14px')}>
                        <span style={css('display:flex;align-items:center;gap:10px')}><span style={css(`width:9px;height:9px;border-radius:2px;background:${LANG_C[i] || LANG_C[4]}`)} />{lg.n}</span>
                        <span style={css("font-family:var(--font-mono);font-size:12px;color:#5C5952")}>{lg.p}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={css('flex:2 1 460px;min-width:0;padding:26px;display:flex;flex-direction:column;gap:14px')}>
                  <span style={css(LABEL)}>Commits · $ git log --oneline</span>
                  <div style={css('display:flex;flex-direction:column')}>
                    {s.gh.commits.map((e, i) => (
                      <a key={e.h + e.repo} href={`https://github.com/${GH_USER}/${e.repo}/commit/${e.h}`} target="_blank" rel="noopener" className="h-soft" style={css('display:grid;grid-template-columns:18px 72px minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px 0;border-top:1px dashed #B4B1A9;font-size:14px;transition:background 200ms ease-out')}>
                        <span style={css('position:relative;height:100%;display:flex;justify-content:center')}><span style={css(`width:9px;height:9px;border-radius:50%;margin-top:4px;background:${i === 0 ? '#1C1A17' : '#FFFFFF'};border:1.5px solid #1C1A17;box-sizing:border-box`)} /></span>
                        <span style={css("font-family:var(--font-mono);font-size:12px;color:#5C5952")}>{e.h}</span>
                        <span style={css('min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>{e.m}</span>
                        <span style={css(`font-family:var(--font-mono);font-size:10.5px;padding:3px 7px;border-radius:4px;background:${i === 0 ? '#1C1A17' : 'transparent'};color:${i === 0 ? '#FAFAF9' : '#5C5952'};white-space:nowrap`)}>{e.repo}{s.mounted ? ' · ' + fmtDay(e.d) : ''}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 05 · Laboratorio */}
          <section id="lab" data-stack="" style={css(SECTION)}>
            <Divider num="05" label={t.s4} />
            <Dim />
            <div data-reveal="" style={css('display:flex;flex-direction:column;gap:16px;margin-bottom:clamp(36px,4vw,56px)')}>
              <span style={css(KICK)}>{t.labK}</span>
              <h2 style={css(`${H2};max-width:680px`)}>{t.labT}</h2>
            </div>
            <div data-reveal="" style={css('display:flex;flex-wrap:wrap;border-top:1px dashed #A6A39B;border-left:1px dashed #A6A39B')}>
              <div style={css('flex:2 1 520px;min-height:440px;border-right:1px dashed #A6A39B;border-bottom:1px dashed #A6A39B;display:flex;flex-direction:column')}>
                <div style={css(`display:flex;justify-content:space-between;padding:16px 20px;${LABEL}`)}><span>EXP-01 · {t.e1}</span><span>01</span></div>
                <div style={css('flex:1;position:relative;margin:0 16px;min-height:320px;background-image:radial-gradient(#ADAAA2 1px,transparent 1px);background-size:18px 18px;touch-action:none;user-select:none;overflow:hidden')}>
                  <div onPointerDown={this.startDrag} style={css('position:absolute;left:7%;top:12%;cursor:grab;background:#1C1A17;color:#FAFAF9;padding:15px 24px;border-radius:999px;font-size:15px;font-weight:500')}>{t.pSend} →</div>
                  <button type="button" onPointerDown={this.startDrag} onClick={this.toggleMotion} role="switch" aria-checked={s.motionOn} style={css('position:absolute;left:55%;top:9%;cursor:grab;background:#FAFAF9;border:1px dashed #8E8B83;padding:12px 14px;display:flex;gap:14px;align-items:center;font:inherit;color:inherit')}>
                    <span style={css('font-size:14px;font-weight:500')}>{t.pMotion}</span>
                    <span style={css(`width:46px;height:26px;border-radius:999px;background:${s.motionOn ? '#1C1A17' : '#B4B1A9'};position:relative;transition:background 220ms ${EASE}`)}>
                      <span style={css(`position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#FAFAF9;transform:${s.motionOn ? 'translateX(20px)' : 'translateX(0)'};transition:transform 220ms ${EASE}`)} />
                    </span>
                  </button>
                  <div onPointerDown={this.startDrag} style={css('position:absolute;left:10%;top:44%;cursor:grab;width:220px;background:#FAFAF9;border:1px dashed #8E8B83;padding:12px;display:flex;flex-direction:column;gap:10px')}>
                    <div style={css("height:84px;background:repeating-linear-gradient(135deg,#E6E6E4 0 1px,transparent 1px 8px);display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;color:#5C5952")}>casa-nua.png</div>
                    <div style={css('display:flex;justify-content:space-between;align-items:baseline')}><span style={css("font-family:var(--font-serif);font-size:20px")}>Casa Nua</span><span style={css("font-family:var(--font-mono);font-size:11px;color:#5C5952")}>JS</span></div>
                  </div>
                  <div onPointerDown={this.startDrag} style={css("position:absolute;left:50%;top:42%;cursor:grab;background:#FFFFFF;border:1px solid #1C1A17;padding:7px 12px;border-radius:999px;font-family:var(--font-mono);font-size:11px")}>v0.4 · HEAD</div>
                  <div onPointerDown={this.startDrag} style={css("position:absolute;left:60%;top:58%;cursor:grab;width:176px;background:#1C1A17;color:#FAFAF9;padding:16px;font-family:var(--font-serif);font-style:italic;font-size:22px;line-height:1.1")}>{t.pNote}</div>
                </div>
                <div style={css('padding:16px 20px;font-size:14px;color:#4A4741')}>{t.e1d}</div>
              </div>
              <div style={css('flex:1 1 300px;min-height:440px;border-right:1px dashed #A6A39B;border-bottom:1px dashed #A6A39B;display:flex;flex-direction:column')}>
                <div style={css(`display:flex;justify-content:space-between;padding:16px 20px;${LABEL}`)}><span>EXP-02 · {t.e2}</span><span>02</span></div>
                <div ref={this.weightBox} onPointerEnter={this.enterW} onPointerMove={this.moveW} onPointerLeave={this.leaveW} style={css('flex:1;display:flex;align-items:center;justify-content:center;cursor:crosshair;user-select:none;font-size:clamp(84px,8vw,130px);letter-spacing:-.05em;font-weight:200;line-height:1')}>
                  {['H', 'o', 'l', 'a'].map((ch) => <span key={ch} data-l="" style={css('transition:font-weight 200ms ease-out')}>{ch}</span>)}
                  <span data-l="" style={css("transition:font-weight 200ms ease-out;font-family:var(--font-serif);font-style:italic")}>.</span>
                </div>
                <div style={css('padding:16px 20px;font-size:14px;color:#4A4741')}>{t.e2d}</div>
              </div>
              <div style={css('flex:1 1 300px;min-height:440px;border-right:1px dashed #A6A39B;border-bottom:1px dashed #A6A39B;display:flex;flex-direction:column;background:#1C1A17;color:#FAFAF9')}>
                <div style={css(`display:flex;justify-content:space-between;padding:16px 20px;${LABEL.replace('#5C5952', '#A29F97')}`)}><span>EXP-03 · {t.e3}</span><span>03</span></div>
                <div onPointerMove={this.magMove} onPointerLeave={this.magLeave} style={css('flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;min-height:280px')}>
                  <div data-mag="">
                    <button onClick={() => this.setState((p) => ({ clicks: p.clicks + 1 }))} className="h-press" style={css("width:148px;height:148px;border-radius:50%;border:1px dashed #8E8B83;cursor:pointer;background:#FAFAF9;color:#1C1A17;font-family:var(--font-serif);font-style:italic;font-size:24px;transition:transform 160ms ease-out")}>{t.touch}</button>
                  </div>
                  <span aria-live="polite" style={css("font-family:var(--font-mono);font-size:12px;color:#A29F97")}>{s.clicks} {t.clicks}</span>
                </div>
                <div style={css('padding:16px 20px;font-size:14px;color:#B9B6AE')}>{t.e3d}</div>
              </div>
            </div>
          </section>

          {/* 06 · Archivo */}
          <section id="archivo" data-stack="" style={css(SECTION)}>
            <Divider num="06" label={t.s5} />
            <Dim />
            <div data-reveal="" style={css('display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:clamp(36px,4vw,56px)')}>
              <div style={css('display:flex;flex-direction:column;gap:16px')}>
                <span style={css(KICK)}>{t.arK}</span>
                <h2 style={css(H2)}>{t.arT}</h2>
              </div>
              <div style={css("display:flex;align-items:center;gap:18px;font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#5C5952")}>
                <span>{String(archiveSrc.length).padStart(2, '0')} {t.arCount}</span>
                <a href="https://github.com/SebastianGonzzalez?tab=repositories" target="_blank" rel="noopener" style={css('color:#1C1A17;border-bottom:1px dashed #1C1A17;padding-bottom:4px')}>GitHub ↗</a>
              </div>
            </div>
            <div data-reveal="" style={css('border-bottom:1px dashed #A6A39B')}>
              {archive.map((pj) => (
                <a key={pj.full} href={pj.url} target="_blank" rel="noopener" onMouseEnter={this.mqEnter} onMouseLeave={this.mqLeave} onFocus={this.mqEnter} onBlur={this.mqLeave} style={css('position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:16px;height:clamp(84px,9vw,116px);padding:0 clamp(4px,1vw,14px);border-top:1px dashed #A6A39B;overflow:hidden')}>
                  <span style={css(`${LABEL};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}><span style={{ color: '#1C1A17' }}>{pj.n}</span> · {pj.kind}</span>
                  <span style={css("font-family:var(--font-serif);font-size:clamp(36px,4.6vw,64px);line-height:1;letter-spacing:-.02em;white-space:nowrap")}>{pj.name}</span>
                  <span style={css(`${LABEL};text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>{pj.meta} ↗</span>
                  <div data-mq="" aria-hidden="true" style={css('position:absolute;inset:0;overflow:hidden;pointer-events:none;background:#1C1A17;transform:translateY(101%)')}>
                    <div style={css('width:100%;height:100%;transform:translateY(-101%)')}>
                      <div style={css('display:flex;align-items:center;height:100%;width:max-content')}>
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((r) => (
                          <span key={r} style={css('flex:none;display:flex;align-items:center;gap:clamp(18px,2.2vw,32px);padding-right:clamp(18px,2.2vw,32px)')}>
                            <span style={css("font-family:var(--font-serif);font-size:clamp(36px,4.6vw,64px);line-height:1;letter-spacing:-.02em;color:#FAFAF9;white-space:nowrap")}>{pj.name}</span>
                            {pj.bg ? <span style={css(`flex:none;height:clamp(60px,6.6vw,88px);aspect-ratio:16/10;border-radius:6px;border:1px solid #3A3733;box-shadow:0 6px 18px rgba(0,0,0,.35);background:${pj.bg}`)} /> : null}
                            <span style={css(`${LABEL};color:#A29F97;white-space:nowrap`)}>{pj.lang}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* 07 · Contacto */}
          <section id="contacto" data-stack="" style={css('position:relative;background:#FFFFFF;box-shadow:0 -28px 56px -28px rgba(28,26,23,.22);padding:clamp(88px,11vw,140px) clamp(20px,4vw,56px) 0')}>
            <Divider num="07" label={t.s6} />
            <div data-reveal="" style={css('position:relative;background:#1C1A17;color:#FAFAF9;padding:clamp(32px,5vw,72px);display:flex;flex-wrap:wrap;gap:clamp(32px,4vw,64px);align-items:flex-end')}>
              <div style={css('flex:1.2 1 420px;display:flex;flex-direction:column;gap:22px')}>
                <span style={css(KICK.replace('#5C5952', '#A29F97'))}>{t.ctK}</span>
                <h2 style={css("margin:0;font-family:var(--font-serif);font-weight:500;font-size:clamp(46px,6vw,92px);line-height:.96;letter-spacing:-.025em;text-wrap:balance")}>{t.ctT1}<em style={{ fontWeight: 400 }}>{t.ctT2}</em></h2>
                <p style={css('margin:0;font-size:17px;line-height:1.6;color:#B9B6AE;max-width:460px')}>{t.ctD}</p>
              </div>
              <div style={css('flex:1 1 340px;display:flex;flex-direction:column;align-items:flex-start;gap:18px')}>
                <span style={css(LABEL.replace('#5C5952', '#A29F97'))}>{t.dockK}</span>
                <div ref={this.dockRef} onMouseMove={this.dockMove} onMouseLeave={this.dockLeave} style={css('display:flex;align-items:flex-end;gap:14px;height:76px;padding:0 16px 12px;box-sizing:border-box;border:1px dashed #4A4640;border-radius:22px;background:#262320')}>
                  {dockItems.map((d, i) => (
                    <a
                      key={d.label}
                      data-dock=""
                      href={d.href}
                      target={d.target}
                      rel="noopener"
                      aria-label={d.label}
                      onClick={d.copy ? (e) => { e.preventDefault(); this.copyEmail(); } : undefined}
                      onMouseEnter={() => this.setState({ dockHover: i })}
                      onFocus={() => this.setState({ dockHover: i })}
                      onBlur={() => this.setState({ dockHover: -1 })}
                      style={css('position:relative;flex:none;width:52px;height:52px;border-radius:50%;background:#FAFAF9;display:flex;align-items:center;justify-content:center')}
                    >
                      <span style={css(`position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%) translateY(${s.dockHover === i ? '0px' : '4px'});opacity:${s.dockHover === i ? 1 : 0};transition:opacity 180ms ease-out,transform 220ms ${EASE};pointer-events:none;white-space:nowrap;padding:5px 10px;border-radius:6px;background:#FAFAF9;color:#1C1A17;font-family:var(--font-mono);font-size:11px`)}>{d.label}</span>
                      <span aria-hidden="true" style={css(`width:44%;height:44%;background:url(${d.icon}) center/contain no-repeat`)} />
                    </a>
                  ))}
                </div>
                <span aria-live="polite" style={css("font-family:var(--font-mono);font-size:13px;color:#B9B6AE;min-height:18px")}>{dockCaption}</span>
              </div>
            </div>
            <footer style={css('padding:clamp(48px,6vw,80px) 0 28px;display:flex;flex-direction:column;gap:28px')}>
              <div style={css('position:relative;height:clamp(96px,13vw,200px);margin:0 calc(-1 * clamp(8px,1vw,16px))')}>
                <TechText text="Sebastián González" fontWeight={500} fontSize={240} letterSpacing={-0.03} color="#1C1A17" accentColor="#1C1A17" dashLength={4} dashGap={2} strokeWidth={1.2} specks={15} reveal="letter" reach={180} style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-serif)' }} />
              </div>
              <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:14px;padding-top:18px;border-top:1px dashed #A6A39B;font-family:var(--font-mono);font-size:12px;color:#5C5952")}>
                <span>{t.footer}</span>
                <span>{s.time} · {t.localTime}</span>
                <a href="#top" className="h-ink">{t.top}</a>
              </div>
            </footer>
          </section>
        </div>

        <div aria-hidden="true" style={css(`position:fixed;left:clamp(12px,2vw,24px);bottom:clamp(12px,2vw,24px);z-index:55;display:flex;align-items:center;gap:12px;height:48px;padding:0 16px;border-radius:999px;${GLASS.replace('.8)', '.84)')};font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#5C5952`)}>
          <span><span style={{ color: '#1C1A17' }}>0{s.sec + 1}</span> / 07</span>
          <span style={css('display:flex;gap:3px')}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <span key={i} style={css(`width:14px;height:3px;border-radius:1px;background:${i <= s.sec ? '#1C1A17' : '#B4B1A9'};transition:background 300ms ease-out`)} />)}
          </span>
          <span style={css('display:block;height:14px;overflow:hidden;line-height:14px;min-width:84px')}><span ref={this.secLabelEl} style={{ display: 'block' }}>{t['s' + s.sec]}</span></span>
        </div>
      </div>
    );
  }
}
