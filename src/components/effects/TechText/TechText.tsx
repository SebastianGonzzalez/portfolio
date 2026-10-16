'use client';
// TechText — adapted from React Bits (JS-CSS variant): canvas lettering whose glyphs can be inspected and dragged.
import { useEffect, useRef, type CSSProperties } from 'react';
import { mountTechText, type TechTextSettings } from './engine';

export type TechTextProps = Partial<TechTextSettings> & { className?: string; style?: CSSProperties };

const DEFAULTS: TechTextSettings = {
  text: 'React Bits',
  fontFamily: '',
  fontWeight: 600,
  fontSize: 150,
  letterSpacing: -0.05,
  color: '#ffffff',
  accentColor: '#ffffff',
  reach: 200,
  softness: 0.7,
  dashLength: 4,
  dashGap: 2,
  strokeWidth: 1.5,
  lineStyle: 'dashed',
  reveal: 'letter',
  specks: 15,
  selection: true,
  labels: true,
  draggable: true,
  sweep: true,
  speed: 1,
};

const BOX_STYLE: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  touchAction: 'pan-y',
  userSelect: 'none',
};
const CANVAS_STYLE: CSSProperties = { display: 'block', width: '100%', height: '100%' };

export function TechText({ className, style, ...props }: TechTextProps) {
  const settings: TechTextSettings = { ...DEFAULTS, ...props };
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef<TechTextSettings | null>(null);
  const wakeRef = useRef<() => void>(() => {});

  // The engine reads the latest settings each frame; poke it so changes show up.
  useEffect(() => {
    settingsRef.current = settings;
    wakeRef.current();
  });

  useEffect(() => mountTechText(containerRef.current, canvasRef.current, settingsRef, wakeRef), []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...BOX_STYLE, ...style }}
      role="img"
      aria-label={settings.text}
    >
      <canvas ref={canvasRef} style={CANVAS_STYLE} />
    </div>
  );
}
