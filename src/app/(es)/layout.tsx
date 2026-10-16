import type { ReactNode } from 'react';
import { metadataFor } from '../metadata';
import { RootDocument } from '../root-document';

export { viewport } from '../metadata';
export const metadata = metadataFor('es');

export default function SpanishLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
