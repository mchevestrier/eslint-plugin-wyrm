import process from 'node:process';

import { defineConfig, globalIgnores } from 'eslint/config';
import wyrm from 'eslint-plugin-wyrm';
import * as tseslint from 'typescript-eslint';

export default defineConfig([
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
      reportUnusedInlineConfigs: 'off',
    },
  },

  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
  },

  globalIgnores([
    '**/dist/**',
    '**/node_modules/**',
    '**/server.js',
    '**/webpack.config*.js',
    'examples/todos-flow',
    '**/*.md',
    '**/package.json',
  ]),

  wyrm.configs.strictTypeChecked,
  {
    files: ['examples/**/*.js', '**/*.cjs'],
    extends: [wyrm.configs.disableTypeChecked],
  },
]);
