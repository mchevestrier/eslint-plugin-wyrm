import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-type-guard.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Not a type guard #docs',
      code: `
function isString(x: unknown) {
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple return type #docs',
      code: `
function getString(x: unknown): string | null {
  if (typeof x === 'string') return x;
  return null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Type predicate in a callback #docs',
      code: `
[1, 2, 3, null, 5].filter((x): x is string => typeof x === 'string');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Type predicate in a callback (with a function expression)',
      code: `
[1, 2, 3, null, 5].filter(function (x): x is string {
  return typeof x === 'string';
});
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Type guard #docs',
      code: `
function isString(x: unknown): x is string {
  return typeof x === 'string';
}
`,
      errors: [{ messageId: 'noTypeGuard' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an arrow function',
      code: `
const isString = (x: unknown): x is string => {
  return typeof x === 'string';
};
`,
      errors: [{ messageId: 'noTypeGuard' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function expression',
      code: `
const isString = function (x: unknown): x is string {
  return typeof x === 'string';
};
`,
      errors: [{ messageId: 'noTypeGuard' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `asserts` #docs',
      code: `
function assertsIsString(x: unknown): asserts x is string {
  if (typeof x === 'string') return;
  throw Error('Not a string');
}
`,
      errors: [{ messageId: 'noTypeGuard' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
