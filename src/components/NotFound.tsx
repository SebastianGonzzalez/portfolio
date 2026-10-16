import Link from 'next/link';
import { HOME_PATH } from '@/content/i18n';
import { Corners } from '@/components/ui/Corners';
import styles from './NotFound.module.css';

/** Bilingual: we can't know which language the visitor was looking for. */
export function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <Corners />
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>
          Esta página no existe.
          <span lang="en" className={styles.translation}>
            This page doesn’t exist.
          </span>
        </h1>
        <nav className={styles.links} aria-label="Inicio · Home">
          <Link href={HOME_PATH.es} hrefLang="es" className={styles.link}>
            ← Volver al inicio
          </Link>
          <Link href={HOME_PATH.en} hrefLang="en" lang="en" className={styles.link}>
            ← Back to home
          </Link>
        </nav>
      </div>
    </main>
  );
}
