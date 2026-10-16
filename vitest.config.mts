import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { version } from './package.json';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    env: { NEXT_PUBLIC_APP_VERSION: version },
    // Plain class names in tests ("dotActive"), so assertions can target CSS Module classes.
    css: { modules: { classNameStrategy: 'non-scoped' } },
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      // app/ is covered by the build and E2E; types.ts holds interfaces only.
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/app/**', 'src/lib/github/types.ts'],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: { lines: 85, statements: 85, functions: 85, branches: 80 },
    },
  },
});
