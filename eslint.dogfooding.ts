import { defineConfig } from 'eslint/config';

import baseConfig from './eslint.config.js';

import wyrm from 'eslint-plugin-wyrm';

export default defineConfig([
  ...baseConfig,
  wyrm.configs.strictTypeChecked,
  {
    rules: {
      'wyrm/no-unassigned-todo': 'off',
    },
  },
]);
