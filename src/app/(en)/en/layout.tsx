import type { ReactNode } from 'react';
import { metadataFor } from '../../metadata';
import { RootDocument } from '../../root-document';

export { viewport } from '../../metadata';
export const metadata = metadataFor('en');

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
