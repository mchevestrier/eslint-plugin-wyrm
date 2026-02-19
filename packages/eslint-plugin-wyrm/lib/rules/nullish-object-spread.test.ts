import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './nullish-object-spread.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No useless fallback #docs',
      code: `
const foo = null;
const obj = { ...foo };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Regular property (not spread)',
      code: `
const foo = null;
const obj = { foo: foo ?? {} };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Spread with non-logical expression',
      code: `
const foo = undefined;
const obj = { ...foo() };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Spread with OR operator instead of nullish coalescing',
      code: `
const foo = null;
const obj = { ...(foo || {}) };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Spread with AND operator',
      code: `
const foo = null;
const obj = { ...(foo && {}) };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing with non-object expression on right',
      code: `
const foo = null;
const obj = { ...(foo ?? bar) };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing with non-empty object fallback',
      code: `
const foo = null;
const obj = { ...(foo ?? { bar: 'baz' }) };
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Useless fallback #docs',
      code: `
const foo = null;
const obj = { ...(foo ?? {}) };
`,
      errors: [{ messageId: 'uselessFallback' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
