import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import boundaries from 'eslint-plugin-boundaries';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // App Router only project: disable Pages Router link check
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'ui', pattern: 'src/components/ui' },
        { type: 'layout', pattern: 'src/components/layout' },
        { type: 'analytics', pattern: 'src/components/analytics' },
        {
          type: 'feature',
          pattern: 'src/features/*',
          capture: ['featureName'],
        },
        { type: 'contracts', pattern: 'src/lib/api/contracts' },
        { type: 'adapters', pattern: 'src/lib/api/adapters' },
        { type: 'api', pattern: 'src/lib/api' },
        { type: 'lib', pattern: 'src/lib' },
        { type: 'content', pattern: 'src/content' },
        { type: 'locales', pattern: 'src/locales' },
      ],
      'boundaries/ignore': ['**/*.test.ts', '**/*.test.tsx'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'allow',
          policies: [
            // components/ui primitives must not import from features or app
            {
              from: { element: { type: 'ui' } },
              disallow: [
                { to: { element: { type: 'feature' } } },
                { to: { element: { type: 'app' } } },
              ],
              message: 'components/ui primitives must not import from features or app.',
            },
            // features must not import each other directly (share via lib or contracts)
            {
              from: { element: { type: 'feature' } },
              disallow: [
                {
                  to: {
                    element: {
                      type: 'feature',
                      captured: { featureName: '!{{from.captured.featureName}}' },
                    },
                  },
                },
              ],
              message:
                'Features must not import each other directly. Share via src/lib/ or contracts.',
            },
          ],
        },
      ],
    },
  },
  // Enforce adapter boundary: ONLY src/lib/api/container.ts may import concrete adapters
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/lib/api/container.ts', 'src/lib/api/adapters/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/api/adapters/**', '../adapters/**', './adapters/**'],
              message:
                'Adapters may only be imported inside src/lib/api/container.ts. Features and app must depend on contracts from src/lib/api/contracts.',
            },
          ],
        },
      ],
    },
  },
  // Enforce Medusa SDK import boundary: ONLY inside src/lib/api/adapters/medusa/
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/lib/api/adapters/medusa/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@medusajs/js-sdk',
              message:
                'The Medusa SDK may only be imported inside src/lib/api/adapters/medusa/.',
            },
          ],
          patterns: [
            {
              group: ['@medusajs/*'],
              message:
                'Medusa SDK packages may only be imported inside src/lib/api/adapters/medusa/.',
            },
          ],
        },
      ],
    },
  },
  // Enforce process.env boundary: ONLY inside src/lib/env.ts and src/lib/env.public.ts
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/lib/env.ts',
      'src/lib/env.public.ts',
      'src/instrumentation.ts',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MemberExpression[object.name="process"][property.name="env"]',
          message:
            'Direct access to process.env is forbidden. Read validated env from src/lib/env.ts (server) or src/lib/env.public.ts (client).',
        },
      ],
    },
  },
  // Global file ignores
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'coverage/**',
      'playwright-report/**',
      'next-env.d.ts',
      'node_modules/**',
    ],
  },
];

export default eslintConfig;
