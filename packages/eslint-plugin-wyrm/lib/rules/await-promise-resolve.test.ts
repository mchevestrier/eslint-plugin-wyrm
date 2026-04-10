import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './await-promise-resolve.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Not immediately awaited #docs',
      code: `
const promise = Promise.resolve(42);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`await Promise.resolve()` #docs',
      code: `
async function foo() {
  await Promise.resolve();
}
`,
      output: `
async function foo() {
  
}
`,
      errors: [
        {
          messageId: 'noAwaitPromiseResolve',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an argument #docs',
      code: `
async function foo(x: unknown) {
  await Promise.resolve(x);
}
`,
      output: `
async function foo(x: unknown) {
  await x;
}
`,
      errors: [
        {
          messageId: 'noAwaitPromiseResolve',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`return await Promise.resolve()` #docs',
      code: `
async function foo() {
  return await Promise.resolve();
}
`,
      output: `
async function foo() {
  return undefined;
}
`,
      errors: [
        {
          messageId: 'noAwaitPromiseResolve',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
