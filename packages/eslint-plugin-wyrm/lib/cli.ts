import { ESLint } from 'eslint';
import { defineConfig } from 'eslint/config';

import wyrm from './index.js';

await main();

async function main() {
  const baseConfig = defineConfig([
    wyrm.configs.strictTypeChecked,
    {
      rules: {
        'wyrm/no-unassigned-todo': 'off',
        'wyrm/discarded-expression-statement': 'error',
      },
    },
    {
      files: ['**/*.md', '**/package.json'],
      extends: [wyrm.configs.disableTypeChecked],
    },
  ]);

  const eslint = new ESLint({
    baseConfig,
  });

  const results = await eslint.lintFiles(['.']);

  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);

  // eslint-disable-next-line no-console
  console.log(resultText);
}
