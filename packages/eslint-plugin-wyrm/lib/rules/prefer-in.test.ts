import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-in.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With `in` #docs',
      code: `
foo in bar;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With `Object.hasOwn()` #docs',
      code: `
Object.hasOwn(bar, foo);
`,
      errors: [
        {
          messageId: 'preferIn',
          suggestions: [
            {
              messageId: 'useIn',
              output: `
foo in bar;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Object.prototype.hasOwnProperty.call()` #docs',
      code: `
Object.prototype.hasOwnProperty.call(bar, foo);
`,
      errors: [
        {
          messageId: 'preferIn',
          suggestions: [
            {
              messageId: 'useIn',
              output: `
foo in bar;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a string literal',
      code: `
Object.hasOwn(bar, 'foo');
`,
      errors: [
        {
          messageId: 'preferIn',
          suggestions: [
            {
              messageId: 'useIn',
              output: `
'foo' in bar;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
