/* eslint-disable @typescript-eslint/no-magic-numbers */

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
import * as sonarjs from 'eslint-plugin-sonarjs';
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
      'import-x/resolver-next': [createTypeScriptImportResolver(), createNodeResolver()],
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
      'eslint-plugin/require-meta-default-options': 'off',
    },
  },

  {
    files: ['**/*.{js,ts,cjs,mjs,cts,mts,jsx,tsx}'],
    ...eslintPluginUnicorn.configs.recommended,
  },

  {
    files: ['**/*.{js,ts,cjs,mjs,cts,mts,jsx,tsx}'],
    ...sonarjs.configs.recommended,
  },

  {
    files: ['**/*.{js,ts,cjs,mjs,cts,mts,jsx,tsx}'],
    rules: {
      curly: ['error', 'multi-line'],
      'no-await-in-loop': 'off',
      'no-constructor-return': 'error',
      'no-promise-executor-return': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'require-atomic-updates': 'error',

      'array-callback-return': 'error',
      'accessor-pairs': 'error',
      'arrow-body-style': 'error',
      camelcase: 'error',
      'capitalized-comments': 'error',
      complexity: 'error',
      'consistent-return': 'error',
      'default-case': 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'dot-notation': 'error',
      eqeqeq: ['error', 'smart'],
      'func-name-matching': 'error',
      'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
      'grouped-accessor-pairs': 'error',
      'guard-for-in': 'error',
      'logical-assignment-operators': 'error',
      'max-nested-callbacks': ['error', { max: 6 }],
      'new-cap': 'off',
      'no-alert': 'error',
      'no-array-constructor': 'error',
      'no-bitwise': 'off',
      'no-caller': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-continue': 'off',
      'no-div-regex': 'error',
      'no-else-return': 'error',
      'no-empty-function': 'error',
      'no-eval': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': ['error', { enforceForInnerExpressions: true }],
      'no-extra-label': 'error',
      'no-implicit-coercion': ['error', { boolean: false }],
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-label-var': 'error',
      'no-labels': 'error',
      'no-lonely-if': 'error',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-nested-ternary': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-object-constructor': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-plusplus': 'off',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unneeded-ternary': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-void': ['error', { allowAsStatement: true }],
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'operator-assignment': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-exponentiation-operator': 'error',
      'prefer-named-capture-group': 'error',
      'prefer-numeric-literals': 'error',
      'prefer-object-has-own': 'error',
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'preserve-caught-error': 'error',
      radix: 'error',
      'require-await': 'error',
      'require-unicode-regexp': 'error',
      'symbol-description': 'error',
      yoda: 'error',

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

      // See https://github.com/eslint/eslint/issues/20272
      '@typescript-eslint/unified-signatures': 'off',

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

      'sonarjs/cognitive-complexity': ['error', 20],

      'sonarjs/no-empty-test-file': 'off',
      'sonarjs/slow-regex': 'off',
      'sonarjs/todo-tag': 'off',
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
