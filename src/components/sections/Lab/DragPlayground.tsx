'use client';
import { useId, type ComponentProps, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { PROFILE } from '@/config/site';
import type { Dictionary } from '@/content/i18n';
import { useDrag } from '@/hooks/useDrag';
import { cx } from '@/lib/cx';
import { useMotion } from '@/providers/MotionProvider';
import styles from './DragPlayground.module.css';

interface PieceProps extends ComponentProps<'button'> {
  onPointerDown(e: PointerEvent<HTMLElement>): void;
  onKeyDown(e: KeyboardEvent<HTMLElement>): void;
}

/** A movable piece: dragged with the pointer, or moved with the arrow keys once focused. */
function Piece({ className, ...props }: PieceProps) {
  return <button type="button" className={cx(styles.piece, className)} {...props} />;
}

/** Dot-grid board of movable pieces. One of them is the page-wide motion switch. */
export function DragPlayground({ t }: { t: Dictionary['lab'] }) {
  const { enabled, toggle } = useMotion();
  const { startDrag, moveWithKeys, wasDragged } = useDrag();
  const hintId = useId();
  const movable = {
    'aria-roledescription': t.movablePiece,
    'aria-describedby': hintId,
    onPointerDown: startDrag,
    onKeyDown: moveWithKeys,
  };

  const onSwitchClick = (e: MouseEvent) => {
    // A drag ends in a click; keyboard activation has detail 0 and always toggles.
    if (wasDragged() && e.detail > 0) return;
    toggle();
  };

  return (
    <div className={styles.board}>
      <Piece {...movable} className={styles.send}>
        {t.send} →
      </Piece>
      <Piece
        {...movable}
        aria-roledescription={undefined}
        role="switch"
        aria-checked={enabled}
        onClick={onSwitchClick}
        className={styles.switch}
      >
        <span className={styles.switchLabel}>{t.motion}</span>
        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </Piece>
      <Piece {...movable} className={styles.card}>
        <span className={styles.cardImage}>casa-nua.png</span>
        <span className={styles.cardMeta}>
          <span className={styles.cardName}>Casa Nua</span>
          <span className={styles.cardLang}>JS</span>
        </span>
      </Piece>
      <Piece {...movable} className={styles.head}>
        {PROFILE.version} · HEAD
      </Piece>
      <Piece {...movable} className={styles.note}>
        {t.pieceNote}
      </Piece>
      {/* Visible while a piece has keyboard focus; also the pieces' accessible description. */}
      <span id={hintId} className={styles.keyboardHint}>
        {t.keyboardHint}
      </span>
    </div>
  );
}
