import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import wyrm from 'eslint-plugin-wyrm';

export default defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  wyrm.configs.strictTypeChecked,
]);
