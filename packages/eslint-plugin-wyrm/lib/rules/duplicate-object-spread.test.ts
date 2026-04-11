import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './duplicate-object-spread.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Different identifiers are spread into the object literal #docs',
      code: `
const foo = { key: 42 };
const bar = { key: 42 };
export const obj = { ...foo, baz: 33, ...bar };
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'The same identifier is spread twice into the object literal #docs',
      code: `
const foo = { key: 42 };
export const obj = { ...foo, baz: 33, ...foo };
`,
      output: `
const foo = { key: 42 };
export const obj = { ...foo, baz: 33,  };
`,
      errors: [{ messageId: 'duplicateSpread' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The same identifier is spread twice into the object literal, along with another identifier',
      code: `
const foo = { key: 42 };
const bar = { key: 42 };

export const obj = { ...foo, baz: 33, ...bar, ...foo, quux: 105 };
`,
      output: `
const foo = { key: 42 };
const bar = { key: 42 };

export const obj = { ...foo, baz: 33, ...bar,  quux: 105 };
`,
      errors: [{ messageId: 'duplicateSpread' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
