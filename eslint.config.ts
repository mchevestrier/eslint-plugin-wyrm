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
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
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
    ...n.configs['flat/recommended-module'],
    rules: {
      ...n.configs['flat/recommended-module'].rules,
      // I'm getting an error with this rule
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },

  {
    extends: [vitest.configs.recommended],
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
    files: ['**/*.{js,ts,cjs,mjs,cts,mts,jsx,tsx}'],
    ...eslintPluginUnicorn.configs.recommended,
  },

  {
    files: ['**/*.{js,ts,cjs,mjs,cts,mts,jsx,tsx}'],
    rules: {
      curly: ['error', 'multi-line'],
      'prefer-template': 'error',
      'no-extra-boolean-cast': ['error', { enforceForInnerExpressions: true }],

      '@typescript-eslint/class-methods-use-this': 'error',
      '@typescript-eslint/consistent-return': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/max-params': ['error', { max: 5 }],
      'init-declarations': 'off',
      '@typescript-eslint/init-declarations': 'error',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      'no-loop-func': 'off',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-magic-numbers': ['error', { ignore: [0, 1, 2] }],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unsafe-type-assertion': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',

      '@typescript-eslint/parameter-properties': [
        'error',
        { prefer: 'parameter-property' },
      ],
      'prefer-destructuring': 'off',
      '@typescript-eslint/prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
      ],
      '@typescript-eslint/prefer-enum-initializers': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: true },
      ],

      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',

      'unicorn/expiring-todo-comments': 'error',

      'unicorn/switch-case-braces': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/throw-new-error': 'off',
      'unicorn/new-for-builtins': 'off',
      'unicorn/no-typeof-undefined': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/no-null': 'off',
    },
  },

  {
    files: ['**/*.md', '**/package.json'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  {
    files: ['**/*.md'],
    plugins: {
      // @ts-expect-error - Types of parameters 'context' and 'context' are incompatible.
      markdown,
    },
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
]);
