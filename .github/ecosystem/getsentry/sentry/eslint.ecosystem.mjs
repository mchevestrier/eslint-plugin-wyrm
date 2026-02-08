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

      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
  },

  globalIgnores([
    '.devenv/**/*',
    '.github/**/*',
    '.mypy_cache/**/*',
    '.pytest_cache/**/*',
    '.venv/**/*',
    '**/*.d.ts',
    '**/dist/**/*',
    'tests/**/fixtures/**/*',
    '!tests/js/**/*',
    '**/vendor/**/*',
    'build-utils/**/*',
    'config/chartcuterie/config.js',
    'fixtures/artifact_bundle/**/*',
    'fixtures/artifact_bundle_debug_ids/**/*',
    'fixtures/artifact_bundle_duplicated_debug_ids/**/*',
    'fixtures/profiles/embedded.js',
    'jest.config.ts',
    'api-docs/**/*',
    'src/sentry/static/sentry/js/**/*',
    'src/sentry/templates/sentry/**/*',
    'stylelint.config.js',
    '.artifacts/**/*',

    // Additional ignored files:
    'src/sentry/**/*',
    '**/*.md',
    '**/package.json',
  ]),

  wyrm.configs.strictTypeChecked,

  {
    files: ['**/*.md', '**/package.json'],
    extends: [wyrm.configs.disableTypeChecked],
  },
]);
