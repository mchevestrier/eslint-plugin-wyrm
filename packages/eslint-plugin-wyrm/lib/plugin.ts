import { createRequire } from 'node:module';

import type { Linter } from '@typescript-eslint/utils/ts-eslint';

import * as rules from './rules/index.js';

const require = createRequire(import.meta.url);

// TODO [engine:node@>=23]: Use import assertions instead
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const { name, version } = require('../package.json') as {
  name: string;
  version: string;
};

export const plugin = {
  meta: { name, version },
  rules,
} satisfies Linter.Plugin;
