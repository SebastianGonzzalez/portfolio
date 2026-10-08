import { EB_Garamond, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// Self-hosted by next/font. Components reference the families through these CSS variables.
const serif = EB_Garamond({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif' });
const sans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const mono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

export const metadata = {
  title: 'Sebastián González · Portfolio',
  description: 'Estudiante de Ingeniería de Software. Interfaces que se sienten bien: TypeScript, React y Next.js.',
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
