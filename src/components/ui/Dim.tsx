import styles from './Dim.module.css';

/** Dark layer over a section; the stacked scroll fades it in as the next section covers this one. */
export function Dim() {
  return <div data-dim="" aria-hidden="true" className={styles.dim} />;
}
