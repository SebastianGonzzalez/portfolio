import type { Metadata } from 'next';
import { NotFound } from '@/components/NotFound';
import { RootDocument } from './root-document';

export const metadata: Metadata = { title: '404 · Sebastián González', robots: { index: false } };

/**
 * 404 for every unknown URL. With one root layout per language there is no shared layout to hang a
 * regular not-found.tsx on, which is the case global-not-found exists for.
 */
export default function GlobalNotFound() {
  return (
    <RootDocument lang="es">
      <NotFound />
    </RootDocument>
  );
}
