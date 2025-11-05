import js from '@eslint/js';
// @ts-expect-error - Could not find a declaration file for module '@shopify/eslint-plugin'.
import shopifyEslintPlugin from '@shopify/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import wyrm from 'eslint-plugin-wyrm';
import * as sonarjs from 'eslint-plugin-sonarjs';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import type { Plugin } from '@eslint/core';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
  },

  {
    plugins: { shopify: shopifyEslintPlugin as Plugin },
  },

  sonarjs.configs.recommended,
  eslintPluginUnicorn.configs.recommended,

  // ...shopifyEslintPlugin.configs.esnext,
  // ...shopifyEslintPlugin.configs.typescript,
  // ...shopifyEslintPlugin.configs['typescript-type-checking'],

  {
    rules: {
      'no-else-return': 'error',

      // See https://github.com/eslint/eslint/issues/20272
      '@typescript-eslint/unified-signatures': 'off',

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/throw-new-error': 'off',
      'unicorn/new-for-builtins': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-spread': 'off',

      'shopify/prefer-early-return': 'error',
    },
  },

  wyrm.configs.strictTypeChecked,
]);
