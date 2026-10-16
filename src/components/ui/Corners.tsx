import { cx } from '@/lib/cx';
import styles from './Corners.module.css';

export type Corner = 'tl' | 'tr' | 'bl' | 'br';

/** Registration marks on the corners of the nearest positioned ancestor. */
export function Corners({ at = ['tl', 'tr', 'bl', 'br'] }: { at?: Corner[] }) {
  return at.map((corner) => <span key={corner} className={cx(styles.corner, styles[corner])} />);
}
