import { createRequire } from 'node:module';

import type { ESLint } from 'eslint';

import * as configs from './configs/index.js';
import * as rules from './rules/index.js';

const require = createRequire(import.meta.url);

const { name, version } = require('../package.json') as {
  name: string;
  version: string;
};

export const plugin = {
  meta: { name, version },
  configs,
  rules: rules as unknown as ESLint.Plugin['rules'],
} satisfies ESLint.Plugin;
