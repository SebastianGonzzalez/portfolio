'use client';
import { useEffect, type RefObject } from 'react';
import { useMotion } from '@/providers/MotionProvider';
import { useScrollStackChannels } from '@/providers/ScrollStackProvider';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Stacked scroll: every `[data-stack]` child of the container sticks once fully scrolled, and tilts back
 * and dims (its `[data-dim]` layer) while the next section slides over it. Also publishes which section
 * is in view, and fixes in-page anchors, which sticky stacking would otherwise send to the wrong place.
 */
export function useStackedSections(containerRef: RefObject<HTMLElement | null>) {
  const { isActive } = useMotion();
  const { setActive, heroCover, scrollRequest } = useScrollStackChannels();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let sections: HTMLElement[] = [];
    let dims: (HTMLElement | null)[] = [];
    let progress: (number | undefined)[] = [];
    let raf = 0;

    const layout = () => {
      const vh = window.innerHeight;
      sections = [...container.querySelectorAll<HTMLElement>(':scope > [data-stack]')];
      dims = sections.map((s) => s.querySelector<HTMLElement>(':scope > [data-dim]'));
      // Read every height before writing any style, so the browser lays out once instead of once per section.
      const tops = sections.map((s) => Math.min(0, vh - s.offsetHeight));
      sections.forEach((s, i) => {
        s.style.position = 'sticky';
        s.style.top = tops[i] + 'px';
        s.style.zIndex = String(i + 1);
        s.style.transformOrigin = `50% ${Math.round(-tops[i] + vh / 2)}px`;
      });
    };

    const cover = (i: number, p: number) => {
      const s = sections[i];
      if (isActive()) {
        s.style.transform =
          p > 0
            ? `perspective(1800px) rotateX(${(p * 6).toFixed(2)}deg) scale(${(1 - p * 0.07).toFixed(4)})`
            : '';
        s.style.willChange = p > 0 && p < 1 ? 'transform' : '';
      } else s.style.transform = '';
      const dim = dims[i];
      if (dim) dim.style.opacity = (p * 0.3).toFixed(3);
    };

    const frame = () => {
      const vh = window.innerHeight;
      let current = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= vh * 0.5) current = i;
        if (i === sections.length - 1) continue;
        const p = clamp01((vh - sections[i + 1].getBoundingClientRect().top) / vh);
        const previous = progress[i];
        if (p === previous) continue;
        progress[i] = p;
        cover(i, p);
        if (i === 0) heroCover.emit({ progress: p, previous: previous ?? 0 });
      }
      setActive(current);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        frame();
      });
    };

    // Sticky sections overlap: a section's real offset is the sum of the sections above it.
    const scrollToSection = (id: string) => {
      const index = sections.findIndex((s) => s.id === id);
      if (index < 0) return false;
      let y = container.getBoundingClientRect().top + window.scrollY;
      for (let k = 0; k < index; k++) y += sections[k].offsetHeight;
      window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: isActive() ? 'smooth' : 'auto' });
      return true;
    };

    const onAnchorClick = (e: MouseEvent) => {
      // Cmd/Ctrl/Shift/Alt-click and non-primary buttons keep their native behaviour (new tab, etc.).
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      if (scrollToSection(link.getAttribute('href')!.slice(1))) e.preventDefault();
    };

    layout();
    frame();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onAnchorClick);
    const resize = new ResizeObserver(() => {
      layout();
      frame();
    });
    resize.observe(container);
    const unsubscribe = scrollRequest.subscribe(scrollToSection, { replay: true });
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onAnchorClick);
      resize.disconnect();
      cancelAnimationFrame(raf);
      progress = [];
    };
  }, [containerRef, isActive, setActive, heroCover, scrollRequest]);
}
