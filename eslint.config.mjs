import { readdirSync } from 'node:fs';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import sonarjs from 'eslint-plugin-sonarjs';

// Layers, lowest first. A layer may import from the layers before it, never from the ones after it.
//   config → content → lib → providers → hooks → components → app
const LAYERS = ['config', 'content', 'lib', 'providers', 'hooks', 'components', 'app'];
const layerZones = LAYERS.slice(0, -1).map((layer, i) => ({
  target: `./src/${layer}`,
  from: LAYERS.slice(i + 1).map((upper) => `./src/${upper}`),
  message: `"${layer}" sits below ${LAYERS.slice(i + 1).join(', ')} and must not import from them.`,
}));

// Sections are independent: shared pieces go in components/ui.
const sections = readdirSync('src/components/sections');
const sectionZones = sections.map((name) => ({
  target: `./src/components/sections/${name}`,
  from: './src/components/sections',
  except: [`./${name}`],
  message: 'Sections must not import each other. Move shared code to components/ui.',
}));

const uiZone = {
  target: './src/components/ui',
  from: ['./src/components/sections', './src/components/layout'],
  message: 'UI primitives must not depend on sections or layout.',
};

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  sonarjs.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'import/no-restricted-paths': ['error', { zones: [...layerZones, ...sectionZones, uiZone] }],
    },
  },
  {
    // Playwright fixtures call `use()`, which is not a React hook.
    files: ['tests/e2e/**'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'tests/**'],
    rules: {
      // Tests stub browser APIs and poke at DOM nodes directly.
      '@typescript-eslint/no-non-null-assertion': 'off',
      'sonarjs/no-nested-functions': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'source/**',
    'coverage/**',
    'test-results/**',
    'playwright-report/**',
    'next-env.d.ts',
  ]),
]);
