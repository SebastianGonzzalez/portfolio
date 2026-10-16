'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Shot.module.css';

interface ShotProps {
  src: string;
  /** Tried once if `src` fails. */
  fallback?: string;
  alt: string;
  fit?: 'cover' | 'contain';
  /** Shown when every source fails. */
  placeholder: string;
  /** Intrinsic size, so the browser can reserve space before the image loads. */
  width: number;
  height: number;
  /** Above the fold: load right away instead of lazily. */
  priority?: boolean;
}

/**
 * Image that fills its positioned parent, falling back to a second source and then to a text placeholder.
 * Give it `key={src}` so a new source starts fresh. Exposes `data-fallback` / `data-placeholder` for styling.
 */
export function Shot({
  src,
  fallback,
  alt,
  fit = 'cover',
  placeholder,
  width,
  height,
  priority = false,
}: ShotProps) {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  const fail = () => {
    if (fallback && current !== fallback) setCurrent(fallback);
    else setFailed(true);
  };

  // A load error during hydration fires before React attaches onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) fail();
  });

  if (failed) {
    return (
      <div data-placeholder="" className={styles.placeholder}>
        {placeholder}
      </div>
    );
  }
  return (
    // Static export with images.unoptimized: next/image adds nothing here, and the fallback chain needs a plain <img>.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      className={styles.image}
      src={current}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={fail}
      data-fallback={current !== src ? '' : undefined}
      style={{ objectFit: fit }}
    />
  );
}
