import { dirname } from 'path';
import { fileURLToPath } from 'url';
import nextConfig from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // React configuration
  {
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // React Hooks configuration
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Next.js configuration
  {
    plugins: {
      '@next/next': nextConfig,
    },
    rules: {
      ...nextConfig.configs.recommended.rules,
      ...nextConfig.configs['core-web-vitals'].rules,
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/types/api.d.ts', // Auto-generated OpenAPI types
      'commitlint.config.js', // CJS config file
    ],
  },

  // TypeScript and Import rules
  {
    files: ['**/*.{ts,tsx,spec.ts,spec.tsx,test.ts,test.tsx,d.ts}'],
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      ...importPlugin.flatConfigs.typescript.settings,
    },
    plugins: { import: importPlugin },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Import plugin rules
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,
      'import/default': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          alphabetize: { order: 'asc', caseInsensitive: false },
        },
      ],
      'import/extensions': 'off',
      'import/namespace': 'off',
      'import/no-unresolved': 'off',
      'import/no-dynamic-require': 'off',
      'import/named': 'off',
      'import/prefer-default-export': 'off',

      // TypeScript rules
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/quotes': ['warn', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-inferrable-types': 'error',
      'no-void': ['error', { allowAsStatement: true }],
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],

      // Rules explicitly turned off
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      'prefer-destructuring': 'off',
      'no-plusplus': 'off',
      'no-restricted-globals': 'off',
      'global-require': 'off',
      'no-case-declarations': 'off',
      'no-param-reassign': 'off',
      'no-restricted-syntax': 'off',
      'no-await-in-loop': 'off',
      'consistent-return': 'off',
      'no-continue': 'off',
      'default-case': 'off',
      'func-names': 'off',
      'prefer-regex-literals': 'off',
      'no-promise-executor-return': 'off',
      'default-param-last': 'off',
    },
  },

  // Prettier configuration must be the last one to override other styling rules.
  prettierConfig,
];

export default eslintConfig;
