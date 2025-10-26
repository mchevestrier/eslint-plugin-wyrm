import js from '@eslint/js';
import markdown from '@eslint/markdown';
import tsParser from '@typescript-eslint/parser';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import { importX, createNodeResolver } from 'eslint-plugin-import-x';
import n from 'eslint-plugin-n';
import * as packageJson from 'eslint-plugin-package-json';
import globals from 'globals';
import * as tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['**/dist/*', 'examples/*', '**/coverage/*'],
  },

  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
      },
    },
  },

  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  {
    files: ['**/*.md', '**/package.json'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },

  {
    extends: [packageJson.configs.recommended],
    files: ['**/package.json'],
    settings: {
      packageJson: {
        enforceForPrivate: false,
      },
    },
  },

  {
    ...n.configs['flat/recommended-module'],
    rules: {
      ...n.configs['flat/recommended-module'].rules,
      // I'm getting an error with this rule
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },

  {
    extends: [
      // @ts-expect-error - Types of parameters 'context' and 'context' are incompatible.
      vitest.configs.recommended,
    ],
    files: ['**/*.test.*'],
    rules: { '@typescript-eslint/no-unsafe-assignment': 'off' },
  },

  {
    plugins: {
      // @ts-expect-error - Types of property 'configs' are incompatible.
      'import-x': importX,
    },
    extends: ['import-x/flat/recommended', 'import-x/flat/typescript'],
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver(/* Your override options go here */),
        createNodeResolver(/* Your override options go here */),
      ],
    },
    rules: {
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // TODO: I'm getting an error with this
  // eslintPlugin.configs.recommended,
  {
    files: ['lib/rules/*.{js,ts}'],
    ...eslintPlugin.configs.recommended,
    rules: {
      ...eslintPlugin.configs.recommended.rules,
      'eslint-plugin/meta-property-ordering': 'error',
      'eslint-plugin/no-property-in-node': 'error',
      'eslint-plugin/prefer-placeholders': 'error',
      'eslint-plugin/prefer-replace-text': 'error',
      'eslint-plugin/report-message-format': 'error',
      'eslint-plugin/require-meta-docs-description': [
        'error',
        { pattern: '^(Enforce|Require|Disallow|Forbid)' },
      ],
      'eslint-plugin/require-meta-docs-url': 'off',
      'eslint-plugin/consistent-output': 'error',
      'eslint-plugin/require-test-case-name': ['error', { require: 'always' }],
      'eslint-plugin/unique-test-case-names': 'error',
      'eslint-plugin/test-case-shorthand-strings': 'off',
    },
  },

  {
    rules: {
      curly: ['error', 'multi-line'],
      'prefer-template': 'error',
      'no-extra-boolean-cast': ['error', { enforceForInnerExpressions: true }],

      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
]);
