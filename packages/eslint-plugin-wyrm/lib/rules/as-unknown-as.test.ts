import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './as-unknown-as.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: '`as unknown` #docs',
      code: `
const foo = bar as unknown;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as X as Y`',
      code: `
const foo = bar as string as 'foo';
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`as unknown as Y` #docs',
      code: `
const foo = bar as unknown as string;
`,
      errors: [{ messageId: 'noAsUnknownAs' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
