import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './empty-for.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Not an empty `for` loop #docs',
      code: `
for (let i = 0; i < 42; i++) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a completely empty `for` loop (init is not empty)',
      code: `
for (let i = 0; ; ) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a completely empty `for` loop (test is not empty)',
      code: `
for (; i < 42; ) {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a completely empty `for` loop (update is not empty)',
      code: `
for (; ; i++) {}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Empty `for` loop #docs',
      code: `
for (;;) {}
`,
      output: `
while (true) {}
`,
      errors: [
        {
          messageId: 'noEmptyFor',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
